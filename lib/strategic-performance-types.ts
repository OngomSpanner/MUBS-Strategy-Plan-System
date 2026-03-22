/**
 * Strategic Performance & Task Management — Two-Tier "Flat" Architecture
 *
 * Parent: Strategic Activity — Fixed annual/quarterly goals from the Strategic Plan.
 * Child:  Weekly Task — Granular units of work assigned to staff.
 *
 * Rule: Multiple tasks are siblings linked directly to one Strategic Activity.
 *       There are no nested sub-tasks or milestones.
 */

/** Strategic Activity: row in strategic_activities where parent_id IS NULL */
export type StrategicActivity = {
  id: number;
  parent_id: null;
  activity_type: 'main';
  title: string;
  [key: string]: unknown;
};

/** Weekly Task: row in strategic_activities where parent_id = Strategic Activity id */
export type WeeklyTask = {
  id: number;
  parent_id: number;
  activity_type: 'detailed';
  title: string;
  [key: string]: unknown;
};

export const TIER = {
  STRATEGIC_ACTIVITY: 'strategic_activity',
  WEEKLY_TASK: 'weekly_task',
} as const;

/** SQL fragment: only Strategic Activities (eligible as parent for Weekly Tasks) */
export const WHERE_STRATEGIC_ACTIVITY = 'parent_id IS NULL';

/** SQL fragment: only Weekly Tasks (children of a Strategic Activity) */
export const WHERE_WEEKLY_TASK = 'parent_id IS NOT NULL';

/**
 * Validates that the given parent_id refers to a Strategic Activity (parent_id IS NULL).
 * Use before creating/updating a Weekly Task.
 */
export async function ensureParentIsStrategicActivity(
  query: (opts: { query: string; values?: unknown[] }) => Promise<unknown>,
  parentId: number
): Promise<{ valid: boolean; message?: string }> {
  const rows = await query({
    query: 'SELECT id FROM strategic_activities WHERE id = ? AND parent_id IS NULL',
    values: [parentId],
  }) as { id: number }[];
  if (rows.length === 0) {
    return {
      valid: false,
      message: 'Parent must be a Strategic Activity (top-level goal). Cannot link a Weekly Task to another task or invalid activity.',
    };
  }
  return { valid: true };
}
