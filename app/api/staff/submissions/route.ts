import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Unauthorized');

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        const ratingToScore: Record<string, number> = { excellent: 5, good: 4, satisfactory: 3, needs_improvement: 2, poor: 1 };

        // Fetch all submissions for this user (including drafts)
        const submissionsRecords = await query({
            query: `
                SELECT 
                    sr.id,
                    aa.id as task_id,
                    sa.id as activity_id,
                    sa.title as report_name,
                    sa.description as task_description,
                    aa.start_date,
                    aa.end_date,
                    p.title as activity_title,
                    sr.updated_at as submitted_at,
                    sr.submitted_at as submitted_at_ts,
                    sr.status as db_status,
                    e.rating,
                    sr.progress_percentage as progress,
                    sr.kpi_actual_value,
                    sr.achievements as description,
                    sr.attachments,
                    e.qualitative_feedback as reviewer_notes
                FROM staff_reports sr
                JOIN activity_assignments aa ON sr.activity_assignment_id = aa.id
                JOIN strategic_activities sa ON aa.activity_id = sa.id
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                LEFT JOIN evaluations e ON e.staff_report_id = sr.id
                WHERE aa.assigned_to_user_id = ?
                ORDER BY sr.updated_at DESC
            `,
            values: [decoded.userId]
        }) as any[];

        const statusMap: Record<string, string | ((r: any) => string)> = {
            'draft': (r: any) => (r.rating != null ? 'Returned' : 'In Progress'),
            'submitted': 'Under Review',
            'evaluated': 'Completed',
            'acknowledged': 'Completed',
            'incomplete': 'Incomplete',
            'not_done': 'Not Done'
        };

        const submissions = submissionsRecords.map((r: any) => {
            const rawStatus = statusMap[r.db_status];
            const status = typeof rawStatus === 'function' ? rawStatus(r) : (rawStatus || 'Unknown');
            const score = r.rating ? ratingToScore[r.rating] : null;
            return {
                id: r.id,
                task_id: r.task_id,
                report_name: r.report_name,
                activity_title: r.activity_title,
                task_description: r.task_description,
                start_date: r.start_date,
                end_date: r.end_date,
                submitted_at: r.submitted_at_ts || r.submitted_at,
                status,
                score,
                progress: r.progress,
                kpi_actual_value: r.kpi_actual_value,
                description: r.description,
                attachments: r.attachments,
                reviewer_notes: r.reviewer_notes
            };
        });

        // Stats: total submitted = non-draft; under review = submitted; reviewed = evaluated/acknowledged; returned = draft with evaluation
        const reviewed = submissions.filter((r: any) => r.status === 'Completed').length;
        const returned = submissions.filter((r: any) => r.status === 'Returned').length;
        const totalEvaluations = reviewed + returned;

        const incomplete = submissions.filter((r: any) => r.status === 'Incomplete').length;
        const stats = {
            totalSubmitted: submissionsRecords.filter((r: any) => r.db_status !== 'draft').length,
            underReview: submissions.filter((r: any) => r.status === 'Under Review').length,
            reviewed,
            returned,
            incomplete,
            totalEvaluations,
            completionRate: totalEvaluations > 0 ? Math.round((reviewed / totalEvaluations) * 100) : 0
        };

        return NextResponse.json({
            submissions,
            stats
        });

    } catch (error: any) {
        console.error('Staff Submissions API Error:', error);
        return NextResponse.json(
            { message: 'Error fetching staff submissions', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) throw new Error('Unauthorized');

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        const formData = await req.formData();
        const taskId = formData.get('taskId') as string; // This is sa.id
        const description = (formData.get('description') as string)?.trim() ?? '';
        const evidenceLink = formData.get('evidenceLink') as string;
        const isDraft = formData.get('isDraft') === 'true';
        const file = formData.get('file') as File | null;

        if (!taskId) throw new Error('Task ID is required');

        // Look up the activity assignment ID (taskId is now the specific aa.id)
        const aaRecords = await query({
            query: 'SELECT id FROM activity_assignments WHERE id = ? AND assigned_to_user_id = ?',
            values: [taskId, decoded.userId]
        }) as any[];

        if (aaRecords.length === 0) {
            return NextResponse.json({ message: 'No assignment found for this task' }, { status: 404 });
        }
        const assignmentId = aaRecords[0].id;

        let fileUrl = '';
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), 'public/uploads');
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\\-_]/g, '')}`;
            const filepath = path.join(uploadDir, uniqueFilename);
            await writeFile(filepath, buffer);
            fileUrl = `/uploads/${uniqueFilename}`;
        }

        let combinedEvidence = evidenceLink || '';
        if (fileUrl) {
            if (combinedEvidence) combinedEvidence += ` | ${fileUrl}`;
            else combinedEvidence = fileUrl;
        }

        const reportStatus = isDraft ? 'draft' : 'submitted';

        // Insert or update staff report
        const existingReport = await query({
            query: 'SELECT id FROM staff_reports WHERE activity_assignment_id = ? AND submitted_by = ?',
            values: [assignmentId, decoded.userId]
        }) as any[];

        if (existingReport.length > 0) {
            await query({
                query: `
                    UPDATE staff_reports 
                    SET progress_percentage = 0, 
                        achievements = ?, 
                        attachments = ?, 
                        kpi_actual_value = ?,
                        updated_at = NOW(),
                        status = ?,
                        submitted_at = IF(? = 'submitted', NOW(), submitted_at)
                    WHERE id = ?
                `,
                values: [description || null, combinedEvidence || null, formData.get('kpiActualValue') || null, reportStatus, reportStatus, existingReport[0].id]
            });
        } else {
            await query({
                query: `
                    INSERT INTO staff_reports 
                    (activity_assignment_id, submitted_by, report_date, progress_percentage, achievements, attachments, kpi_actual_value, status, submitted_at)
                    VALUES (?, ?, CURDATE(), 0, ?, ?, ?, ?, IF(? = 'submitted', NOW(), NULL))
                `,
                values: [assignmentId, decoded.userId, description || null, combinedEvidence || null, formData.get('kpiActualValue') || null, reportStatus, reportStatus]
            });
        }

        // Update the assignment status
        await query({
            query: `
                UPDATE activity_assignments 
                SET status = ? 
                WHERE id = ?
            `,
            values: [reportStatus === 'submitted' ? 'submitted' : 'in_progress', assignmentId]
        });
        
        return NextResponse.json({ success: true, message: isDraft ? 'Draft saved' : 'Report submitted successfully' });

    } catch (error: any) {
        console.error('Staff Submissions API POST Error:', error);
        return NextResponse.json(
            { message: 'Error submitting report', detail: error.message },
            { status: error.message === 'Unauthorized' ? 401 : 500 }
        );
    }
}
