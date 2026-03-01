import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { generateToken, verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
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

        const { newRole } = await request.json();

        if (!newRole) {
            return NextResponse.json({ message: 'New role is required' }, { status: 400 });
        }

        // Fetch user from DB to ensure they actually possess this role
        const users = await query({
            query: 'SELECT id, role, status FROM users WHERE id = ?',
            values: [decoded.userId]
        });

        const user = (users as any[])[0];

        if (!user || user.status !== 'Active') {
            return NextResponse.json({ message: 'Invalid user or account not active' }, { status: 403 });
        }

        const rolesArray = user.role.split(',').map((r: string) => r.trim());

        if (!rolesArray.includes(newRole)) {
            return NextResponse.json({ message: 'User does not have permission for this role' }, { status: 403 });
        }

        // Generate new token with the new active role
        const newToken = generateToken(user.id, newRole);

        cookieStore.set({
            name: 'token',
            value: newToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        cookieStore.set({
            name: 'active_role',
            value: newRole,
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({
            message: 'Role switched successfully',
            activeRole: newRole,
        });

    } catch (error) {
        console.error('Role switch error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
