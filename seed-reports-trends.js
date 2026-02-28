const mysql = require('mysql2/promise');

async function seedTrends() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Clearing old tracking data for consistent trends...');
        await connection.query("DELETE FROM activity_tracking");

        console.log('Seeding 12 weeks of historical progress data...');

        // We'll simulate 5 activities across 12 weeks with increasing progress
        const activityIds = [1, 2, 3, 4, 5];

        for (let week = 0; week < 12; week++) {
            const date = new Date();
            date.setDate(date.getDate() - (11 - week) * 7); // 11 weeks ago to today
            const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');

            const avgProgressForWeek = 10 + (week * 7.5); // Starts at 10%, goes to ~90%

            for (const id of activityIds) {
                // Add some randomization (+/- 5%)
                const progress = Math.min(100, Math.max(0, avgProgressForWeek + (Math.random() * 10 - 5)));
                await connection.query(
                    "INSERT INTO activity_tracking (activity_id, activity_type, progress, updated_at, notes, updated_by) VALUES (?, 'strategic', ?, ?, 'System generated trend data', 1)",
                    [id, progress, formattedDate]
                );
            }
        }

        console.log('Seeding SUCCESS');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

seedTrends();
