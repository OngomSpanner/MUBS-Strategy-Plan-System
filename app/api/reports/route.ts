import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format');
    const period = searchParams.get('period');

    let data;

    switch (type) {
      case 'activity-summary':
        data = await query({
          query: `
            SELECT
              u.name                                                              AS unit,
              COUNT(sa.id)                                                        AS total_activities,
              SUM(CASE WHEN sa.status = 'Completed'  THEN 1 ELSE 0 END)         AS completed,
              SUM(CASE WHEN sa.status = 'In Progress' THEN 1 ELSE 0 END)        AS in_progress,
              SUM(CASE WHEN sa.status = 'Delayed'     THEN 1 ELSE 0 END)        AS delayed_cnt,
              ROUND(IFNULL(AVG(sa.progress), 0))                                 AS avg_progress
            FROM units u
            LEFT JOIN strategic_activities sa ON u.id = sa.unit_id
            GROUP BY u.id, u.name
            ORDER BY avg_progress DESC
          `
        });
        break;

      case 'unit-performance':
        data = await query({
          query: `
            SELECT
              u.name                                                              AS unit,
              COUNT(sa.id)                                                        AS activities,
              ROUND(IFNULL(AVG(sa.progress), 0))                                 AS progress,
              SUM(CASE WHEN sa.status = 'Delayed' THEN 1 ELSE 0 END)            AS delayed_cnt
            FROM units u
            LEFT JOIN strategic_activities sa ON u.id = sa.unit_id
            GROUP BY u.id, u.name
          `
        });
        break;

      case 'staff-evaluation':
        // Join users to units via department name, then aggregate unit-level activity stats
        data = await query({
          query: `
            SELECT
              u.full_name                                                          AS name,
              u.department                                                         AS unit,
              COUNT(sa.id)                                                         AS assigned,
              SUM(CASE WHEN sa.status = 'Completed' THEN 1 ELSE 0 END)           AS completed,
              ROUND(
                SUM(CASE WHEN sa.status = 'Completed' THEN 1 ELSE 0 END) * 100.0
                / NULLIF(COUNT(sa.id), 0),
              0)                                                                   AS rate
            FROM users u
            LEFT JOIN units un ON un.name = u.department
            LEFT JOIN strategic_activities sa ON sa.unit_id = un.id
            WHERE u.role IN ('Manager', 'Unit Head', 'Staff')
            GROUP BY u.id, u.full_name, u.department
            ORDER BY rate DESC
            LIMIT 50
          `
        });
        break;

      case 'delayed-activities':
        data = await query({
          query: `
            SELECT
              sa.title,
              u.name                                    AS unit,
              DATE_FORMAT(sa.end_date, '%d %b %Y')     AS deadline,
              DATEDIFF(CURDATE(), sa.end_date)          AS days_overdue,
              sa.progress,
              sa.status
            FROM strategic_activities sa
            LEFT JOIN units u ON sa.unit_id = u.id
            WHERE sa.status = 'Delayed'
            ORDER BY days_overdue DESC
          `
        });
        break;

      default:
        return NextResponse.json({ message: 'Invalid report type' }, { status: 400 });
    }

    return NextResponse.json({ type, format, period, data, generated_at: new Date().toISOString() });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ message: 'Error generating report' }, { status: 500 });
  }
}