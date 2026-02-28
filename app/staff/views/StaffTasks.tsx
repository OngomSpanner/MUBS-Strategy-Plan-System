"use client";

import React from 'react';
import Link from 'next/link';

export default function StaffTasks() {
    return (
        <div className="content-area w-100">
            <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-blue)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem' }}>9</div><div className="stat-label">Assigned</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-red)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: 'var(--mubs-red)' }}>1</div><div className="stat-label">Overdue</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-yellow)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: '#b45309' }}>4</div><div className="stat-label">In Progress</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: '#10b981', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: '#059669' }}>4</div><div className="stat-label">Completed</div></div></div>
            </div>

            <div className="d-flex gap-2 mb-3 flex-wrap">
                <select className="form-select form-select-sm" style={{ width: '160px', background: '#fff' }} defaultValue="All Tasks">
                    <option value="All Tasks">All Tasks</option>
                    <option value="Overdue">Overdue</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Completed">Completed</option>
                </select>
                <select className="form-select form-select-sm" style={{ width: '210px', background: '#fff' }} defaultValue="All Activities">
                    <option value="All Activities">All Activities</option>
                    <option value="Digital Learning Infra.">Digital Learning Infra.</option>
                    <option value="SW Dev Curriculum">SW Dev Curriculum</option>
                    <option value="Computer Lab Upgrade">Computer Lab Upgrade</option>
                </select>
            </div>

            {/* Overdue */}
            <div className="fw-black text-white mb-2" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>⚠ Overdue</div>
            <div className="task-row overdue mb-4">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon"><span className="material-symbols-outlined">description</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Write Tender for Computers</div>
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Overdue — 5 days</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '.77rem' }}>Activity: Computer Lab Upgrade — Phase 2 · Assigned by Dr. A. Ssekandi</div>
                        <div className="text-muted" style={{ fontSize: '.77rem', marginTop: '2px' }}>Due: <strong style={{ color: 'var(--mubs-red)' }}>15 Apr 2025</strong></div>
                        <div className="mt-2 mb-1"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '25%', background: 'var(--mubs-red)' }}></div></div></div>
                        <div className="p-2 rounded mt-2" style={{ background: '#fff1f2', borderLeft: '3px solid var(--mubs-red)', fontSize: '.77rem', color: '#7f1d1d' }}>
                            <strong>Instructions:</strong> Prepare a tender document for procurement of 40 desktop computers per lab specifications sheet shared via email.
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <Link href="/staff?pg=submit" className="btn btn-sm fw-bold text-white d-flex align-items-center justify-content-center" style={{ background: 'var(--mubs-blue)' }}><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>upload_file</span>Submit Now</Link>
                        <button className="btn btn-sm btn-outline-secondary fw-bold d-flex align-items-center justify-content-center" onClick={() => alert('Toast: Reminder sent')}><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>chat</span>Message HOD</button>
                    </div>
                </div>
            </div>

            {/* In Progress */}
            <div className="fw-black text-white mb-2" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>In Progress</div>

            <div className="task-row mb-3">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon"><span className="material-symbols-outlined">settings_ethernet</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Configure LAN Switches</div>
                            <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '.77rem' }}>Activity: Digital Learning Infrastructure · Due 21 Apr 2025</div>
                        <div className="mt-2 mb-1"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '40%', background: 'var(--mubs-yellow)' }}></div></div></div>
                        <div className="p-2 rounded mt-2" style={{ background: '#f8fafc', borderLeft: '3px solid #e2e8f0', fontSize: '.77rem', color: '#475569' }}>
                            <strong>Instructions:</strong> Configure all network switches in Lab A and B. Test connectivity. Document IP assignments.
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <Link href="/staff?pg=submit" className="btn btn-sm btn-outline-primary fw-bold d-flex align-items-center justify-content-center"><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>upload_file</span>Update</Link>
                    </div>
                </div>
            </div>

            <div className="task-row mb-3">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon"><span className="material-symbols-outlined">shopping_cart</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Procure Network Switches (x4)</div>
                            <span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Not Started</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '.77rem' }}>Activity: Digital Learning Infrastructure · Due 20 Apr 2025</div>
                        <div className="mt-2 mb-1"><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '0%', background: '#94a3b8' }}></div></div></div>
                        <div className="p-2 rounded mt-2" style={{ background: '#f8fafc', borderLeft: '3px solid #e2e8f0', fontSize: '.77rem', color: '#475569' }}>
                            <strong>Instructions:</strong> Purchase 4 managed PoE switches from approved vendor list. Attach LPO receipt as evidence.
                        </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <Link href="/staff?pg=submit" className="btn btn-sm btn-outline-primary fw-bold d-flex align-items-center justify-content-center"><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>upload_file</span>Submit</Link>
                    </div>
                </div>
            </div>

            {/* Submitted/Under Review */}
            <div className="fw-black text-white mb-2 mt-3" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>Submitted — Under Review</div>
            <div className="task-row pending-review mb-4">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon"><span className="material-symbols-outlined">inbox</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Lab Setup Report — Phase 1</div>
                            <span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Submitted · Under Review</span>
                        </div>
                        <div className="text-muted" style={{ fontSize: '.77rem' }}>Digital Learning Infrastructure · Submitted Today, 08:42</div>
                    </div>
                    <Link href="/staff?pg=submissions" className="btn btn-sm btn-outline-secondary fw-bold d-flex align-items-center justify-content-center"><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>visibility</span>View</Link>
                </div>
            </div>

            {/* Completed */}
            <div className="fw-black text-white mb-2" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>Completed</div>
            <div className="row g-3">
                <div className="col-12 col-md-6">
                    <div className="task-row completed mb-0 pt-3 pb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="activity-icon" style={{ background: 'transparent', border: 'none' }}><span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '28px' }}>check_circle</span></div>
                            <div className="flex-fill">
                                <div className="fw-bold text-dark" style={{ fontSize: '.88rem' }}>Prepare Budget Estimate</div>
                                <div className="text-muted" style={{ fontSize: '.75rem' }}>Completed 08 Apr · Score: 5/5</div>
                            </div>
                            <span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★★ 5</span>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="task-row completed mb-0 pt-3 pb-3">
                        <div className="d-flex align-items-center gap-3">
                            <div className="activity-icon" style={{ background: 'transparent', border: 'none' }}><span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '28px' }}>check_circle</span></div>
                            <div className="flex-fill">
                                <div className="fw-bold text-dark" style={{ fontSize: '.88rem' }}>Obtain Principal Approval</div>
                                <div className="text-muted" style={{ fontSize: '.75rem' }}>Completed 05 Apr · Score: 4/5</div>
                            </div>
                            <span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★ 4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
