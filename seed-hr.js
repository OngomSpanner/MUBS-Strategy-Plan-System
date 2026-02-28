const mysql = require('mysql2/promise');

async function seedHR() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Seeding mock HR data...');

        // Set a user's contract to expire in 12 days
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 12);
        const expiryStr = expiryDate.toISOString().slice(0, 10);

        await connection.query("UPDATE users SET contract_end_date = ? WHERE role = 'Staff' LIMIT 1", [expiryStr]);

        // Set another user to be on leave
        await connection.query("UPDATE users SET leave_status = 'On Leave' WHERE role = 'Staff' AND contract_end_date IS NULL LIMIT 1");

        console.log('Mock data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
}

seedHR();
