require('dotenv').config({ path: 'c:/Users/edrine/OneDrive/Desktop/ucuHub/backend/.env' });
const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'edrine',
        database: process.env.DB_NAME || 'ucuhub'
    });

    console.log("Connected to database.");

    try {
        console.log("Adding 'progress' column to 'projects'...");
        await connection.query(`
            ALTER TABLE projects 
            ADD COLUMN progress INT DEFAULT 0 AFTER status
        `);
        console.log("'progress' column added.");
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("'progress' column already exists.");
        } else {
            console.error("Error adding progress column:", err.message);
        }
    }

    try {
        console.log("Creating 'milestones' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS milestones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                status ENUM('pending', 'completed') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
        `);
        console.log("'milestones' table created.");
    } catch (err) {
        console.error("Error creating milestones table:", err.message);
    }

    await connection.end();
    console.log("Migration finished.");
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
