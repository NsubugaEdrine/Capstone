const db = require("../config/db")

// Add comment
exports.addComment = async (req, res) => {
    const { project_id, comment } = req.body
    const user_id = req.user?.id
    const user_name = req.user?.name || "Anonymous"

    if (!user_id) {
        return res.status(401).json({ error: "Authentication required" })
    }
    if (!comment || !comment.trim()) {
        return res.status(400).json({ error: "Comment cannot be empty" })
    }

    const sql = `INSERT INTO comments (project_id, user_id, user_name, comment) VALUES (?, ?, ?, ?)`
    try {
        const [result] = await db.query(sql, [project_id, user_id, user_name, comment.trim()])
        res.json({ message: "Comment added", commentId: result.insertId })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Get project comments
exports.getComments = async (req, res) => {
    const project_id = req.params.id
    const sql = `
        SELECT comments.id, comments.comment, comments.user_name, comments.created_at,
               COALESCE(comments.user_name, users.name) as display_name
        FROM comments
        LEFT JOIN users ON comments.user_id = users.id
        WHERE comments.project_id = ?
        ORDER BY comments.created_at DESC
    `
    try {
        const [result] = await db.query(sql, [project_id])
        const formatted = result.map(r => ({
            id: r.id,
            comment: r.comment,
            user_name: r.user_name || r.display_name || "Anonymous",
            created_at: r.created_at
        }))
        res.json(formatted)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
