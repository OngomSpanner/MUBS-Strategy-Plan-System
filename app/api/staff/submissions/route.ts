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
        console.log('DECODED TOKEN IS:', decoded);
        if (!decoded || !decoded.userId) throw new Error('Invalid token');

        // Fetch submissions assigned to user which have been submitted (Under Review, Completed, Returned, or In Progress)
        const submissionsRecords = await query({
            query: `
                SELECT 
                    sa.id,
                    sa.title as report_name,
                    p.title as activity_title,
                    sa.updated_at as submitted_at,
                    sa.status,
                    sa.score,
                    sa.progress,
                    sa.description,
                    sa.reviewer_notes
                FROM strategic_activities sa
                LEFT JOIN strategic_activities p ON sa.parent_id = p.id
                WHERE sa.assigned_to = ?
                AND sa.status IN ('Under Review', 'Completed', 'Returned', 'In Progress')
                ORDER BY sa.updated_at DESC
            `,
            values: [decoded.userId]
        }) as any[];

        // Calculate stats correctly
        const stats = {
            totalSubmitted: submissionsRecords.length,
            underReview: submissionsRecords.filter(r => r.status === 'Under Review').length,
            reviewed: submissionsRecords.filter(r => r.status === 'Completed').length,
            returned: submissionsRecords.filter(r => r.status === 'Returned').length
        };

        return NextResponse.json({
            submissions: submissionsRecords,
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
        const taskId = formData.get('taskId') as string;
        const reportType = formData.get('reportType') as string;
        const progress = parseInt(formData.get('progress') as string || '0', 10);
        const description = formData.get('description') as string;
        const evidenceLink = formData.get('evidenceLink') as string;
        const isDraft = formData.get('isDraft') === 'true';
        const file = formData.get('file') as File | null;

        if (!taskId) throw new Error('Task ID is required');

        let fileUrl = '';
        if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), 'public/uploads');
            try {
                await mkdir(uploadDir, { recursive: true });
            } catch (err) { }

            const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
            const filepath = path.join(uploadDir, uniqueFilename);
            await writeFile(filepath, buffer);
            fileUrl = `/uploads/${uniqueFilename}`;
        }

        let newStatus = 'In Progress';
        if (!isDraft) {
            if (reportType === 'completion') newStatus = 'Under Review';
            else if (reportType === 'issue') newStatus = 'Delayed';
            else newStatus = 'In Progress';
        } else {
            newStatus = 'In Progress'; // drafts default to in progress generally
        }

        let combinedEvidence = evidenceLink || '';
        if (fileUrl) {
            if (combinedEvidence) combinedEvidence += ` | ${fileUrl}`;
            else combinedEvidence = fileUrl;
        }

        await query({
            query: `
                UPDATE strategic_activities 
                SET progress = ?, status = COALESCE(?, status), description = ?, evidence_url = ?, updated_at = NOW()
                WHERE id = ? AND assigned_to = ?
            `,
            values: [
                progress,
                isDraft ? null : newStatus, // Keep existing status if draft
                description,
                combinedEvidence || null,
                taskId,
                decoded.userId
            ]
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
