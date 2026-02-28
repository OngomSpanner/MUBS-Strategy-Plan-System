const mysql = require('mysql2/promise');

async function verifyUiUser() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Verifying user "Test Agent User"...');
        const [rows] = await connection.query("SELECT * FROM users WHERE email = 'test.agent@mubs.ac.ug'");

        if (rows.length > 0) {
            const user = rows[0];
            console.log(`User found: ${user.full_name}`);
            console.log(`Roles: ${user.role}`);
            console.log(`Department: ${user.department}`);
            console.log('Verification SUCCESS');
        } else {
            console.log('User NOT found in database.');
            console.log('Verification FAILED');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verifyUiUser();
