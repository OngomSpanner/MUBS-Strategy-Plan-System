import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Unauthorized');

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        // Fetch reports that have been evaluated by HOD
        const feedbackRecordsRaw = await query({
            query: `
                SELECT 
                    sr.id,
                    aa.id as task_id,
                    sa.title AS report_name,
                    p.title AS activity_title,
                    u.full_name AS evaluator_name,
                    COALESCE(e.evaluation_date, sr.updated_at) AS evaluated_at,
                    sr.status AS db_status,
                    e.qualitative_feedback AS reviewer_notes
                FROM staff_reports sr
                JOIN activity_assignments aa ON sr.activity_assignment_id = aa.id
                JOIN strategic_activities sa ON aa.activity_id = sa.id
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                INNER JOIN evaluations e ON e.staff_report_id = sr.id
                LEFT JOIN users u ON e.evaluated_by = u.id
                WHERE aa.assigned_to_user_id = ?
                ORDER BY COALESCE(e.evaluation_date, sr.updated_at) DESC
            `,
            values: [decoded.userId]
        }) as any[];

        const feedbackRecords = feedbackRecordsRaw.map(r => {
            const status = (r.db_status === 'evaluated' || r.db_status === 'acknowledged') ? 'Completed' : r.db_status === 'incomplete' ? 'Incomplete' : r.db_status === 'not_done' ? 'Not Done' : 'Returned';
            return {
                ...r,
                status,
                evaluator_name: r.evaluator_name || 'Department Head'
            };
        });

        const stats = {
            totalEvaluations: feedbackRecords.length,
            completionRate: feedbackRecords.length > 0
                ? Math.round((feedbackRecords.filter((r: any) => r.status === 'Completed').length / feedbackRecords.length) * 100)
                : 0,
            returnedCount: feedbackRecords.filter((r: any) => r.status === 'Returned').length,
            incompleteCount: feedbackRecords.filter((r: any) => r.status === 'Incomplete').length
        };

        return NextResponse.json({
            feedback: feedbackRecords,
            stats
        });

    } catch (error: any) {
        console.error('Staff Feedback API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching staff feedback', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
