const mysql = require('mysql2/promise');

async function migrate_comm() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'sps'
    });

    const alterQueries = [
        'ALTER TABLE strategic_activities ADD COLUMN proposal_kpi VARCHAR(255) DEFAULT NULL',
        'ALTER TABLE strategic_activities ADD COLUMN evidence_url VARCHAR(255) DEFAULT NULL',
        'ALTER TABLE strategic_activities ADD COLUMN meeting_reference VARCHAR(100) DEFAULT NULL',
        'ALTER TABLE strategic_activities ADD COLUMN committee_suggestion_unit_id INT DEFAULT NULL'
    ];

    for (let q of alterQueries) {
        try {
            await connection.query(q);
            console.log('Success:', q);
        } catch (e) {
            console.log('Error/Exists:', e.message);
        }
    }

    await connection.end();
}

migrate_comm();
