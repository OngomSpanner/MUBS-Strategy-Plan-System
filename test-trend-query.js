const mysql = require('mysql2/promise');

async function testTrendQuery() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mubs_super_admin',
    });

    try {
        console.log('Testing trend-analysis query...');
        const [rows] = await connection.query(`
      SELECT 
        DATE_FORMAT(updated_at, '%v') as week,
        DATE_FORMAT(MIN(updated_at), '%d %b') as label,
        ROUND(AVG(progress)) as avg_progress
      FROM activity_tracking
      WHERE updated_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
      GROUP BY DATE_FORMAT(updated_at, '%v')
      ORDER BY MIN(updated_at) ASC
    `);
        console.log('Results:', rows);
        process.exit(0);
    } catch (err) {
        console.error('QUERY FAILED:', err.message);
        process.exit(1);
    }
}

testTrendQuery();
