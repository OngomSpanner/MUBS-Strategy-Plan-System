const mysql = require('mysql2/promise');

async function checkTrackingSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('--- activity_tracking schema ---');
        const [cols] = await connection.query("DESCRIBE activity_tracking");
        cols.forEach(col => {
            console.log(`${col.Field}: ${col.Type} (Null: ${col.Null})`);
        });

        // Check some sample data to see the frequency
        console.log('--- activity_tracking sample ---');
        const [rows] = await connection.query("SELECT * FROM activity_tracking LIMIT 5");
        console.log(rows);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTrackingSchema();
