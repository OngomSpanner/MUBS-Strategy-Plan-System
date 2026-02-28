import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // In a real scenario, we'd get the staff ID from the session/token.
        // For now, we'll return aggregate stats or stats for a "demo" staff.

        // 1. Task stats
        const taskStats = await query({
            query: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN progress > 0 AND status != 'Completed' AND end_date >= CURDATE() THEN 1 ELSE 0 END) as inProgress,
          SUM(CASE WHEN end_date < CURDATE() AND status != 'Completed' THEN 1 ELSE 0 END) as overdue
        FROM strategic_activities
        WHERE status != 'Draft'
      `
        }) as any[];

        const stats = {
            assigned: Number(taskStats[0]?.total || 0),
            overdue: Number(taskStats[0]?.overdue || 0),
            inProgress: Number(taskStats[0]?.inProgress || 0),
            completed: Number(taskStats[0]?.completed || 0)
        };

        // 2. Upcoming Deadlines
        const deadlines = await query({
            query: `
        SELECT 
          title,
          description,
          end_date as dueDate,
          status,
          progress,
          DATEDIFF(end_date, CURDATE()) as daysLeft
        FROM strategic_activities
        WHERE status != 'Completed'
        ORDER BY end_date ASC
        LIMIT 10
      `
        }) as any[];

        // 3. Recent Feedback / Scores
        // Placeholder as we don't have a dedicated evaluations table yet
        const feedback = [
            { id: 1, task: "Prepare Budget Estimate", score: 5.0, status: "Excellent", date: "2 days ago" },
            { id: 2, task: "Obtain Principal Approval", score: 4.0, status: "Good", date: "1 week ago" }
        ];

        return NextResponse.json({ stats, deadlines, feedback });
    } catch (error: any) {
        console.error('Staff Dashboard API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching staff dashboard data', detail: error.message },
            { status: 500 }
        );
    }
}
