-- Plain Status Model (Validation Gate): HOD assigns one of three terminal statuses.
-- Staff can only submit (with mandatory file); HOD sets Complete, Incomplete (mandatory comment), or Not Done.

ALTER TABLE staff_reports
  MODIFY COLUMN status ENUM('draft','submitted','acknowledged','evaluated','incomplete','not_done') NOT NULL DEFAULT 'draft';
