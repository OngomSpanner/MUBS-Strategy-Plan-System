"use client";

import React from 'react';

export default function StaffDeadlines() {
    return (
        <div className="content-area w-100">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>schedule</span>All Deadlines</h5>
                            <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Tasks">
                                <option value="All Tasks">All Tasks</option>
                                <option value="Overdue">Overdue</option>
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                            </select>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead><tr><th>Task</th><th>Activity</th><th>Due Date</th><th>Status</th><th>Days Left</th></tr></thead>
                                <tbody>
                                    <tr style={{ background: '#fff1f2' }}>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Write Tender for Computers</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Computer Lab Upgrade</td>
                                        <td style={{ fontSize: '.82rem', fontWeight: '700', color: 'var(--mubs-red)' }}>15 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Overdue</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#fee2e2', color: '#b91c1c' }}>5d late</span></td>
                                    </tr>
                                    <tr style={{ background: '#fffbeb' }}>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Configure LAN Switches</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.82rem', fontWeight: '700', color: '#b45309' }}>21 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#fef9c3', color: '#a16207' }}>2 days</span></td>
                                    </tr>
                                    <tr>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Procure Network Switches</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.82rem' }}>20 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Not Started</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#e2e8f0', color: '#475569' }}>1 day</span></td>
                                    </tr>
                                    <tr>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Draft Lab Safety Guidelines</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.82rem' }}>22 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Not Started</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#e2e8f0', color: '#475569' }}>3 days</span></td>
                                    </tr>
                                    <tr>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Inventory Checklist</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.82rem' }}>25 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Not Started</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#e2e8f0', color: '#475569' }}>6 days</span></td>
                                    </tr>
                                    <tr>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Industry Contacts Register</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Industry Attachment</td>
                                        <td style={{ fontSize: '.82rem' }}>30 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#e2e8f0', color: '#475569' }}>11 days</span></td>
                                    </tr>
                                    <tr style={{ background: '#f0fdf4' }}>
                                        <td><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Prepare Budget Estimate</div></td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.82rem', color: '#059669' }}>08 Apr 2025</td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Completed</span></td>
                                        <td><span className="deadline-pill" style={{ background: '#dcfce7', color: '#15803d' }}>Done</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Deadline summary */}
                <div className="col-12 col-lg-4">
                    <div className="table-card">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>insights</span>Deadline Summary</h5></div>
                        <div className="p-4">
                            <div className="text-center mb-4">
                                <div className="perf-ring mb-2">
                                    <svg width="110" height="110" viewBox="0 0 110 110">
                                        <circle cx="55" cy="55" r="47" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                        <circle cx="55" cy="55" r="47" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="295" strokeDashoffset="73" strokeLinecap="round" />
                                    </svg>
                                    <div className="perf-ring-label" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a' }}>75%</div>
                                        <div style={{ fontSize: '.65rem', color: '#64748b', fontWeight: '700' }}>On Time</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '.8rem', color: '#64748b' }}>3 of 4 active tasks on track</div>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: '#fff1f2' }}>
                                    <span style={{ fontSize: '.82rem', fontWeight: '700', color: '#b91c1c' }}>Overdue</span>
                                    <span className="fw-black" style={{ color: 'var(--mubs-red)' }}>1</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: '#fffbeb' }}>
                                    <span style={{ fontSize: '.82rem', fontWeight: '700', color: '#a16207' }}>Due This Week</span>
                                    <span className="fw-black" style={{ color: '#b45309' }}>3</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: '#f8fafc' }}>
                                    <span style={{ fontSize: '.82rem', fontWeight: '700', color: '#475569' }}>Later This Month</span>
                                    <span className="fw-black" style={{ color: '#475569' }}>2</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ background: '#f0fdf4' }}>
                                    <span style={{ fontSize: '.82rem', fontWeight: '700', color: '#15803d' }}>Completed</span>
                                    <span className="fw-black" style={{ color: '#059669' }}>4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
