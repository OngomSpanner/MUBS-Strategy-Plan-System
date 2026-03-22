import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url);
        const unitsOnly = searchParams.get('units_only') === 'true' || searchParams.get('units_only') === '1';
        let departments: any[];
        try {
            departments = await query({
                query: unitsOnly
                    ? "SELECT id, name, parent_id, unit_type FROM departments WHERE is_active = 1 AND unit_type IN ('department', 'unit') ORDER BY name ASC"
                    : 'SELECT id, name, parent_id, unit_type FROM departments WHERE is_active = 1 ORDER BY parent_id IS NULL DESC, name ASC',
                values: []
            }) as any[];
        } catch (e: any) {
            if (e?.code === 'ER_BAD_FIELD_ERROR' || e?.message?.includes('is_active') || e?.message?.includes('unit_type')) {
                departments = await query({
                    query: 'SELECT id, name, parent_id FROM departments ORDER BY name ASC',
                    values: []
                }) as any[];
                departments = (departments || []).map((d: any) => ({ ...d, unit_type: null }));
            } else {
                throw e;
            }
        }

        return NextResponse.json(departments);

    } catch (error: any) {
        console.error('Departments API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching departments', detail: error.message },
            { status: 500 }
        );
    }
}
