import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const activities = await query({
      query: `
        SELECT 
          sa.*,
          u.name as unit,
          p.title as parent_title,
          CONCAT(DATE_FORMAT(sa.start_date, '%b'), '-', DATE_FORMAT(sa.end_date, '%Y')) as timeline
        FROM strategic_activities sa
        LEFT JOIN units u ON sa.unit_id = u.id
        LEFT JOIN strategic_activities p ON sa.parent_id = p.id
        ORDER BY sa.created_at DESC
        LIMIT 100
      `
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { message: 'Error fetching activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, pillar, unit_id, target_kpi, status, priority, parent_id, start_date, end_date, description } = body;

    const result = await query({
      query: `
        INSERT INTO strategic_activities 
        (title, pillar, unit_id, target_kpi, status, priority, parent_id, progress, start_date, end_date, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
      `,
      values: [title, pillar, unit_id, target_kpi, status, priority || 'Medium', parent_id || null, start_date, end_date, description]
    });

    return NextResponse.json(
      { message: 'Activity created successfully', id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { message: 'Error creating activity' },
      { status: 500 }
    );
  }
}