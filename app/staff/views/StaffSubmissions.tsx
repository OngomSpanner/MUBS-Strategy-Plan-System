"use client";

import React from 'react';

export default function StaffSubmissions() {
    return (
        <div className="content-area w-100">
            <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-blue)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem' }}>6</div><div className="stat-label">Total Submitted</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-yellow)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: '#b45309' }}>2</div><div className="stat-label">Under Review</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: '#10b981', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: '#059669' }}>3</div><div className="stat-label">Reviewed & Scored</div></div></div>
                <div className="col-6 col-sm-3"><div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-red)', padding: '.9rem' }}><div className="stat-value" style={{ fontSize: '1.7rem', color: 'var(--mubs-red)' }}>1</div><div className="stat-label">Returned</div></div></div>
            </div>

            <div className="table-card">
                <div className="table-card-header">
                    <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history</span>Submission History</h5>
                    <div className="d-flex gap-2 flex-wrap">
                        <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Status">
                            <option value="All Status">All Status</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Returned">Returned</option>
                        </select>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Toast: Export started.')}><span className="material-symbols-outlined me-1" style={{ fontSize: '15px' }}>download</span>Export</button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead><tr><th>Report / Task</th><th>Activity</th><th>Type</th><th>Submitted</th><th>Status</th><th>Score</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Lab Setup Report — Phase 1</td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Completion</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Today, 08:42</td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Under Review</span></td>
                                <td><span className="text-muted" style={{ fontSize: '.78rem' }}>—</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr style={{ background: '#fffbeb' }}>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Industry Contacts Register</td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Industry Attachment</td>
                                <td><span className="status-badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '.62rem' }}>Progress</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>14 Apr, 14:10</td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Under Review</span></td>
                                <td><span className="text-muted" style={{ fontSize: '.78rem' }}>—</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Budget Estimate</td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Completion</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>08 Apr, 14:00</td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Reviewed</span></td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★★ 5/5</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Obtain Principal Approval</td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                <td><span className="status-badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '.62rem' }}>Completion</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>05 Apr, 10:00</td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Reviewed</span></td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★ 4/5</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Site Survey — All Labs</td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Digital Learning Infra.</td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Completion</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>03 Apr, 11:20</td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Reviewed</span></td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d' }}>★★★★ 4/5</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr style={{ background: '#fff1f2' }}>
                                <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Budget Draft v1 <span style={{ fontSize: '.7rem', color: '#b91c1c' }}>(Returned)</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>Computer Lab Upgrade</td>
                                <td><span className="status-badge" style={{ background: '#fff1f2', color: '#b91c1c', fontSize: '.62rem' }}>Draft</span></td>
                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>01 Apr, 16:00</td>
                                <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Returned</span></td>
                                <td><span className="score-badge" style={{ background: '#fef9c3', color: '#a16207' }}>★★ 2/5</span></td>
                                <td>
                                    <div className="d-flex gap-1">
                                        <button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }} onClick={() => alert('Modal: View Submission')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button>
                                        <button className="btn btn-xs py-0 px-2 fw-bold text-white" style={{ fontSize: '.74rem', background: 'var(--mubs-blue)' }} onClick={() => alert('Routing back to Submit')}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>edit</span> Resubmit</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
