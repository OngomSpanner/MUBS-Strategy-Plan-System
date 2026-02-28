const mysql = require('mysql2/promise');
const fs = require('fs');

async function dumpSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [tables] = await connection.query("SHOW TABLES");
        let output = '';

        for (const row of tables) {
            const tableName = Object.values(row)[0];
            output += `--- Table: ${tableName} ---\n`;
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            output += JSON.stringify(columns, null, 2) + '\n\n';
        }

        fs.writeFileSync('schema_dump.txt', output);
        console.log('Schema dumped to schema_dump.txt');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

dumpSchema();
