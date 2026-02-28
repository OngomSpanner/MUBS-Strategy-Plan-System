import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        await query({
            query: 'ALTER TABLE strategic_activities ADD COLUMN assigned_to INT NULL, ADD FOREIGN KEY (assigned_to) REFERENCES users(id)'
        });
        return NextResponse.json({ message: 'Column assigned_to added successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
