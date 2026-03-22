import { query } from '@/lib/db';

/**
 * Returns committee_type values for a user from user_committee_assignments.
 * Returns empty array if table doesn't exist or user has no assignments.
 */
export async function getCommitteesForUser(userId: number): Promise<string[]> {
    try {
        const rows = (await query({
            query: 'SELECT committee_type FROM user_committee_assignments WHERE user_id = ? ORDER BY committee_type',
            values: [userId]
        })) as any[];
        return (rows || []).map((r: any) => r.committee_type).filter(Boolean);
    } catch {
        return [];
    }
}
