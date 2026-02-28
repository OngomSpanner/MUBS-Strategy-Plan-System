import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        // 1. Proposal Stats
        const proposalStats = await query({
            query: `
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
        FROM committee_proposals
      `
        }) as any[];

        // 2. Recent Proposals
        const recentProposals = await query({
            query: `
        SELECT 
          title,
          status,
          DATE_FORMAT(submitted_at, '%d %b %Y') as date,
          description as meta
        FROM committee_proposals
        ORDER BY submitted_at DESC
        LIMIT 3
      `
        }) as any[];

        // 3. System Activity (Placeholder)
        const recentActivity = [
            { description: "Research Ethics Framework approved", timestamp: "Today", icon: "check_circle", bgColor: "#dcfce7", iconColor: "#059669" },
            { description: "AI Integration Policy under review", timestamp: "10 Apr", icon: "hourglass_top", bgColor: "#fef9c3", iconColor: "#b45309" }
        ];

        return NextResponse.json({
            stats: proposalStats[0],
            proposals: recentProposals,
            activity: recentActivity
        });
    } catch (error: any) {
        console.error('Committee Dashboard API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching committee dashboard data', detail: error.message },
            { status: 500 }
        );
    }
}
