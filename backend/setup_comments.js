const db = require("./config/db");

async function createCommentsTable() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                user_id INT NOT NULL,
                user_name VARCHAR(255) NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `;
        await db.query(sql);
        console.log("Comments table created successfully.");
    } catch (error) {
        console.error("Error creating comments table:", error);
    } finally {
        process.exit();
    }
}

createCommentsTable();
