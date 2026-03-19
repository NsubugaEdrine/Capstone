/*
User Database Schema:
- id: INT AUTO_INCREMENT PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- email: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL
- role: ENUM('student', 'supervisor', 'admin') DEFAULT 'student'
- faculty: VARCHAR(255)
- created_at: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
*/

module.exports = {};
