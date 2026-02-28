import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const tables = await query({ query: 'SHOW TABLES' });
        return NextResponse.json({ tables });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
