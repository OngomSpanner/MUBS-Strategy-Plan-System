import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Unauthorized');

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        // Fetch submissions assigned to user which have been submitted (Under Review, Completed, Returned)
        const submissionsRecords = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title as report_name,
                    p.title as activity_title,
                    sa.updated_at as submitted_at,
                    sa.status,
                    sa.score,
                    sa.progress,
                    sa.description,
                    sa.reviewer_notes
                FROM strategic_activities sa
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                WHERE sa.assigned_to = ?
                AND sa.status IN ('Under Review', 'Completed', 'Returned')
                ORDER BY sa.updated_at DESC
            `,
            values: [decoded.userId]
        }) as any[];

        // Calculate stats correctly
        const stats = {
            totalSubmitted: submissionsRecords.length,
            underReview: submissionsRecords.filter(r => r.status === 'Under Review').length,
            reviewed: submissionsRecords.filter(r => r.status === 'Completed').length,
            returned: submissionsRecords.filter(r => r.status === 'Returned').length
        };

        return NextResponse.json({
            submissions: submissionsRecords,
            stats
        });

    } catch (error: any) {
        console.error('Staff Submissions API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching staff submissions', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
