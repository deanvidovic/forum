const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth/token.validation');
const { getAllCategories } = require('../../controllers/category/categories.controller');

router.get("/categories", getAllCategories);

module.exports = router;