const mysql = require('mysql2/promise');

async function checkUsersSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('--- users schema ---');
        const [cols] = await connection.query("DESCRIBE users");
        cols.forEach(col => {
            console.log(`${col.Field}: ${col.Type} (Null: ${col.Null})`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsersSchema();
