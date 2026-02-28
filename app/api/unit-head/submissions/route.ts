import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const unitId = 1;

        // Fetch submissions (activities/tasks with 'Under Review' status or from tracking)
        const submissions = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title as report_name,
                    p.title as activity_title,
                    u.full_name as staff_name,
                    sa.updated_at as submitted_at,
                    sa.status,
                    sa.progress
                FROM strategic_activities sa
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                LEFT JOIN users u ON sa.assigned_to = u.id
                WHERE (sa.unit_id = ? OR p.unit_id = ?)
                AND sa.status IN ('Under Review', 'Pending', 'Completed', 'Returned')
                ORDER BY sa.updated_at DESC
            `,
            values: [unitId, unitId]
        }) as any[];

        // Stats
        const stats = {
            pending: submissions.filter(s => s.status === 'Pending').length,
            underReview: submissions.filter(s => s.status === 'Under Review').length,
            reviewed: submissions.filter(s => s.status === 'Completed').length,
            returned: submissions.filter(s => s.status === 'Returned').length
        };

        // Recent activity
        const recentActivity = submissions.slice(0, 5).map(s => ({
            id: s.id,
            type: s.status,
            message: `${s.report_name} ${s.status === 'Pending' ? 'submitted' : s.status.toLowerCase()} by ${s.staff_name}`,
            date: s.submitted_at
        }));

        return NextResponse.json({
            submissions,
            stats,
            recentActivity
        });
    } catch (error: any) {
        console.error('Unit Submissions API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching unit submissions', detail: error.message },
            { status: 500 }
        );
    }
}
