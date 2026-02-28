const mysql = require('mysql2/promise');

async function seedCommittee() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Seeding committee proposals...');

        const proposals = [
            {
                committee_type: 'Council',
                title: 'Expansion of Research Facility',
                minute_reference: 'C/2024/05/12',
                pillar_id: 1,
                status: 'Approved',
                implementation_status: 'On Track'
            },
            {
                committee_type: 'TMC',
                title: 'New Staff Welfare Policy',
                minute_reference: 'TMC/2024/06/08',
                pillar_id: 2,
                status: 'Pending',
                implementation_status: 'Pending'
            },
            {
                committee_type: 'Academic Board',
                title: 'Review of Graduate Curriculum',
                minute_reference: 'AB/2024/05/20',
                pillar_id: 3,
                status: 'Approved',
                implementation_status: 'Delayed'
            }
        ];

        for (const p of proposals) {
            await connection.query(`
        INSERT INTO committee_proposals 
        (committee_type, title, minute_reference, pillar_id, status, implementation_status, budget, submitted_by, unit_id, submitted_date) 
        VALUES (?, ?, ?, ?, ?, ?, 50000000, 1, 1, CURDATE())
      `, [p.committee_type, p.title, p.minute_reference, p.pillar_id, p.status, p.implementation_status]);
        }

        console.log('Committee test data seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
}

seedCommittee();
