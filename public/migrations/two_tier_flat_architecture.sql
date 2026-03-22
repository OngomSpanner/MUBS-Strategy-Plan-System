-- Two-Tier "Flat" Architecture for Strategic Performance & Task Management
-- Parent: Strategic Activity (fixed annual/quarterly goals). Child: Weekly Task (granular work units).
-- Rule: A Weekly Task (parent_id IS NOT NULL) may only link to a Strategic Activity (parent_id IS NULL).
-- No nested sub-tasks: parent of a child must be top-level.

-- Enforce that the parent of any child row is a Strategic Activity (parent_id IS NULL).
-- MySQL 8.0.16+ supports CHECK; for older or MyISAM we use a trigger.

DELIMITER $$

DROP TRIGGER IF EXISTS strategic_activities_before_insert_tier$$
CREATE TRIGGER strategic_activities_before_insert_tier
BEFORE INSERT ON strategic_activities
FOR EACH ROW
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM strategic_activities p
      WHERE p.id = NEW.parent_id AND p.parent_id IS NULL
    ) THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Two-tier flat architecture: a Weekly Task (parent_id set) must link to a Strategic Activity (parent_id IS NULL). No nested sub-tasks.';
    END IF;
  END IF;
END$$

DROP TRIGGER IF EXISTS strategic_activities_before_update_tier$$
CREATE TRIGGER strategic_activities_before_update_tier
BEFORE UPDATE ON strategic_activities
FOR EACH ROW
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM strategic_activities p
      WHERE p.id = NEW.parent_id AND p.parent_id IS NULL
    ) THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Two-tier flat architecture: a Weekly Task (parent_id set) must link to a Strategic Activity (parent_id IS NULL). No nested sub-tasks.';
    END IF;
  END IF;
END$$

DELIMITER ;
