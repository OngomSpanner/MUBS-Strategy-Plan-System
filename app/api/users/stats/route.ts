import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const rows = await query({
            query: `
        SELECT
          COUNT(*)                                                      AS total,
          SUM(CASE WHEN status = 'Active'    THEN 1 ELSE 0 END)       AS active,
          SUM(CASE WHEN status = 'Suspended' THEN 1 ELSE 0 END)       AS suspended,
          COUNT(DISTINCT role)                                          AS definedRoles
        FROM users
      `
        }) as any[];

        const r = rows[0];
        return NextResponse.json({
            total: Number(r.total ?? 0),
            active: Number(r.active ?? 0),
            suspended: Number(r.suspended ?? 0),
            definedRoles: Number(r.definedRoles ?? 0)
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json({ message: 'Error fetching user stats' }, { status: 500 });
    }
}
