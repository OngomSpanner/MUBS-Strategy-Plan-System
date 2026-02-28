const mysql = require('mysql2/promise');

async function checkStrategicSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('--- strategic_activities schema ---');
        const [cols] = await connection.query("DESCRIBE strategic_activities");
        cols.forEach(col => {
            console.log(`${col.Field}: ${col.Type} (Null: ${col.Null})`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkStrategicSchema();
