import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        const body = await request.json();
        const { status, reviewer_notes } = body;

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        // Validate that it's an allowed status
        if (!['Approved', 'Rejected', 'Edit Requested'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status type for review' }, { status: 400 });
        }

        const updateResult = await query({
            query: `
                UPDATE strategic_activities 
                SET status = ?, reviewer_notes = ? 
                WHERE id = ? AND parent_id IS NULL
            `,
            values: [status, reviewer_notes || null, id]
        }) as any;

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: 'Proposal not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ message: `Proposal ${status.toLowerCase()} successfully` });

    } catch (error: any) {
        console.error('Admin Update Proposal API Error:', error);
        return NextResponse.json(
            { message: 'Error updating proposal status', detail: error.message },
            { status: 500 }
        );
    }
}
