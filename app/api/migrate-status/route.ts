import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        await query({
            query: "ALTER TABLE strategic_activities MODIFY COLUMN status ENUM('Not Started', 'In Progress', 'On Track', 'Delayed', 'Completed', 'Under Review', 'Returned') DEFAULT 'Not Started'"
        });
        return NextResponse.json({ message: 'Status enum updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
