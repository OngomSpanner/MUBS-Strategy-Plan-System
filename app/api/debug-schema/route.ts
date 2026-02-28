import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const saSchema = await query({ query: 'DESCRIBE strategic_activities' });
        const usersSchema = await query({ query: 'DESCRIBE users' });
        return NextResponse.json({ saSchema, usersSchema });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
