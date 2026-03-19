const db = require("../config/db");

exports.getAllProjects = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM projects");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    const { 
        title, 
        description, 
        category, 
        faculty, 
        technology, 
        github_link 
    } = req.body;

    const studentId = req.user?.id;
    const document = req.file ? req.file.filename : null;

    if (!studentId) {
        return res.status(401).json({ error: "Authentication required to submit projects" });
    }

    try {
        const sql = `
            INSERT INTO projects 
            (title, description, category, faculty, technology, github_link, document, student_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            title, 
            description, 
            category, 
            faculty || null, 
            technology, 
            github_link, 
            document, 
            studentId
        ]);
        
        res.json({ 
            message: "Project submitted successfully", 
            projectId: result.insertId,
            file: document 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjects = async (req, res) => {
    const sql = "SELECT * FROM projects";
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.approveProject = async (req, res) => {
    const projectId = req.params.id;
    const sql = "UPDATE projects SET status='approved' WHERE id=?";
    try {
        await db.query(sql, [projectId]);
        res.json({ message: "Project approved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.rejectProject = async (req, res) => {
    const projectId = req.params.id;
    const sql = "UPDATE projects SET status='rejected' WHERE id=?";
    try {
        await db.query(sql, [projectId]);
        res.json({ message: "Project rejected" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        const [rows] = await db.query(
            `SELECT p.*, u.name as student_name, u.email as student_email 
             FROM projects p 
             LEFT JOIN users u ON p.student_id = u.id 
             WHERE p.id = ? AND p.status = 'approved'`,
            [projectId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getApprovedProjects = async (req, res) => {
    const { search, category, technology, faculty, year } = req.query;

    let sql = "SELECT * FROM projects WHERE status='approved'";
    const params = [];

    if (search) {
        sql += " AND (title LIKE ? OR description LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }
    if (technology) {
        sql += " AND technology LIKE ?";
        params.push(`%${technology}%`);
    }
    if (faculty) {
        sql += " AND faculty = ?";
        params.push(faculty);
    }
    if (year) {
        sql += " AND YEAR(created_at) = ?";
        params.push(year);
    }

    sql += " ORDER BY id DESC";

    try {
        const [result] = await db.query(sql, params);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectMilestones = async (req, res) => {
    const projectId = req.params.id;
    const sql = "SELECT * FROM milestones WHERE project_id = ?";
    try {
        const [result] = await db.query(sql, [projectId]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMilestone = async (req, res) => {
    const projectId = req.params.id;
    const { title, description } = req.body;
    const sql = "INSERT INTO milestones (project_id, title, description) VALUES (?, ?, ?)";
    try {
        const [result] = await db.query(sql, [projectId, title, description]);
        res.json({ message: "Milestone added successfully", milestoneId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMilestoneStatus = async (req, res) => {
    const milestoneId = req.params.milestoneId;
    const { status } = req.body; // 'pending' or 'completed'
    const sql = "UPDATE milestones SET status = ? WHERE id = ?";
    try {
        await db.query(sql, [status, milestoneId]);
        res.json({ message: "Milestone status updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateProjectProgress = async (req, res) => {
    const projectId = req.params.id;
    const { progress } = req.body; // 0 to 100
    const sql = "UPDATE projects SET progress = ? WHERE id = ?";
    try {
        await db.query(sql, [progress, projectId]);
        res.json({ message: "Project progress updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProjectComments = async (req, res) => {
    const projectId = req.params.id;
    const sql = "SELECT * FROM comments WHERE project_id = ? ORDER BY created_at DESC";
    try {
        const [result] = await db.query(sql, [projectId]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addProjectComment = async (req, res) => {
    const projectId = req.params.id;
    const { comment } = req.body;
    
    // Extracted from authMiddleware token
    const userId = req.user.id; 
    const userName = req.user.name;

    if (!comment || comment.trim() === "") {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const sql = "INSERT INTO comments (project_id, user_id, user_name, comment) VALUES (?, ?, ?, ?)";
    try {
        const [result] = await db.query(sql, [projectId, userId, userName, comment]);
        res.json({ message: "Comment added successfully", commentId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
