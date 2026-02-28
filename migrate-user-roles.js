const mysql = require('mysql2/promise');

async function migrateUserRoles() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Modifying users.role column to VARCHAR(255)...');
        await connection.query("ALTER TABLE users MODIFY COLUMN role VARCHAR(255) DEFAULT 'Staff'");

        console.log('User roles migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error during migration:', err.message);
        process.exit(1);
    }
}

migrateUserRoles();
