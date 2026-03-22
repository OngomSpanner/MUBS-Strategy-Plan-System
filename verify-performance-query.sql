use mubs_super_admin;
-- Check if Jane's evaluated report is picked up by the performance query
SELECT 
    sr.id,
    sr.status as db_status,
    DATE(COALESCE(e.evaluation_date, sr.updated_at)) as eval_date,
    aa.assigned_to_user_id as staff_id,
    u.full_name as staff_name,
    sa.department_id,
    p.department_id as parent_dept_id
FROM staff_reports sr
JOIN activity_assignments aa ON sr.activity_assignment_id = aa.id
JOIN strategic_activities sa ON aa.activity_id = sa.id
LEFT JOIN strategic_activities p ON sa.parent_id = p.id
LEFT JOIN evaluations e ON e.staff_report_id = sr.id
LEFT JOIN users u ON u.id = aa.assigned_to_user_id
WHERE (sa.department_id IN (16) OR (p.id IS NOT NULL AND p.department_id IN (16)))
AND sr.status IN ('evaluated', 'incomplete', 'not_done');
