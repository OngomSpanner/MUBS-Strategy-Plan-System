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

        const userRec = await query({
            query: 'SELECT department FROM users WHERE id = ?',
            values: [decoded.userId]
        }) as any[];

        if (!userRec.length || !userRec[0].department) {
            return NextResponse.json({ pending: [], completed: [] });
        }

        const unitMapped = await query({
            query: 'SELECT id FROM units WHERE name = ?',
            values: [userRec[0].department]
        }) as any[];

        const unitId = unitMapped.length > 0 ? unitMapped[0].id : 0;

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
                    sa.description as report_summary,
                    sa.score,
                    sa.reviewer_notes
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
