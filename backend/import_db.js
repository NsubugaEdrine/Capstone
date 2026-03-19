const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'edrine',
        multipleStatements: true
    });

    try {
        const sql = fs.readFileSync(path.join(__dirname, 'config/database.sql'), 'utf8');
        // Split by semicolon, but be careful with multiline or comments.
        // Actually, mysql2 supports multipleStatements: true.
        
        console.log('Dropping and recreating database...');
        await connection.query('DROP DATABASE IF EXISTS ucuhub');
        await connection.query('CREATE DATABASE ucuhub');
        await connection.query('USE ucuhub');
        
        console.log('Running schema script...');
        // We filter out the CREATE DATABASE and USE commands if they exist in the script to avoid conflict,
        // but since we just did it, we can just run the rest.
        // Or just run the whole thing if it's safe.
        await connection.query(sql);
        
        console.log('Database imported successfully!');
    } catch (error) {
        console.error('Error importing database:', error);
    } finally {
        await connection.end();
    }
}

importDatabase();
