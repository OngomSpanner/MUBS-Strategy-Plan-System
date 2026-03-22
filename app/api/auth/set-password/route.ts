import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/auth';
import { parseRoles, pickDefaultActiveRole, dashboardPathForRole } from '@/lib/role-routing';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: number };
    if (!decoded?.userId) {
      return NextResponse.json({ message: 'Invalid or expired session' }, { status: 401 });
    }

    const { newPassword } = await request.json();
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query({
      query: 'UPDATE users SET password_hash = ?, must_change_password = 0 WHERE id = ?',
      values: [hashedPassword, decoded.userId]
    });

    const users = await query({
      query: 'SELECT role FROM users WHERE id = ?',
      values: [decoded.userId]
    });
    const user = (users as any[])[0];
    const rolesArray = parseRoles(user?.role);
    const activeRole = pickDefaultActiveRole(rolesArray);
    const redirectTo = dashboardPathForRole(activeRole);

    const res = NextResponse.json({ message: 'Password updated successfully', redirectTo });
    res.cookies.set('must_change_password', '', { path: '/', maxAge: 0 });
    return res;
  } catch (error) {
    console.error('Set password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
