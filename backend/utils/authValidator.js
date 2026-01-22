const bcrypt = require('bcrypt');

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const getPasswordErrors = (password) => {
    const errors = [];

    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
        errors.push("Password must contain at least one special character (!@#$%^&*).");
    }

    return errors;
};

const compareUserPassword = async (passowrdHash, password) => {
    if (!passowrdHash) return false;
    return await bcrypt.compare(password, passowrdHash);
}

module.exports = { getPasswordErrors, isValidEmail, compareUserPassword }