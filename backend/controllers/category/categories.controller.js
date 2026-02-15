const db = require('../../db');

const getAllCategories = async (req, res) => {
    try {
        const categories = await db.any('SELECT id, name, description FROM categories'); 
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ 
            message: 'We are not able to fetch categories right now. Please try again later.', 
            error: error.message 
        });
    }
}

module.exports = { getAllCategories };