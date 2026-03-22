-- Seed: Add committee proposals with status 'Pending' so they appear in
-- Principal > Committee proposals (waiting review).
-- Run this after loading mubs_super_admin (7).sql if you want sample pending proposals.
-- Uses existing users (e.g. id 4) and departments (e.g. 7 = Department of Accounting).

INSERT INTO committee_proposals (
  committee_type, title, minute_reference, description, submitted_by, department_id, budget, status, implementation_status, submitted_date
) VALUES
('TMC', 'Annual ICT Infrastructure Upgrade', 'TMC/2026/03', 'Proposal for upgrading campus network and lab equipment for next academic year.', 4, 7, 250000.00, 'Pending', 'Pending', CURDATE()),
('Academic Board', 'New Postgraduate Programme in Data Science', NULL, 'Proposal to introduce MSc Data Science from next intake.', 4, 1, NULL, 'Pending', 'Pending', CURDATE());
