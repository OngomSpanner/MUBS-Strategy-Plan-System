import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { ensureParentIsStrategicActivity } from '@/lib/strategic-performance-types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

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

function mapStatusToDb(status: string): string {
  const s = (status || '').toLowerCase();
  if (s === 'completed') return 'completed';
  if (s === 'delayed' || s === 'overdue') return 'overdue';
  if (s === 'in progress' || s === 'on track' || s === 'in_progress') return 'in_progress';
  return 'pending';
}

const PILLAR_LEGACY_MAP: Record<string, string | null> = {
  'Research, Innovation & Community Engagement': 'Research & Innovation',
  'Equity & Social Safeguards': 'Governance',
  'Human Capital & Sustainability': 'Teaching & Learning',
  'Partnerships & Internationalisation': 'Partnerships',
};
const LEGACY_PILLARS = new Set(['Teaching & Learning', 'Research & Innovation', 'Governance', 'Infrastructure', 'Partnerships']);

function pillarForDb(pillar: string | null, useLegacy: boolean): string | null {
  if (!pillar || !String(pillar).trim()) return null;
  if (useLegacy) return PILLAR_LEGACY_MAP[pillar] ?? (LEGACY_PILLARS.has(pillar) ? pillar : null);
  return pillar;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      strategic_objective,
      description,
      pillar,
      department_id,
      department_ids,
      target_kpi,
      kpi_target_value,
      status,
      parent_id,
      progress,
      start_date,
      end_date
    } = body;

    const desc = strategic_objective ?? description ?? '';
    const rawDeptIds = department_ids ?? (department_id != null && department_id !== '' ? [department_id] : []);
    const deptIds = Array.isArray(rawDeptIds) ? rawDeptIds.map((x: unknown) => Number(x)).filter((x) => !Number.isNaN(x) && x > 0) : [];
    const dbStatus = mapStatusToDb(status);

    const existing = await query({
      query: 'SELECT id, parent_id FROM strategic_activities WHERE id = ?',
      values: [id]
    }) as { id: number; parent_id: number | null }[];
    if (!existing.length) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }
    // Two-tier flat: Strategic Activity (parent_id IS NULL) cannot become a child; only Weekly Tasks have a parent.
    const isStrategicActivity = existing[0].parent_id == null;
    const newParentId = parent_id != null && parent_id !== '' ? Number(parent_id) : null;
    if (newParentId != null) {
      if (isStrategicActivity) {
        return NextResponse.json(
          { message: 'A Strategic Activity (top-level goal) cannot have a parent. Only Weekly Tasks link to a Strategic Activity.' },
          { status: 400 }
        );
      }
      const validation = await ensureParentIsStrategicActivity(query, newParentId);
      if (!validation.valid) {
        return NextResponse.json({ message: validation.message }, { status: 400 });
      }
    }
    const mainId = existing[0].parent_id ?? existing[0].id;

    // If multiple depts, Main row has department_id = NULL and all depts get detailed rows.
    const mainDeptId = deptIds.length > 1 ? null : (deptIds[0] ?? null);
    const detailStartIndex = deptIds.length > 1 ? 0 : 1;
    const childDeptIds = deptIds.slice(detailStartIndex);

    const runUpdate = async (useLegacy: boolean) => {
      const pillarVal = pillarForDb(pillar && String(pillar).trim() ? pillar : null, useLegacy);
      const values = [
        title, desc, pillarVal, mainDeptId, target_kpi || null, kpi_target_value || null, dbStatus,
        newParentId, progress ?? 0, start_date || null, end_date || null, id
      ];

      try {
        await query({
          query: `
            UPDATE strategic_activities 
            SET title = ?, description = ?, pillar = ?, department_id = ?, target_kpi = ?, kpi_target_value = ?, status = ?, parent_id = ?, progress = ?, start_date = ?, end_date = ?
            WHERE id = ?
          `,
          values
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        if (err?.code === 'ER_BAD_FIELD_ERROR') {
          // This path handles DBs where kpi_target_value wasn't migrated but other updates are still allowed
          await query({
            query: `
              UPDATE strategic_activities 
              SET title = ?, description = ?, pillar = ?, department_id = ?, target_kpi = ?, status = ?, parent_id = ?, progress = ?, start_date = ?, end_date = ?
              WHERE id = ?
            `,
            values: [title, desc, pillarVal, mainDeptId, target_kpi || null, dbStatus, newParentId, progress ?? 0, start_date || null, end_date || null, id]
          });
        } else {
          throw err;
        }
      }

      // Handle Detailed (child) rows
      const children = await query({
        query: 'SELECT id FROM strategic_activities WHERE parent_id = ? ORDER BY id',
        values: [mainId]
      }) as { id: number }[];
      const childIds = children.map((c) => c.id);

      for (let i = 0; i < childIds.length; i++) {
        if (i < childDeptIds.length) {
          try {
            await query({
              query: 'UPDATE strategic_activities SET department_id = ?, title = ?, description = ?, pillar = ? WHERE id = ?',
              values: [childDeptIds[i], title, desc, pillarVal, childIds[i]]
            });
          } catch (err: any) {
            if (err?.code === 'ER_BAD_FIELD_ERROR') {
              await query({
                query: 'UPDATE strategic_activities SET department_id = ?, title = ?, description = ?, pillar = ? WHERE id = ?',
                values: [childDeptIds[i], title, desc, pillarVal, childIds[i]]
              });
            } else {
              throw err;
            }
          }
        } else {
          await query({ query: 'DELETE FROM strategic_activities WHERE id = ?', values: [childIds[i]] });
        }
      }
      for (let i = childIds.length; i < childDeptIds.length; i++) {
        const childInsertValues = [title, desc, pillarVal, childDeptIds[i], target_kpi || null, kpi_target_value || null, dbStatus, mainId, start_date || null, end_date || null];
        const childInsertLegacyValues = [title, desc, pillarVal, childDeptIds[i], target_kpi || null, dbStatus, mainId, start_date || null, end_date || null];
        try {
          await query({
            query: `
              INSERT INTO strategic_activities (activity_type, task_type, source, title, description, pillar, department_id, target_kpi, kpi_target_value, status, parent_id, progress, start_date, end_date)
              VALUES ('detailed', 'process', 'strategic_plan', ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
            `,
            values: childInsertValues
          });
        } catch (err: any) {
          if (err?.code === 'ER_BAD_FIELD_ERROR') {
            await query({
              query: `
                INSERT INTO strategic_activities (activity_type, task_type, source, title, description, pillar, department_id, target_kpi, status, parent_id, progress, start_date, end_date)
                VALUES ('detailed', 'process', 'strategic_plan', ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
              `,
              values: childInsertLegacyValues
            });
          } else {
            throw err;
          }
        }
      }
    };

    try {
      await runUpdate(false);
    } catch (err: any) {
      const msg = String(err?.message || '');
      const isSchemaError =
        msg.includes("Data truncated for column 'pillar'") ||
        msg.includes('pillar') && (msg.includes('truncated') || msg.includes('enum'));
      if (isSchemaError) {
        await runUpdate(true);
      } else {
        throw err;
      }
    }
    return NextResponse.json({ message: 'Activity updated successfully' });
  } catch (error: any) {
    console.error('Error updating activity. Details:', error.message || error);
    return NextResponse.json(
      { message: 'Error updating activity: ' + (error.message || 'Unknown error') },
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
    const row = await query({
      query: 'SELECT id, parent_id FROM strategic_activities WHERE id = ?',
      values: [id]
    }) as { id: number; parent_id: number | null }[];
    if (!row.length) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }
    const mainId = row[0].parent_id ?? row[0].id;
    await query({
      query: 'DELETE FROM strategic_activities WHERE id = ? OR parent_id = ?',
      values: [mainId, mainId]
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