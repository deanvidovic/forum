const db = require('../../db');
const { isValidEmail, getPasswordErrors } = require('../../utils/validators');

const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || username.length <= 3) {
        return res.status(400).json({
            message: 'Username must be at least 3 characters long.'
        })
    }
    
    if (!isValidEmail(email)) {
        return res.status(400).json({
            message: 'Invalid e-mail address.'
        })
    }

    const passwordErrors = getPasswordErrors(password);

    if (passwordErrors.length > 0) {
        return res.status(400).json({
            message: 'Password does not meet requirements.',
            details: passwordErrors
        })
    }

    next();
};


const isUserUnique = async (req, res, next) => {
    const { username, email } = req.body;
    try {
        const existingUser = await db.oneOrNone(
            `SELECT email, username FROM users WHERE email = $1 OR username = $2`,
            [email, username]
        );

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({
                    message: 'E-mail is already registered.'
                })
            }

            if (existingUser.username === username) {
                return res.status(409).json({
                    message: 'Username is already registered.'
                })
            }
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Database error during uniqueness check.'
        })
    }
};

module.exports = { validateRegister, isUserUnique };