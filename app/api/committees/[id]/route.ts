import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const { status, reviewer_notes } = await request.json();

        await query({
            query: 'UPDATE committee_proposals SET status = ?, reviewer_notes = ?, reviewed_date = CURDATE() WHERE id = ?',
            values: [status, reviewer_notes ?? null, id]
        });

        return NextResponse.json({ message: 'Proposal updated successfully' });
    } catch (error) {
        console.error('Error updating proposal:', error);
        return NextResponse.json(
            { message: 'Error updating proposal' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        await query({
            query: 'DELETE FROM committee_proposals WHERE id = ?',
            values: [id]
        });

        return NextResponse.json({ message: 'Proposal deleted successfully' });
    } catch (error) {
        console.error('Error deleting proposal:', error);
        return NextResponse.json(
            { message: 'Error deleting proposal' },
            { status: 500 }
        );
    }
}
