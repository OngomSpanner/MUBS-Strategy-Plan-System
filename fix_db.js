const mysql = require('mysql2/promise');

async function fix_db() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin'
    });

    try {
        const [rows] = await connection.query('SHOW COLUMNS FROM strategic_activities');
        console.log("Columns:", rows.map(r => r.Field).join(', '));

        // Re-attempt to add the missing ones explicitly
        const cols = rows.map(r => r.Field);
        if (!cols.includes('proposal_kpi')) {
            await connection.query('ALTER TABLE strategic_activities ADD COLUMN proposal_kpi VARCHAR(255) DEFAULT NULL');
            console.log("Added proposal_kpi");
        }
        if (!cols.includes('evidence_url')) {
            await connection.query('ALTER TABLE strategic_activities ADD COLUMN evidence_url VARCHAR(255) DEFAULT NULL');
            console.log("Added evidence_url");
        }
        if (!cols.includes('meeting_reference')) {
            await connection.query('ALTER TABLE strategic_activities ADD COLUMN meeting_reference VARCHAR(100) DEFAULT NULL');
            console.log("Added meeting_reference");
        }
        if (!cols.includes('committee_suggestion_unit_id')) {
            await connection.query('ALTER TABLE strategic_activities ADD COLUMN committee_suggestion_unit_id INT DEFAULT NULL');
            console.log("Added committee_suggestion_unit_id");
        }
    } catch (e) {
        console.error("DB Error:", e);
    }
    await connection.end();
}

fix_db();
