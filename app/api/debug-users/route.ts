import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const users = await query({ query: 'SELECT id, full_name, role, department FROM users' });
        return NextResponse.json({ users });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
