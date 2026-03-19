const pool = require('./config/db');
const fs = require('fs');

async function checkDatabase() {
    try {
        const results = {};
        const [tables] = await pool.query('SHOW TABLES');
        results.tables = tables;
        
        const [projects] = await pool.query('SELECT * FROM projects');
        results.projects = projects;
        
        if (tables.some(t => Object.values(t).includes('projects'))) {
            const [columns] = await pool.query('DESCRIBE projects');
            results.schema = columns;
        }
        
        fs.writeFileSync('db_results.json', JSON.stringify(results, null, 2));
        console.log('Results written to db_results.json');
        process.exit(0);
    } catch (error) {
        console.error('Error querying database:', error);
        process.exit(1);
    }
}

checkDatabase();
