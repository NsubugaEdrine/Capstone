/*
Project Database Schema (As per HeidiSQL script):
- id: INT AUTO_INCREMENT PRIMARY KEY
- title: VARCHAR(200)
- description: TEXT
- category: VARCHAR(100)
- faculty: VARCHAR(100)
- technology: VARCHAR(200)
- github_link: VARCHAR(255)
- document: VARCHAR(255)
- status: ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'
- student_id: INT
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- FOREIGN KEY (student_id) REFERENCES users(id)
*/

module.exports = {};
