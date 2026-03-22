use mubs_super_admin;
SELECT
  u.full_name AS name,
  COALESCE(d.name, '—') AS department,
  IFNULL(assigned.cnt, 0) AS assigned,
  IFNULL(compl.cnt, 0) AS completed,
  CASE
    WHEN IFNULL(assigned.cnt, 0) = 0 THEN 0
    ELSE ROUND(IFNULL(compl.cnt, 0) * 100.0 / assigned.cnt, 0)
  END AS rate
FROM users u
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN (
  SELECT assigned_to_user_id, COUNT(*) AS cnt
  FROM activity_assignments
  GROUP BY assigned_to_user_id
) assigned ON assigned.assigned_to_user_id = u.id
LEFT JOIN (
  SELECT aa.assigned_to_user_id, COUNT(*) AS cnt
  FROM activity_assignments aa
  LEFT JOIN strategic_activities sa ON aa.activity_id = sa.id
  WHERE aa.status IN ('completed', 'submitted', 'evaluated')
      OR sa.status = 'completed'
  GROUP BY aa.assigned_to_user_id
) compl ON compl.assigned_to_user_id = u.id
WHERE u.status = 'Active'
AND u.full_name LIKE '%Jane Juanita%';
