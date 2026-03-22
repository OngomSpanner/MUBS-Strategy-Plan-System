# Principal Page Duplication Analysis

**URL:** `http://localhost:3000/principal`  
**Sections:** Executive Overview (`?pg=executive`), Strategic Summary (`?pg=strategic`), Performance Analytics (`?pg=analytics`), Reports (`?pg=reports`).

---

## Repeated information

### 1. Executive Overview (default)

| Item | Where it appears | Redundant? |
|------|-------------------|------------|
| **Compliance Rate** | KPI hero (large) + first Stat Card | Yes — same number in two places. |
| **Delayed count** | KPI hero (On Track / In Progress / **Delayed** / Departments) + second Stat Card "Delayed Activities" + Overdue Activities table (detail) | Yes — Stat Card repeats hero; table is the useful detail. |
| **Risk Alerts** | Stat Card only + "Active Risk Alerts" panel (detail) | No — card is summary, panel is detail. |
| **Active Staff** | Stat Card only | No. |
| **Faculty → Department hierarchy + progress** | "Compliance by Department" card (full list) | Yes — same structure and progress appear again on Strategic Summary. |

**Recommendation:** Remove the **Compliance Rate** and **Delayed Activities** Stat Cards. Replace the full **Compliance by Department** list with a short compliance summary (e.g. donut + Compliant/Watch/Critical counts) and a link to **Strategic Summary** for the full faculty/department breakdown.

---

### 2. Strategic Summary (`?pg=strategic`)

| Item | Where it appears | Redundant? |
|------|-------------------|------------|
| **Total Activities, On Track, In Progress, Delayed** | Four stat cards at top | Yes — same four metrics already in Executive hero. |
| **Faculties & Offices → departments/units with progress** | Expandable list | Partially — same hierarchy and progress as Executive’s "Compliance by Department". |

**Recommendation:** Remove the four stat cards from Strategic Summary (or replace with one line: "Key metrics: see Executive Overview"). Keep the expandable Faculties & Offices list as the **single** place for the full faculty/department breakdown (and remove the full list from Executive).

---

### 3. Performance Analytics (`?pg=analytics`)

| Item | Where it appears | Redundant? |
|------|-------------------|------------|
| **On Track / In Progress / Delayed** | "Activity Status Split" in Department tab | Same breakdown as Executive, but in an analytics context — acceptable. |
| **Compliant / Watch / Critical** | Compliance tab | Same bands (≥75%, 50–74%, <50%) as compliance elsewhere — acceptable as distribution view. |

**Recommendation:** No removal. Keep as-is for analytics/reporting.

---

### 4. Reports (`?pg=reports`)

No duplicated metrics on screen; only export options and history. No change.

---

## Summary: what to remove

1. **Executive Overview**
   - Remove the two Stat Cards: **Compliance Rate** and **Delayed Activities** (keep **Risk Alerts** and **Active Staff**).
   - Replace the full **Compliance by Department** list with a compact compliance summary (donut + counts) and a link: *"View faculty/department breakdown in Strategic Summary"*.

2. **Strategic Summary**
   - Remove the four stat cards (Total Activities, On Track, In Progress, Delayed). Optionally add one line: *"Key metrics: see Executive Overview"* or a link to `?pg=executive`.

3. **Performance Analytics & Reports**  
   - No removals.

After these changes, high-level numbers live in the Executive hero, compliance summary on Executive with detail in Strategic, and Strategic is the single place for the full faculty/department list.
