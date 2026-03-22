-- Process Task vs KPI-Driver Task (Task Type & KPI Logic)
-- Labels: Process Task (Department Internal / Operational), KPI-Driver Task (Strategy Plan)
-- Only KPI-Driver tasks update the parent Strategic Activity "Actuals" when completed.

-- strategic_activities: task_type for weekly tasks (parent_id IS NOT NULL); actual_value for parents (Actuals).
ALTER TABLE strategic_activities
  ADD COLUMN task_type ENUM('process','kpi_driver') NOT NULL DEFAULT 'process' AFTER activity_type,
  ADD COLUMN kpi_target_value DECIMAL(15,2) NULL AFTER target_kpi,
  ADD COLUMN actual_value DECIMAL(15,2) NULL AFTER progress;

-- staff_reports: store the numeric actual when a KPI-Driver task report is evaluated.
ALTER TABLE staff_reports
  ADD COLUMN kpi_actual_value DECIMAL(15,2) NULL AFTER progress_percentage;
