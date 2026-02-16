const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth/token.validation');

const { 
    getAllThreads, 
    createThread, 
    deleteThread, 
    updateThread, 
    getThreadsByUserId, 
    getLikedThreadsByUserId, 
    getUserStats,            
    toggleLike,
    getThreadById,
    addComment
} = require('../../controllers/threads/threads.controller.js');

router.get("/threads", verifyToken, getAllThreads);
router.post("/threads", verifyToken, createThread);
router.get("/threads/:id", verifyToken, getThreadById); 
router.put("/threads/:id", verifyToken, updateThread);
router.delete("/threads/:id", verifyToken, deleteThread);

router.get("/threads/user/:id", verifyToken, getThreadsByUserId);
router.get("/threads/liked/:id", verifyToken, getLikedThreadsByUserId);
router.get("/threads/stats/:id", verifyToken, getUserStats);           

router.post("/threads/:id/like", verifyToken, toggleLike);
router.post('/threads/comments', verifyToken, addComment);

module.exports = router;