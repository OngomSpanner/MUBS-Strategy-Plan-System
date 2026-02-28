'use client';
import React from 'react';

export default function UnitHeadDashboard() {
    return (
        <div id="page-dashboard" className="page-section active-page">
            {/* HR Warning banner */}
            <div className="alert alert-warning alert-strip alert-dismissible fade show mb-4 d-flex align-items-center gap-2" role="alert">
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
                <div>
                    <strong>Unit Warnings:</strong> 1 staff member on leave · 1 contract expiring in 12 days.
                    <a href="#" className="alert-link fw-semibold" onClick={(e) => { e.preventDefault(); }}> Review staff →</a>
                </div>
                <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>

            {/* Stat cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-blue)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#eff6ff' }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>assignment</span>
                            </div>
                            <span className="stat-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Assigned</span>
                        </div>
                        <div className="stat-label">Strategic Activities</div>
                        <div className="stat-value">24</div>
                        <div className="stat-sub">From 2024–28 Strategic Plan</div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#ecfdf5' }}>
                                <span className="material-symbols-outlined" style={{ color: '#059669' }}>task_alt</span>
                            </div>
                            <span className="stat-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>trending_up</span> +3
                            </span>
                        </div>
                        <div className="stat-label">Tasks Created</div>
                        <div className="stat-value">41</div>
                        <div className="stat-sub">Across 24 activities</div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-yellow)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fffbeb' }}>
                                <span className="material-symbols-outlined" style={{ color: '#b45309' }}>inbox</span>
                            </div>
                            <span className="stat-badge" style={{ background: '#fffbeb', color: '#b45309' }}>Pending</span>
                        </div>
                        <div className="stat-label">Pending Submissions</div>
                        <div className="stat-value">6</div>
                        <div className="stat-sub">Awaiting your review</div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-red)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fff1f2' }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>warning</span>
                            </div>
                            <span className="stat-badge" style={{ background: '#fff1f2', color: 'var(--mubs-red)' }}>HR</span>
                        </div>
                        <div className="stat-label">HR Warnings</div>
                        <div className="stat-value">2</div>
                        <div className="stat-sub">Leave + Contract expiry</div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Unit progress */}
                <div className="col-12 col-lg-8">
                    <div className="table-card mb-4">
                        <div className="table-card-header">
                            <h5>
                                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>analytics</span>
                                Unit Activity Progress
                            </h5>
                            <button className="btn btn-sm btn-outline-secondary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>Activity</th>
                                        <th>Tasks</th>
                                        <th>Progress</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="activity-icon">
                                                    <span className="material-symbols-outlined">laptop</span>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Digital Learning Infrastructure</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>Due Jun 2025</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="fw-bold text-dark">5</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>/ 5</span></td>
                                        <td style={{ minWidth: '120px' }}>
                                            <div className="progress-bar-custom">
                                                <div className="progress-bar-fill" style={{ width: '78%', background: '#005696' }}></div>
                                            </div>
                                            <span style={{ fontSize: '.72rem', color: '#64748b' }}>78%</span>
                                        </td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>On Track</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="activity-icon">
                                                    <span className="material-symbols-outlined">code</span>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Software Dev Curriculum Update</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>Due May 2025</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="fw-bold text-dark">4</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>/ 4</span></td>
                                        <td style={{ minWidth: '120px' }}>
                                            <div className="progress-bar-custom">
                                                <div className="progress-bar-fill" style={{ width: '95%', background: '#10b981' }}></div>
                                            </div>
                                            <span style={{ fontSize: '.72rem', color: '#64748b' }}>95%</span>
                                        </td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>On Track</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="activity-icon">
                                                    <span className="material-symbols-outlined">school</span>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Industry Attachment Programme</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>Due Aug 2025</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="fw-bold text-dark">2</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>/ 6</span></td>
                                        <td style={{ minWidth: '120px' }}>
                                            <div className="progress-bar-custom">
                                                <div className="progress-bar-fill" style={{ width: '38%', background: '#ffcd00' }}></div>
                                            </div>
                                            <span style={{ fontSize: '.72rem', color: '#64748b' }}>38%</span>
                                        </td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="activity-icon">
                                                    <span className="material-symbols-outlined">computer</span>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Computer Lab Upgrade — Phase 2</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>Due Apr 2025 ⚠</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="fw-bold text-dark">1</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>/ 4</span></td>
                                        <td style={{ minWidth: '120px' }}>
                                            <div className="progress-bar-custom">
                                                <div className="progress-bar-fill" style={{ width: '20%', background: '#e31837' }}></div>
                                            </div>
                                            <span style={{ fontSize: '.72rem', color: '#64748b' }}>20%</span>
                                        </td>
                                        <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Delayed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent submissions quick */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5>
                                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>inbox</span>
                                Recent Submissions
                            </h5>
                            <button className="btn btn-sm btn-outline-secondary">View All</button>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>Staff</th>
                                        <th>Report / Task</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#7c3aed' }}>JA</div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>J. Amuge</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.83rem' }}>Lab Setup — Phase 1 Report</td>
                                        <td style={{ fontSize: '.8rem', color: '#64748b' }}>Today, 08:42</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending Review</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-primary py-0 px-2 fw-bold" style={{ fontSize: '.75rem', background: 'var(--mubs-blue)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>rate_review</span> Review
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#059669' }}>PK</div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>P. Kato</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.83rem' }}>Curriculum Draft — CS302</td>
                                        <td style={{ fontSize: '.8rem', color: '#64748b' }}>Yesterday</td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Reviewed</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#b45309' }}>MO</div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>M. Ogen</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.83rem' }}>Industry Contacts Register</td>
                                        <td style={{ fontSize: '.8rem', color: '#64748b' }}>14 Apr</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending Review</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-primary py-0 px-2 fw-bold" style={{ fontSize: '.75rem', background: 'var(--mubs-blue)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>rate_review</span> Review
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                    {/* HR Warnings */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5>
                                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>warning</span>
                                System Warnings
                            </h5>
                            <span className="badge bg-danger">2 Active</span>
                        </div>
                        <div className="p-3">
                            <div className="warn-card" style={{ background: '#fff1f2' }}>
                                <div className="warn-icon" style={{ background: '#fee2e2' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#e31837' }}>person_off</span>
                                </div>
                                <div>
                                    <div className="warn-title">B. Nakato — On Medical Leave</div>
                                    <div className="warn-meta">From 18 Apr 2025 · Expected return 25 Apr · 3 tasks reassigned</div>
                                    <button className="btn btn-xs btn-danger mt-1 py-0 px-2 fw-bold" style={{ fontSize: '.72rem' }}>Assign Cover</button>
                                </div>
                            </div>
                            <div className="warn-card" style={{ background: '#fffbeb' }}>
                                <div className="warn-icon" style={{ background: '#fef3c7' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#b45309' }}>badge</span>
                                </div>
                                <div>
                                    <div className="warn-title">C. Opio — Contract Expiring</div>
                                    <div className="warn-meta">Contract ends 27 Apr 2025 · 12 days remaining · HR notified</div>
                                    <button className="btn btn-xs btn-warning mt-1 py-0 px-2 fw-bold text-dark" style={{ fontSize: '.72rem' }}>Remind HR</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5>
                                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>bolt</span>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="p-3 d-flex flex-column gap-2">
                            <button className="btn btn-outline-primary fw-bold text-start d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>add_task</span>
                                Create Sub-Activity / Task
                            </button>
                            <button className="btn btn-outline-primary fw-bold text-start d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>assignment_ind</span>
                                Assign Task to Staff
                            </button>
                            <button className="btn btn-outline-warning fw-bold text-start d-flex align-items-center gap-2 text-dark">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>inbox</span>
                                Review Submissions
                                <span className="badge bg-warning text-dark ms-auto">6</span>
                            </button>
                            <button className="btn btn-outline-danger fw-bold text-start d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-red)' }}>warning</span>
                                View HR Warnings
                                <span className="badge bg-danger ms-auto">2</span>
                            </button>
                            <button className="btn btn-outline-success fw-bold text-start d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#059669' }}>rate_review</span>
                                Evaluate Staff Reports
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
