const mysql = require('mysql2/promise');

async function listCols() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [cols] = await connection.query("SHOW COLUMNS FROM activity_tracking");
        console.log('COLUMNS IN activity_tracking:');
        cols.forEach(c => console.log(`- ${c.Field}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listCols();
