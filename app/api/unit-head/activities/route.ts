import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const unitId = 1;

        // Fetch all activities for the unit
        const activities = await query({
            query: `
                SELECT 
                    sa.*,
                    u.name as unit_name,
                    (SELECT COUNT(*) FROM strategic_activities WHERE parent_id = sa.id) as total_tasks,
                    (SELECT COUNT(*) FROM strategic_activities WHERE parent_id = sa.id AND status = 'Completed') as completed_tasks
                FROM strategic_activities sa
                LEFT JOIN units u ON sa.unit_id = u.id
                WHERE sa.unit_id = ? AND sa.parent_id IS NULL
                ORDER BY sa.end_date ASC
            `,
            values: [unitId]
        }) as any[];

        // Calculate stats
        const stats = {
            total: activities.length,
            onTrack: activities.filter(a => a.status === 'On Track').length,
            inProgress: activities.filter(a => a.status === 'In Progress').length,
            delayed: activities.filter(a => a.status === 'Delayed').length
        };

        return NextResponse.json({
            activities,
            stats
        });
    } catch (error: any) {
        console.error('Unit Activities API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching unit activities', detail: error.message },
            { status: 500 }
        );
    }
}
