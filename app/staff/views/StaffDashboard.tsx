"use client";

import React from 'react';
import Link from 'next/link';

export default function StaffDashboard() {
    return (
        <div className="content-area w-100">
            {/* Welcome banner */}
            <div className="p-4 mb-4 rounded-3" style={{ background: 'linear-gradient(135deg, var(--mubs-blue) 0%, var(--mubs-navy) 100%)', border: '1px solid rgba(255,255,255,.1)' }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <div className="profile-avatar text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', fontSize: '1rem', borderRadius: '10px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>JA</div>
                            <div>
                                <div className="fw-black text-white" style={{ fontSize: '1.15rem' }}>Welcome back, Jane 👋</div>
                                <div className="text-white-50" style={{ fontSize: '.82rem' }}>Lecturer · Faculty of Computing · FY 2024–25</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className="text-white-50" style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.1em' }}>Overall Progress</div>
                        <div className="fw-black text-white" style={{ fontSize: '2rem', lineHeight: '1' }}>72%</div>
                        <div style={{ width: '140px', height: '8px', background: 'rgba(255,255,255,.2)', borderRadius: '99px', overflow: 'hidden', marginTop: '4px' }}>
                            <div style={{ width: '72%', height: '100%', background: 'var(--mubs-yellow)', borderRadius: '99px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-blue)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#eff6ff' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>task_alt</span></div>
                            <span className="stat-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Active</span>
                        </div>
                        <div className="stat-label">My Tasks</div>
                        <div className="stat-value">9</div>
                        <div className="stat-sub">Across 3 activities</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-red)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fff1f2' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>event_busy</span></div>
                            <span className="stat-badge" style={{ background: '#fff1f2', color: 'var(--mubs-red)' }}>⚠ Urgent</span>
                        </div>
                        <div className="stat-label">Overdue</div>
                        <div className="stat-value">1</div>
                        <div className="stat-sub">Needs immediate action</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-yellow)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fffbeb' }}><span className="material-symbols-outlined" style={{ color: '#b45309' }}>upload_file</span></div>
                            <span className="stat-badge" style={{ background: '#fffbeb', color: '#b45309' }}>Pending</span>
                        </div>
                        <div className="stat-label">Reports Submitted</div>
                        <div className="stat-value">6</div>
                        <div className="stat-sub">2 awaiting review</div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#ecfdf5' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>star</span></div>
                            <span className="stat-badge" style={{ background: '#ecfdf5', color: '#059669' }}>Latest</span>
                        </div>
                        <div className="stat-label">Avg. Evaluation Score</div>
                        <div className="stat-value">4.2<span style={{ fontSize: '1rem', color: '#64748b' }}>/5</span></div>
                        <div className="stat-sub">Good performance</div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Task quick view */}
                <div className="col-12 col-lg-7">
                    <div className="table-card mb-4">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>task_alt</span>My Active Tasks</h5>
                            <Link href="/staff?pg=tasks" className="btn btn-sm btn-outline-secondary">View All</Link>
                        </div>
                        <div className="p-3">
                            <div className="task-row overdue">
                                <div className="d-flex align-items-start gap-3 flex-wrap">
                                    <div className="activity-icon"><span className="material-symbols-outlined">description</span></div>
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '.9rem' }}>Write Tender for Computers</div>
                                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Overdue</span>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '.75rem' }}>Computer Lab Upgrade · Due <span style={{ color: 'var(--mubs-red)', fontWeight: '700' }}>15 Apr 2025</span> (5 days late)</div>
                                        <div className="mt-2"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '25%', background: 'var(--mubs-red)' }}></div></div></div>
                                    </div>
                                    <Link href="/staff?pg=submit" className="btn btn-sm fw-bold text-white" style={{ background: 'var(--mubs-blue)', fontSize: '.78rem' }}>Submit Now</Link>
                                </div>
                            </div>
                            <div className="task-row">
                                <div className="d-flex align-items-start gap-3 flex-wrap">
                                    <div className="activity-icon"><span className="material-symbols-outlined">settings_ethernet</span></div>
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '.9rem' }}>Configure LAN Switches</div>
                                            <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '.75rem' }}>Digital Learning Infra. · Due 21 Apr 2025</div>
                                        <div className="mt-2"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '40%', background: 'var(--mubs-yellow)' }}></div></div></div>
                                    </div>
                                    <Link href="/staff?pg=submit" className="btn btn-sm btn-outline-primary fw-bold" style={{ fontSize: '.78rem' }}>Update</Link>
                                </div>
                            </div>
                            <div className="task-row pending-review">
                                <div className="d-flex align-items-start gap-3 flex-wrap">
                                    <div className="activity-icon"><span className="material-symbols-outlined">inbox</span></div>
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '.9rem' }}>Lab Setup Report — Phase 1</div>
                                            <span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Submitted · Under Review</span>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '.75rem' }}>Digital Learning Infra. · Submitted Today</div>
                                        <div className="mt-2"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '100%', background: '#93c5fd' }}></div></div></div>
                                    </div>
                                    <Link href="/staff?pg=submissions" className="btn btn-sm btn-outline-secondary fw-bold" style={{ fontSize: '.78rem' }}>View</Link>
                                </div>
                            </div>
                            <div className="task-row completed">
                                <div className="d-flex align-items-start gap-3 flex-wrap">
                                    <div className="activity-icon"><span className="material-symbols-outlined">receipt_long</span></div>
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '.9rem', textDecoration: 'line-through' }}>Prepare Budget Estimate</div>
                                            <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Completed · Score: 5/5</span>
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '.75rem' }}>Digital Learning Infra. · Completed 08 Apr</div>
                                        <div className="mt-2"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div></div></div>
                                    </div>
                                    <Link href="/staff?pg=feedback" className="btn btn-sm btn-outline-secondary fw-bold" style={{ fontSize: '.78rem' }}>Feedback</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="col-12 col-lg-5 d-flex flex-column gap-4">
                    {/* Upcoming deadlines */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>schedule</span>Upcoming Deadlines</h5>
                            <Link href="/staff?pg=deadlines" className="btn btn-sm btn-outline-secondary">All</Link>
                        </div>
                        <div className="p-3">
                            <div className="deadline-banner" style={{ background: '#fff1f2' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                                    <span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>event_busy</span>
                                </div>
                                <div className="flex-fill">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Write Tender for Computers</div>
                                    <div className="text-muted" style={{ fontSize: '.73rem' }}>Was due 15 Apr</div>
                                </div>
                                <span className="deadline-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>5d late</span>
                            </div>
                            <div className="deadline-banner" style={{ background: '#fffbeb' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#b45309' }}>schedule</span>
                                </div>
                                <div className="flex-fill">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Configure LAN Switches</div>
                                    <div className="text-muted" style={{ fontSize: '.73rem' }}>Due 21 Apr 2025</div>
                                </div>
                                <span className="deadline-pill" style={{ background: '#fef9c3', color: '#a16207' }}>2 days</span>
                            </div>
                            <div className="deadline-banner" style={{ background: '#f8fafc' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}>
                                    <span className="material-symbols-outlined" style={{ color: '#475569' }}>event</span>
                                </div>
                                <div className="flex-fill">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Procurement Report</div>
                                    <div className="text-muted" style={{ fontSize: '.73rem' }}>Due 25 Apr 2025</div>
                                </div>
                                <span className="deadline-pill" style={{ background: '#e2e8f0', color: '#475569' }}>6 days</span>
                            </div>
                        </div>
                    </div>

                    {/* Latest feedback */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: '#059669' }}>rate_review</span>Latest Feedback</h5>
                            <Link href="/staff?pg=feedback" className="btn btn-sm btn-outline-secondary">All</Link>
                        </div>
                        <div className="p-3">
                            <div className="p-3 rounded mb-2" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Budget Estimate</div>
                                    <span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★★ 5/5</span>
                                </div>
                                <p style={{ fontSize: '.78rem', color: '#166534', margin: '0' }}>Excellent work. Very thorough cost analysis — no revisions needed.</p>
                                <div className="text-muted mt-1" style={{ fontSize: '.7rem' }}>From: Dr. A. Ssekandi · 08 Apr</div>
                            </div>
                            <div className="p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Lab Setup Report</div>
                                    <span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Under Review</span>
                                </div>
                                <p style={{ fontSize: '.78rem', color: '#64748b', margin: '0', fontStyle: 'italic' }}>Awaiting HOD review...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
