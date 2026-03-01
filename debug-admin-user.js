const mysql = require('mysql2/promise');

async function checkAdminUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        const [rows] = await connection.query("SELECT id, full_name, email, role FROM users WHERE email = 'admin@mubs.ac.ug'");
        console.log("Admin User Data:", rows);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

checkAdminUser();
