const mysql = require('mysql2/promise');

async function checkCommitteeSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [cols] = await connection.query("DESCRIBE committee_proposals");
        cols.forEach(col => {
            console.log(`${col.Field}: ${col.Type} (Null: ${col.Null})`);
        });

        const [tables] = await connection.query("SHOW TABLES LIKE 'committee_activities'");
        if (tables.length > 0) {
            console.log('--- committee_activities ---');
            const [actCols] = await connection.query("DESCRIBE committee_activities");
            actCols.forEach(col => {
                console.log(`${col.Field}: ${col.Type} (Null: ${col.Null})`);
            });
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCommitteeSchema();
