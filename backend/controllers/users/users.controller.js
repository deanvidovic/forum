const db = require('../../db');

const getAllUsers = async (req, res) => {
    try {
        const users = await db.any("select * from users");
        res.send({users});
        console.log(users);
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: "ne radi" })
    }
}

module.exports = getAllUsers;