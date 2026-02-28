const mysql = require('mysql2/promise');

async function migrateTracking() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Adding "progress" column to activity_tracking...');
        await connection.query("ALTER TABLE activity_tracking ADD COLUMN progress INT DEFAULT 0 AFTER activity_type");

        // Also rename 'notes' to 'comment' if needed, or just use notes. 
        // The previous script used 'comment', let's check if we should rename or just use 'notes'.
        // I'll just use 'notes' in my code and ignore the 'comment' typo in previous scratch script.

        console.log('Migration SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error('Migration FAILED:', err.message);
        process.exit(1);
    }
}

migrateTracking();
