import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const proposals = await query({
      query: `
        SELECT 
          cp.*,
          u.full_name as submitted_by,
          un.name as unit,
          DATE_FORMAT(cp.submitted_date, '%d %b %Y') as submitted_date,
          cp.budget / 1000000 as budget
        FROM committee_proposals cp
        LEFT JOIN users u ON cp.submitted_by = u.id
        LEFT JOIN units un ON cp.unit_id = un.id
        ORDER BY cp.submitted_date DESC
        LIMIT 50
      `
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { message: 'Error fetching proposals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, submitted_by, unit_id, budget, status } = body;

    const result = await query({
      query: `
        INSERT INTO committee_proposals 
        (title, description, submitted_by, unit_id, budget, status, submitted_date) 
        VALUES (?, ?, ?, ?, ?, ?, CURDATE())
      `,
      values: [title, description, submitted_by, unit_id, budget * 1000000, status || 'Pending']
    });

    return NextResponse.json(
      { message: 'Proposal created successfully', id: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { message: 'Error creating proposal' },
      { status: 500 }
    );
  }
}