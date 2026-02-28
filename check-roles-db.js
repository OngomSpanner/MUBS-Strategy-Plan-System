const mysql = require('mysql2/promise');

async function checkRolesTables() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [tables] = await connection.query("SHOW TABLES");
        console.log('--- Tables ---');
        console.log(tables.map(t => Object.values(t)[0]));

        // Check users table again to see the 'role' column type
        const [cols] = await connection.query("DESCRIBE users");
        cols.forEach(col => {
            if (col.Field === 'role') {
                console.log(`users.role: ${col.Type} (Null: ${col.Null})`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRolesTables();
