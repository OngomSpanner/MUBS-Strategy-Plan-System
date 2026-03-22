import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

function committeeTypeToSource(committeeType: string): string {
  const map: Record<string, string> = {
    Council: 'council_minutes',
    TMC: 'tmc_minutes',
    'Academic Board': 'academic_board',
    Other: 'other_duty'
  };
  return map[committeeType] || 'other_duty';
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    try {
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
        const status = body.status && String(body.status).trim();
        const reviewer_notes = body.reviewer_notes;

        if (!status) {
            return NextResponse.json({ message: 'Status is required' }, { status: 400 });
        }

        // Strategy Manager can only recommend (Strategy Reviewed), reject, or request edits — not approve.
        if (!['Strategy Reviewed', 'Rejected', 'Edit Requested'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status for Strategy Manager review. Use Strategy Reviewed, Rejected, or Edit Requested.' }, { status: 400 });
        }

        const isRecommendToPrincipal = status === 'Strategy Reviewed';

        if (isRecommendToPrincipal) {
            // Move to Principal queue; do not create strategic_activity (Principal approves).
            const updateResult = await query({
                query: `UPDATE committee_proposals SET status = ?, reviewer_notes = ?, reviewed_date = CURDATE() WHERE id = ?`,
                values: [status, reviewer_notes || null, id]
            }) as any;
            if (updateResult.affectedRows === 0) {
                return NextResponse.json({ message: 'Proposal not found' }, { status: 404 });
            }
            return NextResponse.json({ message: 'Proposal recommended to Principal for decision.' });
        }

        // Rejected or Edit Requested: just update committee_proposals
        const updateResult = await query({
            query: `UPDATE committee_proposals SET status = ?, reviewer_notes = ?, reviewed_date = CURDATE() WHERE id = ?`,
            values: [status, reviewer_notes || null, id]
        }) as any;
        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: 'Proposal not found' }, { status: 404 });
        }

        return NextResponse.json({ message: `Proposal ${status === 'Rejected' ? 'rejected' : 'edit requested'} successfully` });

    } catch (error: any) {
        console.error('Admin Update Proposal API Error:', error);
        return NextResponse.json(
            { message: 'Error updating proposal status', detail: error.message },
            { status: 500 }
        );
    }
}
