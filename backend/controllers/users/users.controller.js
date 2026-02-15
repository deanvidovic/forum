const db = require('../../db');
const bcrypt = require('bcrypt');
const { getPasswordErrors, isValidEmail } = require('../../utils/authValidator'); // Uvoz tvojih validatora

/**
 * Ažuriranje profila (Korisnik sam sebe)
 */
const updateUser = async (req, res) => {
    const { id } = req.params;
    let { username, email, bio } = req.body;

    if (!req.user) {
        return res.status(401).json({ message: "Niste autorizirani." });
    }

    const authenticatedUserId = req.user.id;
    if (parseInt(id) !== authenticatedUserId) {
        return res.status(403).json({ message: "Nemate dozvolu za ovu akciju." });
    }

    // Provjera username-a
    if (username !== undefined && username.trim().length < 3) {
        return res.status(400).json({ message: "Korisničko ime mora imati barem 3 znaka." });
    }

    // Provjera email-a koristeći tvoj isValidEmail
    if (email !== undefined && !isValidEmail(email.trim())) {
        return res.status(400).json({ message: "Neispravan format e-mail adrese." });
    }

    const finalUsername = username?.trim() || null;
    const finalEmail = email?.trim() || null;
    const finalBio = bio !== undefined ? bio.trim() : null;

    try {
        const query = `
            UPDATE users 
            SET username = COALESCE($1, username), 
                email = COALESCE($2, email), 
                bio = COALESCE($3, bio)
            WHERE id = $4
            RETURNING id, username, email, bio, role;
        `;

        const updatedUser = await db.one(query, [finalUsername, finalEmail, finalBio, id]);

        res.json({ 
            message: "Profil uspješno ažuriran!", 
            user: updatedUser 
        });

    } catch (err) {
        if (err.code === 0 || err.message === 'No data returned from the query.') {
            return res.status(404).json({ message: "Korisnik nije pronađen." });
        }
        console.error("Database Error:", err);
        if (err.code === '23505') {
            const detail = err.detail.toLowerCase();
            if (detail.includes('email')) return res.status(400).json({ message: "E-mail adresa je već u upotrebi." });
            if (detail.includes('username')) return res.status(400).json({ message: "Korisničko ime je već zauzeto." });
        }
        res.status(500).json({ message: "Greška na serveru." });
    }
};

const adminAddUser = async (req, res) => {
    let { username, email, password, role } = req.body;

    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: "Pristup odbijen. Samo admin može kreirati korisnike." });
    }

    if (!username || username.trim().length < 3) {
        return res.status(400).json({ message: "Username mora imati barem 3 znaka." });
    }

    if (!email || !isValidEmail(email.trim())) {
        return res.status(400).json({ message: "Unesite ispravnu e-mail adresu." });
    }

    const passwordErrors = getPasswordErrors(password || "");
    if (passwordErrors.length > 0) {
        return res.status(400).json({ 
            message: "Lozinka nije dovoljno jaka.", 
            details: passwordErrors 
        });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `
            INSERT INTO users (username, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, email, role;
        `;

        const newUser = await db.one(query, [
            username.trim(),
            email.trim().toLowerCase(),
            hashedPassword,
            role || 'user'
        ]);

        res.status(201).json({
            message: "Korisnik uspješno kreiran!",
            user: newUser
        });

    } catch (err) {
        console.error("Admin Create Error:", err);
        if (err.code === '23505') {
            const detail = err.detail.toLowerCase();
            if (detail.includes('email')) return res.status(400).json({ message: "E-mail je već u upotrebi." });
            if (detail.includes('username')) return res.status(400).json({ message: "Username je već zauzet." });
        }
        res.status(500).json({ message: "Serverska greška pri kreiranju korisnika." });
    }
};

module.exports = { updateUser, adminAddUser };