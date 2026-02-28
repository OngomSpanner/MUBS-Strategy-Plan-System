const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedMultiRoles() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Seeding users with multiple roles...');

        const passwordHash = await bcrypt.hash('Welcome@2025', 10);

        const testUsers = [
            {
                full_name: 'Dr. Alice Okello',
                email: 'a.okello@mubs.ac.ug',
                role: 'HOD, Committee Member',
                department: 'Faculty of Computing',
                status: 'Active'
            },
            {
                full_name: 'John Kato',
                email: 'j.kato@mubs.ac.ug',
                role: 'System Administrator, Strategy Manager',
                department: 'Finance & Admin',
                status: 'Active'
            }
        ];

        for (const u of testUsers) {
            await connection.query(`
        INSERT INTO users (full_name, email, password_hash, role, department, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE role = VALUES(role)
      `, [u.full_name, u.email, passwordHash, u.role, u.department, u.status]);
        }

        console.log('Multi-role test data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
}

seedMultiRoles();
