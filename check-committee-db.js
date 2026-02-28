const mysql = require('mysql2/promise');

async function checkCommitteeSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('--- committee_proposals schema ---');
        const [cols] = await connection.query("DESCRIBE committee_proposals");
        console.log(JSON.stringify(cols, null, 2));

        // Also check if there's a specialized activities table for committees
        const [tables] = await connection.query("SHOW TABLES LIKE 'committee_activities'");
        if (tables.length > 0) {
            console.log('--- committee_activities schema ---');
            const [actCols] = await connection.query("DESCRIBE committee_activities");
            console.log(JSON.stringify(actCols, null, 2));
        } else {
            console.log('No specialized committee_activities table found.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCommitteeSchema();
