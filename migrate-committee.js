const mysql = require('mysql2/promise');

async function migrateCommittee() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Checking for existing columns in committee_proposals table...');
        const [columns] = await connection.query("SHOW COLUMNS FROM committee_proposals");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('committee_type')) {
            console.log('Adding committee_type column...');
            await connection.query("ALTER TABLE committee_proposals ADD COLUMN committee_type ENUM('Council', 'TMC', 'Academic Board', 'Other') DEFAULT 'Other' AFTER id");
        }

        if (!columnNames.includes('minute_reference')) {
            console.log('Adding minute_reference column...');
            await connection.query("ALTER TABLE committee_proposals ADD COLUMN minute_reference VARCHAR(100) NULL AFTER title");
        }

        if (!columnNames.includes('pillar_id')) {
            console.log('Adding pillar_id column...');
            await connection.query("ALTER TABLE committee_proposals ADD COLUMN pillar_id INT NULL AFTER budget");
        }

        if (!columnNames.includes('implementation_status')) {
            console.log('Adding implementation_status column...');
            await connection.query("ALTER TABLE committee_proposals ADD COLUMN implementation_status VARCHAR(50) DEFAULT 'Pending' AFTER status");
        }

        console.log('Committee migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error during migration:', err.message);
        process.exit(1);
    }
}

migrateCommittee();
