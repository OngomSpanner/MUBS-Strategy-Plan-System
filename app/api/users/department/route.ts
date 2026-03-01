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

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // 1. First get the logged-in user's department
        const me = await query({
            query: 'SELECT department FROM users WHERE id = ?',
            values: [decoded.userId]
        }) as any[];

        if (me.length === 0 || !me[0].department) {
            return NextResponse.json([]);
        }

        const myDept = me[0].department;

        // 2. Query for all users assigned to that department
        const deptUsers = await query({
            query: 'SELECT id, full_name, role FROM users WHERE department = ? ORDER BY full_name ASC',
            values: [myDept]
        }) as any[];

        return NextResponse.json(deptUsers);

    } catch (error: any) {
        console.error('Dept Users API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching department users', detail: error.message },
            { status: 500 }
        );
    }
}
