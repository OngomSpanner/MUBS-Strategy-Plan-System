import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userRows = await query({
      query: 'SELECT id, full_name, email, role, department_id, status FROM users WHERE id = ?',
      values: [id]
    });

    if (!(userRows as any[]).length) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const user = (userRows as any[])[0];
    let committees: string[] = [];
    try {
      const rows = (await query({
        query: 'SELECT committee_type FROM user_committee_assignments WHERE user_id = ? ORDER BY committee_type',
        values: [id]
      })) as any[];
      committees = (rows || []).map((r: any) => r.committee_type).filter(Boolean);
    } catch {
      // table may not exist
    }

    return NextResponse.json({ ...user, committees });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { message: 'Error fetching user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const body = await request.json();
    const { full_name, email, role, department_id, status, committee_types } = body;

    if (!full_name?.trim() || !email?.trim() || !role) {
      return NextResponse.json(
        { message: 'Full name, email and role are required' },
        { status: 400 }
      );
    }

    const roleStr = typeof role === 'string' ? role : (Array.isArray(role) ? role.join(',') : '');
    const departmentId = department_id !== undefined && department_id !== '' ? Number(department_id) : null;

    if (status !== undefined && status !== null && status !== '') {
      await query({
        query: 'UPDATE users SET full_name = ?, email = ?, role = ?, department_id = ?, status = ? WHERE id = ?',
        values: [full_name.trim(), email.trim(), roleStr, departmentId, status, id]
      });
    } else {
      await query({
        query: 'UPDATE users SET full_name = ?, email = ?, role = ?, department_id = ? WHERE id = ?',
        values: [full_name.trim(), email.trim(), roleStr, departmentId, id]
      });
    }

    // Sync committee assignments when provided
    if (Array.isArray(committee_types)) {
      try {
        await query({
          query: 'DELETE FROM user_committee_assignments WHERE user_id = ?',
          values: [id]
        });
        const { isCommitteeType } = await import('@/lib/committee-types');
        const valid = committee_types
          .map((c: unknown) => (typeof c === 'string' ? c.trim() : ''))
          .filter((c: string) => c && isCommitteeType(c));
        for (const ct of valid) {
          await query({
            query: 'INSERT INTO user_committee_assignments (user_id, committee_type) VALUES (?, ?)',
            values: [id, ct]
          });
        }
      } catch (e: any) {
        if (e?.code !== 'ER_NO_SUCH_TABLE') console.error('user_committee_assignments update:', e);
      }
    }

    return NextResponse.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { status } = await request.json();

    await query({
      query: 'UPDATE users SET status = ? WHERE id = ?',
      values: [status, id]
    });

    return NextResponse.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { message: 'Error updating user status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await query({
      query: 'DELETE FROM users WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    );
  }
}