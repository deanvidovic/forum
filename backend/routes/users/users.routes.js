const express = require('express');
const router = express.Router();

const { updateUser, adminAddUser } = require('../../controllers/users/users.controller');
const { verifyToken } = require('../../middlewares/auth/token.validation');

router.post("/admin/create", verifyToken, adminAddUser);
router.put("/:id", verifyToken, updateUser);

module.exports = router;