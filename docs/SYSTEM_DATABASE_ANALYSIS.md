# System vs Database Analysis

**Reference schema:** `public/migrations/mubs_super_admin (7).sql`  
**Date:** March 2026

This document summarizes compatibility between the application and the database dump above.

---

## Summary

| Area | Status | Notes |
|------|--------|--------|
| **strategic_activities (core_objective)** | ✅ Fixed | Code uses try/catch fallback: if `core_objective` column is missing, INSERT/UPDATE run without it. |
| **Activities API (GET/POST)** | ✅ OK | GET uses `SELECT *`; POST has legacy insert path when `core_objective` is absent. |
| **Activity PUT & children** | ✅ Fixed | PUT and child UPDATE/INSERT use fallback when `core_objective` is not in schema. |
| **user_roles.role enum** | ⚠️ Optional migration | (7).sql enum: `strategy_manager`, `committee_member`, `hod`, `staff`, `principal`, `system_admin`. No `unit_head`. Run `add_unit_head_role.sql` if you need Unit Head role in `user_roles`. App still supports Unit Head via `users.role`. |
| **Seed subtasks** | ⚠️ Incompatible | Uses column `assigned_to` and pillar `'Human Capital & Sustainability'`; table has no `assigned_to` and pillar enum may not include that value. Use activity_assignments for assignments; avoid this seed on (7).sql or update the seed. |
| **Other tables** | ✅ Aligned | activity_assignments, activity_tracking, committee_proposals, departments, evaluations, notifications, staff_reports, users, user_committee_assignments match usage (with fallbacks where needed). |

---

## strategic_activities

- **(7).sql columns:** `id`, `activity_type`, `task_type`, `source`, `main_activity_id`, `parent_id`, `title`, `description`, `pillar`, `department_id`, `target_kpi`, `kpi_target_value`, `completion_criteria`, `priority`, `start_date`, `end_date`, `status`, `progress`, `actual_value`, `created_by`, `created_at`, `updated_at`, `meeting_reference`, `committee_suggestion_unit_id`.
- **No `core_objective`** in this dump.
- **Pillar enum:** `Teaching & Learning`, `Research & Innovation`, `Governance`, `Infrastructure`, `Partnerships`.
- **No `assigned_to`** — assignments are in `activity_assignments`.

**Code behaviour:**

- **GET /api/activities** – Selects with optional `core_objective`; fallback when column missing.
- **POST /api/activities** – Tries insert with `core_objective`; on schema error uses legacy insert (no `core_objective`).
- **GET /api/activities/[id]** – `SELECT *`; no dependency on `core_objective`.
- **PUT /api/activities/[id]** – Main UPDATE and child UPDATE/INSERT use `core_objective`; on error (e.g. unknown column) retry without `core_objective`. Child INSERTs include `activity_type` and `task_type` for (7).sql.

---

## user_roles and Unit Head

- **user_roles.role** in (7).sql: enum does not include `unit_head`. App allows role “Unit Head” and stores it in `users.role` (varchar). Assigning “Unit Head” into `user_roles` will fail unless you run the migration that adds `unit_head` to the enum (e.g. `add_unit_head_role.sql`). The app code detects this and can show a message to run that migration.

---

## Seed route: /api/seed-subtasks

- Inserts into `strategic_activities` with columns: `title`, `pillar`, `department_id`, `status`, `priority`, `parent_id`, `progress`, **`assigned_to`**, `description`, `start_date`, `end_date`.
- **(7).sql** has no `assigned_to`; pillar is an enum and seed uses `'Human Capital & Sustainability'`, which is not in the enum.
- **Recommendation:** Do not run this seed against (7).sql as-is; or change the seed to omit `assigned_to` and use a pillar value from the enum, and record assignments in `activity_assignments` if needed.

---

## Conclusion

- The **main application** (activities CRUD, department-head tasks, dashboards, users, committees, evaluations, etc.) is **compatible** with `mubs_super_admin (7).sql` after the **activity PUT/child fallback** (no `core_objective`) applied in `app/api/activities/[id]/route.ts`.
- **Optional:** Add `core_objective` to `strategic_activities` via a migration if you want the field stored in the DB; otherwise the app works without it.
- **Optional:** Run `add_unit_head_role.sql` if you need Unit Head in `user_roles`.
- **Avoid** using `/api/seed-subtasks` on (7).sql unless the seed is updated to match the schema and pillar enum.
