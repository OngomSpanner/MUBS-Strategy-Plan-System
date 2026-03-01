import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        const activeRoleCookie = cookieStore.get('active_role')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }

        // Find user
        const users = await query({
            query: 'SELECT id, full_name, email, role, status FROM users WHERE id = ?',
            values: [decoded.userId]
        });

        const user = (users as any[])[0];

        if (!user || user.status !== 'Active') {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const rolesArray = user.role.split(',').map((r: string) => r.trim());

        // Determine active role - prioritize cookie, fallback to token's role, fallback to first in list
        let activeRole = activeRoleCookie || decoded.role || rolesArray[0];

        // Safety check: ensure the active role is actually in the user's role list
        if (!rolesArray.includes(activeRole)) {
            activeRole = rolesArray[0];
        }

        return NextResponse.json({
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
            roles: rolesArray,
            activeRole: activeRole
        });

    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
