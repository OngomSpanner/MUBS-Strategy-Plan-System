const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '', // Assuming default WAMP password is empty
        database: 'sps'
    });

    try {
        await connection.query('ALTER TABLE strategic_activities ADD COLUMN assigned_to int DEFAULT NULL');
        console.log('Added assigned_to');
    } catch (e) {
        console.log(e.message);
    }

    try {
        await connection.query('ALTER TABLE strategic_activities ADD COLUMN reviewer_notes text DEFAULT NULL');
        console.log('Added reviewer_notes');
    } catch (e) {
        console.log(e.message);
    }

    await connection.end();
}

migrate();
