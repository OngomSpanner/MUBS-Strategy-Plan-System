import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const activity = await query({
      query: 'SELECT * FROM strategic_activities WHERE id = ?',
      values: [id]
    });

    if (!(activity as any[]).length) {
      return NextResponse.json(
        { message: 'Activity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json((activity as any[])[0]);
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { message: 'Error fetching activity' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { title, pillar, unit_id, target_kpi, status, progress, start_date, end_date, description } = body;

    await query({
      query: `
        UPDATE strategic_activities 
        SET title = ?, pillar = ?, unit_id = ?, target_kpi = ?, 
            status = ?, progress = ?, start_date = ?, end_date = ?, description = ?
        WHERE id = ?
      `,
      values: [title, pillar, unit_id, target_kpi, status, progress ?? 0, start_date, end_date, description, id]
    });

    return NextResponse.json({ message: 'Activity updated successfully' });
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { message: 'Error updating activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await query({
      query: 'DELETE FROM strategic_activities WHERE id = ?',
      values: [id]
    });

    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { message: 'Error deleting activity' },
      { status: 500 }
    );
  }
}