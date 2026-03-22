-- Proposal workflow: Committee → Strategy Manager Review → Principal Decision → Department Assigned
-- Add status 'Strategy Reviewed' so proposals recommended by Strategy Manager go to Principal queue.

ALTER TABLE committee_proposals
MODIFY COLUMN status ENUM('Pending','Strategy Reviewed','Approved','Rejected','Edit Requested') DEFAULT 'Pending';
