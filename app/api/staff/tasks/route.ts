import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Unauthorized');

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        // Fetch assigned tasks from activity_assignments joined with strategic_activities
        const tasksQuery = await query({
            query: `
                SELECT 
                    aa.id,
                    sa.id as activity_id,
                    sa.title,
                    sa.description,
                    COALESCE(sa.start_date, p.start_date) as startDate,
                    COALESCE(sa.end_date, p.end_date) as dueDate,
                    aa.status as db_status,
                    (SELECT sr2.status FROM staff_reports sr2 WHERE sr2.activity_assignment_id = aa.id ORDER BY sr2.updated_at DESC LIMIT 1) as latest_report_status,
                    sa.progress,
                    sa.parent_id,
                    sa.task_type,
                    sa.kpi_target_value,
                    sa.frequency,
                    p.status as parent_status,
                    d.name as unit_name
                FROM activity_assignments aa
                JOIN strategic_activities sa ON aa.activity_id = sa.id
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                LEFT JOIN departments d ON sa.department_id = d.id
                WHERE aa.assigned_to_user_id = ?
                ORDER BY aa.end_date ASC
            `,
            values: [decoded.userId]
        }) as any[];

        const statusMap: Record<string, string> = {
            'pending': 'Pending',
            'accepted': 'Pending',
            'in_progress': 'In Progress',
            'submitted': 'Under Review',
            'evaluated': 'Completed',
            'completed': 'Completed',
            'overdue': 'Delayed',
            'returned': 'Returned',
            'incomplete': 'Incomplete',
            'not_done': 'Not Done'
        };

        const statusFromReportStatus = (status: string | null): string | null => {
            if (!status) return null;
            const s = (status + '').toLowerCase();
            if (s === 'evaluated' || s === 'completed') return 'Completed';
            if (s === 'incomplete') return 'Incomplete';
            if (s === 'not_done') return 'Not Done';
            if (s === 'returned') return 'Returned';
            return null;
        };

        const frequencyMap: Record<string, string> = {
            'once': 'Once',
            'daily': 'Daily Task',
            'weekly': 'Weekly Task',
            'monthly': 'Monthly Task'
        };

        // Two-tier flat: tasks with parent_id are Weekly Tasks under a Strategic Activity.
        const enhancedTasks = tasksQuery.map((task: any) => {
            const derivedStatus = statusFromReportStatus(task.latest_report_status);
            const status = derivedStatus ?? statusMap[task.db_status] ?? 'Not Started';

            return {
                ...task,
                status,
                type: frequencyMap[task.frequency] || (task.parent_id ? 'Weekly Task' : 'Once'),
                tier: task.parent_id ? 'weekly_task' : null,
                daysLeft: Math.ceil((new Date(task.dueDate || new Date()).getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
                unit_name: task.unit_name || 'N/A'
            };
        });

        // Aggregated stats
        const stats = {
            assigned: enhancedTasks.length,
            overdue: enhancedTasks.filter((t: any) => t.daysLeft < 0 && t.status !== 'Completed').length,
            inProgress: enhancedTasks.filter((t: any) => t.status === 'In Progress').length,
            completed: enhancedTasks.filter((t: any) => t.status === 'Completed').length
        };

        return NextResponse.json({ tasks: enhancedTasks, stats });
    } catch (error: any) {
        console.error('Staff Tasks API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching staff tasks', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
