import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // Fetch all active units
        const units = await query({
            query: 'SELECT id, name FROM units ORDER BY name ASC',
            values: []
        }) as any[];

        return NextResponse.json(units);

    } catch (error: any) {
        console.error('Units API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching units', detail: error.message },
            { status: 500 }
        );
    }
}
