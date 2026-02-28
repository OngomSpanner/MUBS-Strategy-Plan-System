import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Summary Stats
        const summaryStats = await query({
            query: `
                SELECT 
                    COUNT(*) as \`totalActivities\`,
                    SUM(CASE WHEN status IN ('On Track', 'Completed') THEN 1 ELSE 0 END) as \`onTrack\`,
                    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as \`inProgress\`,
                    SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) as \`delayed\`
                FROM strategic_activities
                WHERE parent_id IS NULL
            `
        }) as any[];

        // 2. Unit Drill-down
        const units = await query({
            query: `
                SELECT 
                    u.id,
                    u.name,
                    (SELECT full_name FROM users WHERE department = u.name AND role = 'Unit Head' LIMIT 1) as head,
                    COUNT(sa.id) as activitiesCount,
                    ROUND(IFNULL(AVG(sa.progress), 0)) as overallProgress,
                    SUM(CASE WHEN sa.status = 'Completed' THEN 1 ELSE 0 END) as completedCount,
                    SUM(CASE WHEN sa.status = 'In Progress' THEN 1 ELSE 0 END) as inProgressCount,
                    SUM(CASE WHEN sa.status = 'Delayed' THEN 1 ELSE 0 END) as delayedCount
                FROM units u
                LEFT JOIN strategic_activities sa ON u.id = sa.unit_id AND sa.parent_id IS NULL
                GROUP BY u.id, u.name
                ORDER BY overallProgress DESC
            `
        }) as any[];

        // 3. Recent Activities for each unit (Top 2 for each)
        const recentActivities = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title,
                    sa.unit_id,
                    sa.progress,
                    sa.status,
                    sa.pillar
                FROM strategic_activities sa
                WHERE sa.parent_id IS NULL
                AND (
                    SELECT COUNT(*) 
                    FROM strategic_activities sa2 
                    WHERE sa2.unit_id = sa.unit_id 
                    AND sa2.parent_id IS NULL 
                    AND sa2.created_at >= sa.created_at
                ) <= 2
                ORDER BY sa.unit_id, sa.created_at DESC
            `
        }) as any[];

        // 4. Problem areas/risks
        const risks = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title,
                    sa.unit_id,
                    sa.description,
                    sa.end_date,
                    DATEDIFF(sa.end_date, CURDATE()) as daysLeft
                FROM strategic_activities sa
                WHERE sa.status = 'Delayed' AND sa.parent_id IS NULL
            `
        }) as any[];

        return NextResponse.json({
            stats: summaryStats[0],
            units: units.map(u => ({
                ...u,
                recentActivities: recentActivities.filter(a => a.unit_id === u.id),
                risks: risks.filter(r => r.unit_id === u.id)
            }))
        });
    } catch (error: any) {
        console.error('Strategic Summary API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching strategic summary data', detail: error.message },
            { status: 500 }
        );
    }
}
