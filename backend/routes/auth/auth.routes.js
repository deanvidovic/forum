const express = require('express');
const router = express.Router();

const { login, register } = require('../../controllers/auth/auth.controller');
const { validateRegister, isUserUnique, validateLogin } = require('../../middlewares/auth/auth.validation');

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, isUserUnique, register);

module.exports = router;