'use client';
import React from 'react';

export default function UnitEvaluations() {
    return (
        <div id="page-evaluations" className="page-section active-page">
            {/* Pending Evaluation Card (prominent) */}
            <div className="table-card mb-4" style={{ borderTop: '4px solid var(--mubs-yellow)' }}>
                <div className="table-card-header" style={{ background: '#fffbeb' }}>
                    <h5>
                        <span className="material-symbols-outlined me-2" style={{ color: '#b45309' }}>pending_actions</span>
                        Pending Evaluations <span className="badge ms-2" style={{ background: 'var(--mubs-yellow)', color: '#1e293b' }}>2 to review</span>
                    </h5>
                </div>
                <div className="p-0">
                    {/* Eval 1 */}
                    <div className="p-4" style={{ borderBottom: '1px solid #f1f5f9' }} id="evalCard1">
                        <div className="d-flex align-items-start gap-3 flex-wrap">
                            <div className="staff-avatar" style={{ background: '#7c3aed', width: '44px', height: '44px', fontSize: '.9rem', borderRadius: '10px' }}>JA</div>
                            <div className="flex-fill">
                                <div className="d-flex align-items-center gap-3 flex-wrap mb-1">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.95rem' }}>J. Amuge — Lab Setup Report (Phase 1)</div>
                                    <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.62rem' }}>Pending Review</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: '.78rem' }}>Activity: Digital Learning Infrastructure · Submitted: Today, 08:42</div>
                                <div className="mt-3 p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>Report Summary</div>
                                    <p style={{ fontSize: '.8rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>Lab A and B power outlets have been installed. 12 of 20 network ports are live. Procurement of switches is pending Finance clearance. Projector mounting in Lab C is 80% done — awaiting final hardware delivery expected 19 Apr.</p>
                                </div>
                                <div className="mt-3 d-flex align-items-center gap-4 flex-wrap">
                                    <div>
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '.8rem' }}>Score <span className="text-muted fw-normal">(1–5)</span></div>
                                        <div className="d-flex gap-1" id="stars1">
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                        </div>
                                        <div className="text-muted" id="scoreLabel1" style={{ fontSize: '.72rem', marginTop: '3px' }}>Click to rate</div>
                                    </div>
                                    <div className="flex-fill">
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '.8rem' }}>Comments</div>
                                        <textarea className="form-control form-control-sm" rows={2} placeholder="Add feedback or instructions for improvement..."></textarea>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    <button className="btn btn-sm fw-bold text-white" style={{ background: 'var(--mubs-blue)' }}>
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>check_circle</span>Submit Evaluation
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger fw-bold">
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>reply</span>Return for Revision
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eval 2 */}
                    <div className="p-4" id="evalCard2">
                        <div className="d-flex align-items-start gap-3 flex-wrap">
                            <div className="staff-avatar" style={{ background: '#b45309', width: '44px', height: '44px', fontSize: '.9rem', borderRadius: '10px' }}>MO</div>
                            <div className="flex-fill">
                                <div className="d-flex align-items-center gap-3 flex-wrap mb-1">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.95rem' }}>M. Ogen — Industry Contacts Register</div>
                                    <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.62rem' }}>Pending Review</span>
                                </div>
                                <div className="text-muted" style={{ fontSize: '.78rem' }}>Activity: Industry Attachment Programme · Submitted: 14 Apr, 14:10</div>
                                <div className="mt-3 p-3 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>Report Summary</div>
                                    <p style={{ fontSize: '.8rem', color: '#475569', margin: 0, lineHeight: 1.6 }}>A register of 38 industry contacts has been compiled across 5 sectors including ICT, Finance, and Telecoms. 12 of these have confirmed readiness to accept student attachees for the July–August period. Formal MoUs are yet to be drafted for 8 of the confirmed contacts.</p>
                                </div>
                                <div className="mt-3 d-flex align-items-center gap-4 flex-wrap">
                                    <div>
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '.8rem' }}>Score <span className="text-muted fw-normal">(1–5)</span></div>
                                        <div className="d-flex gap-1" id="stars2">
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                            <button className="star-btn">★</button>
                                        </div>
                                        <div className="text-muted" id="scoreLabel2" style={{ fontSize: '.72rem', marginTop: '3px' }}>Click to rate</div>
                                    </div>
                                    <div className="flex-fill">
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '.8rem' }}>Comments</div>
                                        <textarea className="form-control form-control-sm" rows={2} placeholder="Add feedback or instructions for improvement..."></textarea>
                                    </div>
                                </div>
                                <div className="d-flex gap-2 mt-3 flex-wrap">
                                    <button className="btn btn-sm fw-bold text-white" style={{ background: 'var(--mubs-blue)' }}>
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>check_circle</span>Submit Evaluation
                                    </button>
                                    <button className="btn btn-sm btn-outline-danger fw-bold">
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>reply</span>Return for Revision
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completed evaluations */}
            <div className="table-card">
                <div className="table-card-header">
                    <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history_edu</span>Completed Evaluations</h5>
                    <div className="d-flex gap-2">
                        <select className="form-select form-select-sm" style={{ width: '130px' }} defaultValue="All Staff"><option>All Staff</option><option>J. Amuge</option><option>P. Kato</option></select>
                        <button className="btn btn-sm btn-success fw-bold">
                            <span className="material-symbols-outlined me-1" style={{ fontSize: '15px' }}>download</span>Export
                        </button>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead><tr><th>Staff</th><th>Report / Task</th><th>Date Evaluated</th><th>Score</th><th>Outcome</th><th>Actions</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#059669' }}>PK</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>P. Kato</span></div></td>
                                <td style={{ fontSize: '.83rem' }}>Curriculum Draft — CS302</td>
                                <td style={{ fontSize: '.8rem', color: '#64748b' }}>Yesterday, 15:10</td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '.75rem' }}>★★★★ 4/5</span></td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Accepted</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#b45309' }}>CO</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>C. Opio</span></div></td>
                                <td style={{ fontSize: '.83rem' }}>Budget Estimate Draft</td>
                                <td style={{ fontSize: '.8rem', color: '#64748b' }}>10 Apr, 16:42</td>
                                <td><span className="score-badge" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.75rem' }}>★★ 2/5</span></td>
                                <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Returned</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#b45309' }}>MO</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>M. Ogen</span></div></td>
                                <td style={{ fontSize: '.83rem' }}>Site Survey — All Labs</td>
                                <td style={{ fontSize: '.8rem', color: '#64748b' }}>10 Apr, 11:00</td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '.75rem' }}>★★★★ 4/5</span></td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Accepted</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                            <tr>
                                <td><div className="d-flex align-items-center gap-2"><div className="staff-avatar" style={{ background: '#7c3aed' }}>JA</div><span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>J. Amuge</span></div></td>
                                <td style={{ fontSize: '.83rem' }}>Budget Estimate (Infra.)</td>
                                <td style={{ fontSize: '.8rem', color: '#64748b' }}>08 Apr, 14:00</td>
                                <td><span className="score-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '.75rem' }}>★★★★★ 5/5</span></td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Accepted</span></td>
                                <td><button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.74rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span> View</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table-card-footer">
                    <span className="footer-label">4 evaluations completed this period</span>
                    <div className="d-flex gap-1">
                        <button className="page-btn" disabled>‹</button>
                        <button className="page-btn active">1</button>
                        <button className="page-btn">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
