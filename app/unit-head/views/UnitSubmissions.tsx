'use client';
import React from 'react';

export default function UnitSubmissions() {
    return (
        <div id="page-submissions" className="page-section active-page">
            <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-yellow)', padding: '1rem' }}><div className="stat-value" style={{ fontSize: '1.8rem', color: '#b45309' }}>6</div><div className="stat-label">Pending</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-blue)', padding: '1rem' }}><div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--mubs-blue)' }}>2</div><div className="stat-label">Under Review</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: '#10b981', padding: '1rem' }}><div className="stat-value" style={{ fontSize: '1.8rem', color: '#059669' }}>14</div><div className="stat-label">Reviewed</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-red)', padding: '1rem' }}><div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--mubs-red)' }}>1</div><div className="stat-label">Returned</div></div></div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>inbox</span>All Submissions</h5>
                            <div className="d-flex gap-2 flex-wrap">
                                <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Status"><option>All Status</option><option>Pending Review</option><option>Under Review</option><option>Reviewed</option><option>Returned</option></select>
                                <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Staff"><option>All Staff</option><option>J. Amuge</option><option>P. Kato</option><option>M. Ogen</option><option>C. Opio</option></select>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead><tr><th>Staff</th><th>Report / Task</th><th>Activity</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead>
                                <tbody>
                                    <tr>
                                        <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#7c3aed' }}>JA</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>J. Amuge</span></div></td>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Lab Setup — Phase 1 Report</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Today, 08:42</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending</span></td>
                                        <td><button className="btn btn-xs py-0 px-2 fw-bold text-white border-0" style={{ fontSize: '.74rem', background: 'var(--mubs-blue)' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>rate_review</span> Evaluate</button></td>
                                    </tr>
                                    <tr>
                                        <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#b45309' }}>MO</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>M. Ogen</span></div></td>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Industry Contacts Register</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Industry Attachment</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>14 Apr, 14:10</td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending</span></td>
                                        <td><button className="btn btn-xs py-0 px-2 fw-bold text-white border-0" style={{ fontSize: '.74rem', background: 'var(--mubs-blue)' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>rate_review</span> Evaluate</button></td>
                                    </tr>
                                    <tr>
                                        <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#059669' }}>PK</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>P. Kato</span></div></td>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Wiring Diagram — Lab B &amp; C</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>14 Apr, 09:00</td>
                                        <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Under Review</span></td>
                                        <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                                    </tr>
                                    <tr>
                                        <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#059669' }}>PK</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>P. Kato</span></div></td>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Curriculum Draft — CS302</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>SW Dev Curriculum</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>12 Apr, 11:30</td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Reviewed</span></td>
                                        <td><div className="d-flex gap-1"><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★ 4/5</span></div></td>
                                    </tr>
                                    <tr>
                                        <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#b45309' }}>CO</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>C. Opio</span></div></td>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Budget Estimate Draft</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>Computer Lab Upgrade</td>
                                        <td style={{ fontSize: '.78rem', color: '#64748b' }}>10 Apr, 16:00</td>
                                        <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Returned</span></td>
                                        <td><div className="d-flex gap-1"><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button><span className="score-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>↩ Returned</span></div></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-card-footer">
                            <span className="footer-label">Showing 5 of 23 submissions</span>
                            <div className="d-flex gap-1">
                                <button className="page-btn" disabled>‹</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">›</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submission timeline */}
                <div className="col-12 col-lg-4">
                    <div className="table-card">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history</span>Recent Activity</h5></div>
                        <div className="p-4">
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: '#fef9c3' }}><span className="material-symbols-outlined" style={{ color: '#b45309' }}>inbox</span></div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Lab Setup Report submitted by J. Amuge</div>
                                <div className="text-muted" style={{ fontSize: '.73rem' }}>Today, 08:42</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: '#dcfce7' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span></div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Curriculum Draft reviewed · Score: 4/5</div>
                                <div className="text-muted" style={{ fontSize: '.73rem' }}>Yesterday, 15:10 · Reviewed by you</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: '#fff1f2' }}><span className="material-symbols-outlined" style={{ color: '#e31837' }}>reply</span></div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Budget Estimate returned to C. Opio for revision</div>
                                <div className="text-muted" style={{ fontSize: '.73rem' }}>10 Apr, 16:42</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: '#eff6ff' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>inbox</span></div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Wiring Diagram submitted by P. Kato</div>
                                <div className="text-muted" style={{ fontSize: '.73rem' }}>14 Apr, 09:00</div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: '#dcfce7' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span></div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Site Survey reviewed · Score: 4/5</div>
                                <div className="text-muted" style={{ fontSize: '.73rem' }}>10 Apr, 11:00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
