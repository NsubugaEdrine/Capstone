const db = require("../config/db")

// Projects per faculty
exports.projectsPerFaculty = async (req, res) => {
    const sql = `
        SELECT faculty, COUNT(*) as total_projects
        FROM projects
        GROUP BY faculty
    `
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// the current statistics of pending, approved, rejected
exports.projectStatusStats = async (req, res) => {
    const sql = `
        SELECT status, COUNT(*) as total
        FROM projects
        GROUP BY status
    `
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// trending technologies such as react, python etc.
exports.trendingTechnologies = async (req, res) => {
    const sql = `
        SELECT technology, COUNT(*) as usage_count
        FROM projects
        GROUP BY technology
        ORDER BY usage_count DESC
        LIMIT 5
    `
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Most active students tags.
exports.mostActiveStudents = async (req, res) => {
    const sql = `
        SELECT users.name, COUNT(projects.id) as total_projects
        FROM projects
        JOIN users ON projects.student_id = users.id
        GROUP BY users.name
        ORDER BY total_projects DESC
        LIMIT 5
    `
    try {
        const [result] = await db.query(sql);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}