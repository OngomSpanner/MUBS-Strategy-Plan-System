const mysql = require('mysql2/promise');

async function updateSchema() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Checking for existing columns...');
        const [columns] = await connection.query("SHOW COLUMNS FROM strategic_activities");
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('priority')) {
            console.log('Adding priority column...');
            await connection.query("ALTER TABLE strategic_activities ADD COLUMN priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium' AFTER status");
        } else {
            console.log('Priority column already exists.');
        }

        if (!columnNames.includes('parent_id')) {
            console.log('Adding parent_id column...');
            await connection.query("ALTER TABLE strategic_activities ADD COLUMN parent_id INT NULL AFTER priority");
            console.log('Adding foreign key...');
            await connection.query("ALTER TABLE strategic_activities ADD CONSTRAINT fk_parent_activity FOREIGN KEY (parent_id) REFERENCES strategic_activities(id) ON DELETE SET NULL");
        } else {
            console.log('Parent_id column already exists.');
        }

        console.log('Schema updated successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err.message);
        process.exit(1);
    }
}

updateSchema();
