const mysql = require('mysql2/promise');

async function listTables() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [rows] = await connection.query("SHOW TABLES");
        console.log(JSON.stringify(rows, null, 2));

        for (const row of rows) {
            const tableName = Object.values(row)[0];
            console.log(`--- Schema for ${tableName} ---`);
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            console.log(JSON.stringify(columns, null, 2));
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

listTables();
