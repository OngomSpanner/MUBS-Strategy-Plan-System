const mysql = require('mysql2/promise');

async function checkSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [cols] = await connection.query("DESCRIBE activity_tracking");
        console.log(cols);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
