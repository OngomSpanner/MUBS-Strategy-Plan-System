/**
 * Committee types used in committee_proposals and user_committee_assignments.
 * Keep in sync with DB enum/values.
 */
export const COMMITTEE_TYPES = ['Council', 'TMC', 'Academic Board', 'Other'] as const;
export type CommitteeType = (typeof COMMITTEE_TYPES)[number];

export function isCommitteeType(s: string): s is CommitteeType {
  return COMMITTEE_TYPES.includes(s as CommitteeType);
}
