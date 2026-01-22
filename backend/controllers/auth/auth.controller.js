const db = require('../../db');
const bcrypt = require('bcrypt');


const login = async (req, res) => {

};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        await db.none(
            `INSERT INTO users(username, email, password_hash) VALUES ($1, $2, $3)`,
            [username, email, passwordHash]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Registration successful.'
        });

    } catch (error) {
        res.status(500).json(
            { status: 'error', message: "We are not able to register you right now. Please try again later." }
        );
    }
};


module.exports = { login, register };