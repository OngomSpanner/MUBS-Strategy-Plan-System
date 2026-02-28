const mysql = require('mysql2/promise');

async function checkTracking() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [cols] = await connection.query("DESCRIBE activity_tracking");
        console.log('--- Cols ---');
        console.log(cols.map(c => `${c.Field}: ${c.Type}`).join('\n'));

        const [rows] = await connection.query("SELECT * FROM activity_tracking LIMIT 5");
        console.log('--- Data ---');
        console.log(JSON.stringify(rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkTracking();
