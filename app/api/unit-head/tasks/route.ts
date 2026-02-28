import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const unitId = 1; // Faculty of Computing (HOD viewpoint)

        const tasks = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title,
                    sa.status,
                    sa.priority,
                    sa.progress,
                    sa.end_date as dueDate,
                    u.full_name as assignee_name,
                    p.title as activity_title
                FROM strategic_activities sa
                LEFT JOIN users u ON sa.assigned_to = u.id
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                WHERE (sa.unit_id = ? OR p.unit_id = ?)
                AND sa.parent_id IS NOT NULL
                ORDER BY sa.end_date ASC
            `,
            values: [unitId, unitId]
        }) as any[];

        const kanban = {
            todo: tasks.filter(t => ['Not Started', 'Pending'].includes(t.status)),
            inProgress: tasks.filter(t => ['In Progress', 'On Track', 'Delayed'].includes(t.status)),
            underReview: tasks.filter(t => t.status === 'Under Review'),
            completed: tasks.filter(t => t.status === 'Completed')
        };

        const activities = [...new Set(tasks.map(t => t.activity_title))].filter(Boolean);
        const assignees = [...new Set(tasks.map(t => t.assignee_name))].filter(Boolean);

        return NextResponse.json({
            kanban,
            filters: {
                activities,
                assignees
            }
        });
    } catch (error: any) {
        console.error('Unit Tasks API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching unit tasks', detail: error.message },
            { status: 500 }
        );
    }
}
