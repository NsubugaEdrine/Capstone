require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

async function runDiagnosis() {
    console.log("--- UCU Hub Backend Diagnosis ---");
    const results = {
        timestamp: new Date().toISOString(),
        database: { status: 'Checking...' },
        files: { status: 'Checking...' },
        env: { status: 'Checking...' }
    };

    // 1. Check Database
    try {
        await db.query('SELECT 1');
        results.database.status = 'Connected';
        
        try {
            const [rows] = await db.query("SHOW TABLES LIKE 'users'");
            results.database.usersTable = rows.length > 0 ? 'Exists' : 'Missing';
        } catch (tableErr) {
            results.database.usersTable = 'Error checking tables';
        }
    } catch (err) {
        results.database.status = 'Failed';
        results.database.error = err.message;
    }

    // 2. Check Empty Files
    const directories = ['controllers', 'routes', 'middleware', 'models'];
    results.files.empty = [];
    results.files.missing = [];

    for (const dir of directories) {
        const dirPath = path.join(__dirname, dir);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                if (stats.size === 0) {
                    results.files.empty.push(`${dir}/${file}`);
                }
            }
        } else {
            results.files.missing.push(dir);
        }
    }
    results.files.status = 'Scan Complete';

    // 3. Environment Variables
    const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
    results.env.missing = requiredEnv.filter(key => !process.env[key]);
    results.env.status = results.env.missing.length === 0 ? 'All Present' : 'Missing Variables';

    console.log(JSON.stringify(results, null, 2));
    return results;
}

if (require.main === module) {
    runDiagnosis().then(() => process.exit());
}

module.exports = runDiagnosis;
