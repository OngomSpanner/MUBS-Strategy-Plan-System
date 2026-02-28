import pool from './lib/db';

async function checkSchema() {
    try {
        const [rows] = await pool.query('DESCRIBE strategic_activities');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
