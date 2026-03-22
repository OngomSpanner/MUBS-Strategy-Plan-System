import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { getVisibleDepartmentIds, inPlaceholders } from '@/lib/department-head';

async function getAuthFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) throw new Error('Unauthorized');
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.userId) throw new Error('Invalid token');
    const departmentIds = await getVisibleDepartmentIds(decoded.userId);
    if (departmentIds.length === 0) throw new Error('User has no department assigned.');
    return { departmentIds };
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { departmentIds } = await getAuthFromToken();
        const { id } = await params;
        const taskId = parseInt(id, 10);
        if (Number.isNaN(taskId)) {
            return NextResponse.json({ message: 'Invalid task id' }, { status: 400 });
        }

        const placeholders = inPlaceholders(departmentIds.length);
        // Allow deleting any task (detailed activity) in the HOD's list; only block top-level strategic goals (parent_id IS NULL)
        const taskCheck = await query({
            query: `
                SELECT sa.id
                FROM strategic_activities sa
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                WHERE sa.id = ?
                AND (sa.parent_id IS NOT NULL OR sa.activity_type = 'detailed')
                AND (sa.department_id IN (${placeholders}) OR p.department_id IN (${placeholders}))
            `,
            values: [taskId, ...departmentIds, ...departmentIds]
        }) as any[];

        if (taskCheck.length === 0) {
            return NextResponse.json({ message: 'Task not found or unauthorized' }, { status: 403 });
        }

        await query({
            query: 'DELETE FROM activity_assignments WHERE activity_id = ?',
            values: [taskId]
        });
        await query({
            query: 'DELETE FROM strategic_activities WHERE id = ?',
            values: [taskId]
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        console.error('Department task DELETE error:', error);
        return NextResponse.json(
            { message: error.message || 'Failed to delete task', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
