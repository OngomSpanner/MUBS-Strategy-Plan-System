import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const format = searchParams.get('format');
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const unit = searchParams.get('unit'); // unit name for filtering

    let data;

    switch (type) {
      case 'activity-summary':
        {
          let whereClause = 'WHERE 1=1';
          const vals: any[] = [];
          if (from) { whereClause += ' AND sa.created_at >= ?'; vals.push(from); }
          if (to) { whereClause += ' AND sa.created_at <= ?'; vals.push(to); }
          if (unit && unit !== 'All Units') { whereClause += ' AND u.name = ?'; vals.push(unit); }

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
              ${whereClause}
              GROUP BY u.id, u.name
              ORDER BY avg_progress DESC
            `,
            values: vals
          });
        }
        break;

      case 'staff-evaluation':
        {
          let whereClause = "WHERE u.role NOT LIKE '%Super Admin%'";
          const vals: any[] = [];
          if (unit && unit !== 'All Units') { whereClause += ' AND u.department = ?'; vals.push(unit); }
          // Note: for staff evaluation, we usually look at current status, but we can filter by user join date if needed

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
              ${whereClause}
              GROUP BY u.id, u.full_name, u.department
              ORDER BY rate DESC
              LIMIT 50
            `,
            values: vals
          });
        }
        break;

      case 'trend-analysis':
        {
          // Aggregate progress by week for the last 12 weeks
          data = await query({
            query: `
              SELECT 
                DATE_FORMAT(updated_at, '%v') as week,
                DATE_FORMAT(MIN(updated_at), '%d %b') as label,
                ROUND(AVG(progress)) as avg_progress
              FROM activity_tracking
              WHERE updated_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
              GROUP BY DATE_FORMAT(updated_at, '%v')
              ORDER BY MIN(updated_at) ASC
            `
          });
        }
        break;

      case 'delayed-activities':
        {
          let whereClause = "WHERE sa.status = 'Delayed'";
          const vals: any[] = [];
          if (unit && unit !== 'All Units') { whereClause += ' AND u.name = ?'; vals.push(unit); }

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
              ${whereClause}
              ORDER BY days_overdue DESC
            `,
            values: vals
          });
        }
        break;

      default:
        return NextResponse.json({ message: 'Invalid report type' }, { status: 400 });
    }

    return NextResponse.json({ type, format, from, to, unit, data, generated_at: new Date().toISOString() });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ message: 'Error generating report' }, { status: 500 });
  }
}