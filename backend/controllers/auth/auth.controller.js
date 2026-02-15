require('dotenv').config();
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { compareUserPassword } = require('../../utils/authValidator');


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.oneOrNone(
            `SELECT id, username, email, password_hash, role FROM users WHERE email = $1`,
            [email]
        )

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid e-mail or password.'
            })
        }

        const isValid = await compareUserPassword(user.password_hash, password);

        if (!isValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid e-mail or password.'
            })
        } 

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email, // Koristimo email iz baze
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '3d' }
        )

        return res.status(200).json({
            status: 'success',
            message: 'Login successful!',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error.'
        })
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        console.log()

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