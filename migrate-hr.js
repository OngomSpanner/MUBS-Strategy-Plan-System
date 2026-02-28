const mysql = require('mysql2/promise');

async function migrateHR() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Checking for existing columns in users table...');
        const [columns] = await connection.query("SHOW COLUMNS FROM users");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('contract_end_date')) {
            console.log('Adding contract_end_date column...');
            await connection.query("ALTER TABLE users ADD COLUMN contract_end_date DATE NULL AFTER status");
        } else {
            console.log('contract_end_date column already exists.');
        }

        if (!columnNames.includes('leave_status')) {
            console.log('Adding leave_status column...');
            await connection.query("ALTER TABLE users ADD COLUMN leave_status ENUM('On Duty', 'On Leave', 'Sick Leave', 'Annual Leave') DEFAULT 'On Duty' AFTER contract_end_date");
        } else {
            console.log('leave_status column already exists.');
        }

        // Seed some mock data for verification purposes if requested, 
        // but for now just ensure columns exist.

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error during migration:', err.message);
        process.exit(1);
    }
}

migrateHR();
