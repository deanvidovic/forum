const db = require('../../db');

const getAllThreads = async (req, res) => {
  const userId = req.user ? req.user.id : null; 

  const query = `
    SELECT 
      t.*, 
      u.username,
      c.name as category_name,
      (SELECT COUNT(*) FROM likes WHERE thread_id = t.id)::int as likes_count,
      EXISTS(SELECT 1 FROM likes WHERE thread_id = t.id AND user_id = $1) as "isLiked"
    FROM threads t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN categories c ON t.category_id = c.id
    ORDER BY t.created_at DESC
  `;

  try {
    const result = await db.query(query, [userId]); 
    res.status(200).json(result); 
  } catch (err) {
    console.error("SQL ERROR:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju threadova" });
  }
};

const createThread = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            return res.status(403).json({ message: "Administratori ne mogu kreirati nove objave." });
        }

        const { title, content, categoryId } = req.body;
        const userId = req.user.id;

        const newThread = await db.one(
            "INSERT INTO threads (title, content, user_id, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, content, userId, categoryId]
        );
        res.status(201).json(newThread);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const updateThread = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;
        
        const thread = await db.oneOrNone("SELECT * FROM threads WHERE id = $1", [id]);

        if (!thread) return res.status(404).json({ message: "Thread nije pronađen" });
        
        if (thread.user_id !== userId) {
            return res.status(403).json({ message: "Zabranjeno: Možete uređivati samo svoje objave" });
        }

        const updated = await db.one(
            "UPDATE threads SET title = $1, content = $2 WHERE id = $3 RETURNING *",
            [title, content, id]
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const deleteThread = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role; 

        const thread = await db.oneOrNone("SELECT * FROM threads WHERE id = $1", [id]);

        if (!thread) return res.status(404).json({ message: "Thread nije pronađen" });

        if (thread.user_id !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: "Zabranjeno: Nemate ovlasti za brisanje ove objave" });
        }

        await db.none("DELETE FROM threads WHERE id = $1", [id]);
        res.status(200).json({ message: "Thread uspješno obrisan" });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const getThreadsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const threads = await db.any(`
            SELECT t.*, c.name as category_name, u.username,
            (SELECT COUNT(*) FROM likes WHERE thread_id = t.id)::int as likes_count
            FROM threads t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE t.user_id = $1
            ORDER BY t.created_at DESC
        `, [id]);
        res.status(200).json(threads);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const toggleLike = async (req, res) => {
    const threadId = req.params.id;
    const userId = req.user.id;

    try {
        const existingLike = await db.oneOrNone(
            'SELECT * FROM likes WHERE user_id = $1 AND thread_id = $2',
            [userId, threadId]
        );

        if (existingLike) {
            await db.none('DELETE FROM likes WHERE user_id = $1 AND thread_id = $2', [userId, threadId]);
            return res.json({ liked: false });
        } else {
            await db.none('INSERT INTO likes (user_id, thread_id) VALUES ($1, $2)', [userId, threadId]);
            return res.json({ liked: true });
        }
    } catch (err) {
        console.error("DETALJNA GREŠKA NA BACKENDU:", err); 
        res.status(500).json({ message: "Greška na serveru prilikom lajkanja" });
    }
};

const getThreadById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
        const thread = await db.oneOrNone(`
            SELECT t.*, u.username, c.name as category_name,
            (SELECT COUNT(*) FROM likes WHERE thread_id = t.id)::int as likes_count,
            EXISTS(SELECT 1 FROM likes WHERE thread_id = t.id AND user_id = $2) as "isLiked"
            FROM threads t
            LEFT JOIN users u ON t.user_id = u.id
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = $1
        `, [id, userId]);

        if (!thread) return res.status(404).json({ message: "Thread nije pronađen" });

        const comments = await db.any(`
            SELECT com.*, u.username 
            FROM comments com
            JOIN users u ON com.user_id = u.id
            WHERE com.thread_id = $1
            ORDER BY com.created_at ASC
        `, [id]);

        res.status(200).json({ ...thread, comments });
    } catch (err) {
        console.error("SQL ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

const addComment = async (req, res) => {
    try {
        if (req.user && req.user.role === 'admin') {
            return res.status(403).json({ message: "Administratori ne mogu ostavljati komentare." });
        }

        const { content, threadId } = req.body;
        const userId = req.user.id;
        const newComment = await db.one(
            "INSERT INTO comments (content, thread_id, user_id) VALUES ($1, $2, $3) RETURNING *",
            [content, threadId, userId]
        );
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

const getLikedThreadsByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        const threads = await db.any(`
            SELECT t.*, c.name as category_name, u.username,
            (SELECT COUNT(*) FROM likes WHERE thread_id = t.id)::int as likes_count,
            true as "isLiked"
            FROM threads t
            JOIN likes l ON t.id = l.thread_id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE l.user_id = $1
            ORDER BY l.created_at DESC
        `, [id]);

        res.status(200).json(threads);
    } catch (err) {
        console.error("SQL ERROR (Liked):", err);
        res.status(500).json({ status: "error", message: err.message });
    }
};

const getUserStats = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.one(`
            SELECT COUNT(*)::int as thread_count 
            FROM threads 
            WHERE user_id = $1
        `, [id]);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
};

module.exports = {
    getAllThreads,
    createThread,
    updateThread,
    deleteThread,
    getThreadsByUserId,
    toggleLike,
    getThreadById,
    addComment,
    getLikedThreadsByUserId,
    getUserStats
};