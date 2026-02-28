import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const units = await query({ query: 'SELECT * FROM units' });
        return NextResponse.json({ units });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
