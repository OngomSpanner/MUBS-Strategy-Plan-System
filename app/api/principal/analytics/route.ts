import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Unit Comparison (All units)
        const unitPerformance = await query({
            query: `
                SELECT 
                    u.name as \`label\`, 
                    ROUND(IFNULL(AVG(sa.progress), 0)) as \`value\`
                FROM units u
                LEFT JOIN strategic_activities sa ON u.id = sa.unit_id AND sa.parent_id IS NULL
                GROUP BY u.id, u.name
                ORDER BY \`value\` DESC
            `
        }) as any[];

        const validUnits = unitPerformance.filter(u => u.value !== null && !isNaN(u.value));
        const institutionAverage = validUnits.length > 0
            ? Math.round(validUnits.reduce((acc, curr) => acc + Number(curr.value), 0) / validUnits.length)
            : 0;

        // 2. Activity Status Split (Institutional)
        const statusSplit = await query({
            query: `
                SELECT 
                    status,
            COUNT(*) as count
                FROM strategic_activities
                WHERE parent_id IS NULL
                GROUP BY status
            `
        }) as any[];

        // 3. Compliance Distribution
        const compliantCount = unitPerformance.filter(u => u.value >= 75).length;
        const watchCount = unitPerformance.filter(u => u.value >= 50 && u.value < 75).length;
        const criticalCount = unitPerformance.filter(u => u.value < 50).length;

        // 4. Staff Performance Summary (Top 6)
        const staffPerformance = await query({
            query: `
                SELECT 
                    u.full_name as name,
            u.department as unit,
            COUNT(sa.id) as totalActivities,
            SUM(CASE WHEN sa.status = 'Completed' THEN 1 ELSE 0 END) as completed,
            ROUND(IFNULL(AVG(sa.progress), 0)) as rate
                FROM users u
                LEFT JOIN strategic_activities sa ON u.id = sa.assigned_to
                WHERE u.role != 'Admin' AND u.role != 'Principal'
                GROUP BY u.id, u.full_name, u.department
                ORDER BY rate DESC
                LIMIT 6
            `
        }) as any[];

        return NextResponse.json({
            unitPerformance,
            institutionAverage,
            statusSplit,
            complianceDistribution: {
                compliant: compliantCount,
                watch: watchCount,
                critical: criticalCount
            },
            staffPerformance
        });
    } catch (error: any) {
        console.error('Performance Analytics API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching performance analytics data', detail: error.message },
            { status: 500 }
        );
    }
}
