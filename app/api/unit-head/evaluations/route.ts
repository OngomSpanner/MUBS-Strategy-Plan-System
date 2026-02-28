import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const unitId = 1;

        // Fetch evaluations
        const evaluations = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title as report_name,
                    p.title as activity_title,
                    u.full_name as staff_name,
                    sa.updated_at as submitted_at,
                    sa.status,
                    sa.progress,
                    sa.description as report_summary
                FROM strategic_activities sa
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                LEFT JOIN users u ON sa.assigned_to = u.id
                WHERE (sa.unit_id = ? OR p.unit_id = ?)
                AND sa.status IN ('Under Review', 'Pending', 'Completed', 'Returned')
                ORDER BY sa.updated_at DESC
            `,
            values: [unitId, unitId]
        }) as any[];

        const pending = evaluations.filter(e => ['Pending', 'Under Review'].includes(e.status));
        const completed = evaluations.filter(e => ['Completed', 'Returned'].includes(e.status));

        return NextResponse.json({
            pending,
            completed
        });
    } catch (error: any) {
        console.error('Unit Evaluations API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching unit evaluations', detail: error.message },
            { status: 500 }
        );
    }
}
