"use client";

import React from 'react';

export default function StaffFeedback() {
    return (
        <div className="content-area w-100">
            {/* Performance summary banner */}
            <div className="p-4 mb-4 rounded-3" style={{ background: 'linear-gradient(135deg,#0f172a,var(--mubs-navy))', border: '1px solid rgba(255,255,255,.1)' }}>
                <div className="row align-items-center g-3">
                    <div className="col-12 col-md-6">
                        <div className="text-white-50 fw-bold" style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>My Overall Score</div>
                        <div className="d-flex align-items-end gap-3 mt-1">
                            <div className="fw-black text-white" style={{ fontSize: '3.5rem', lineHeight: '1' }}>4.2</div>
                            <div>
                                <div className="star-display" style={{ color: 'var(--mubs-yellow)', fontSize: '1.3rem', letterSpacing: '2px' }}>★★★★<span className="star-empty" style={{ color: '#e2e8f0' }}>★</span></div>
                                <div className="text-white-50" style={{ fontSize: '.78rem' }}>Good Performance</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="row g-3 text-center">
                            <div className="col-4">
                                <div className="fw-black text-white" style={{ fontSize: '1.5rem' }}>3</div>
                                <div className="text-white-50" style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Evaluations</div>
                            </div>
                            <div className="col-4">
                                <div className="fw-black" style={{ fontSize: '1.5rem', color: 'var(--mubs-yellow)' }}>72%</div>
                                <div className="text-white-50" style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Completion</div>
                            </div>
                            <div className="col-4">
                                <div className="fw-black text-white" style={{ fontSize: '1.5rem' }}>1</div>
                                <div className="text-white-50" style={{ fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Returned</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    {/* New feedback highlight */}
                    <div className="feedback-card" style={{ border: '2px solid #bbf7d0', background: '#f0fdf4' }}>
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="material-symbols-outlined" style={{ color: '#059669' }}>new_releases</span>
                            <span className="fw-black text-dark" style={{ fontSize: '.88rem' }}>New Feedback</span>
                            <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d', fontSize: '.62rem' }}>Just Received</span>
                        </div>
                        <div className="d-flex gap-3 align-items-start flex-wrap">
                            <div className="score-ring" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '5px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: '#059669', flexShrink: '0' }}>5</div>
                            <div className="flex-fill">
                                <div className="fw-bold text-dark" style={{ fontSize: '.95rem' }}>Budget Estimate — Digital Learning Infrastructure</div>
                                <div className="star-display" style={{ fontSize: '1.2rem', margin: '.3rem 0', color: 'var(--mubs-yellow)', letterSpacing: '2px' }}>★★★★★</div>
                                <div className="p-3 rounded mt-2" style={{ background: '#dcfce7', borderLeft: '4px solid #10b981' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>HOD Comment</div>
                                    <p style={{ fontSize: '.85rem', color: '#14532d', margin: '0', lineHeight: '1.6' }}>"Excellent work. Very thorough cost analysis with well-itemised procurement sections. Unit pricing matches our approved vendor schedule. No revisions needed — proceed with submission to Finance."</p>
                                </div>
                                <div className="text-muted mt-2" style={{ fontSize: '.74rem' }}>From: Dr. A. Ssekandi (HOD, Faculty of Computing) · 08 Apr 2025, 03:10 PM</div>
                            </div>
                        </div>
                    </div>

                    {/* Past feedback cards */}
                    <div className="feedback-card">
                        <div className="d-flex gap-3 align-items-start flex-wrap">
                            <div className="score-ring" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '5px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--mubs-blue)', flexShrink: '0' }}>4</div>
                            <div className="flex-fill">
                                <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Obtain Principal Approval</div>
                                <div className="star-display" style={{ fontSize: '1.2rem', margin: '.3rem 0', color: 'var(--mubs-yellow)', letterSpacing: '2px' }}>★★★★<span className="star-empty" style={{ color: '#e2e8f0' }}>★</span></div>
                                <div className="p-3 rounded mt-2" style={{ background: '#eff6ff', borderLeft: '4px solid var(--mubs-blue)' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>HOD Comment</div>
                                    <p style={{ fontSize: '.85rem', color: '#1e3a5f', margin: '0', lineHeight: '1.6' }}>"Good work tracking down the approval. Would have been a 5 if the signed letter had been attached directly rather than linked. Please ensure physical documents are scanned and embedded in future submissions."</p>
                                </div>
                                <div className="text-muted mt-2" style={{ fontSize: '.74rem' }}>From: Dr. A. Ssekandi · 05 Apr 2025</div>
                            </div>
                        </div>
                    </div>

                    <div className="feedback-card">
                        <div className="d-flex gap-3 align-items-start flex-wrap">
                            <div className="score-ring" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '5px solid #93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--mubs-blue)', flexShrink: '0' }}>4</div>
                            <div className="flex-fill">
                                <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Site Survey — All Labs</div>
                                <div className="star-display" style={{ fontSize: '1.2rem', margin: '.3rem 0', color: 'var(--mubs-yellow)', letterSpacing: '2px' }}>★★★★<span className="star-empty" style={{ color: '#e2e8f0' }}>★</span></div>
                                <div className="p-3 rounded mt-2" style={{ background: '#eff6ff', borderLeft: '4px solid var(--mubs-blue)' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>HOD Comment</div>
                                    <p style={{ fontSize: '.85rem', color: '#1e3a5f', margin: '0', lineHeight: '1.6' }}>"Good coverage of all 4 labs. The photographs were very helpful. Note that the power outlet count for Lab C was off by 2 — please verify and update the register. Overall a solid submission."</p>
                                </div>
                                <div className="text-muted mt-2" style={{ fontSize: '.74rem' }}>From: Dr. A. Ssekandi · 03 Apr 2025</div>
                            </div>
                        </div>
                    </div>

                    {/* Returned card */}
                    <div className="feedback-card" style={{ border: '1px solid #fecaca' }}>
                        <div className="d-flex gap-3 align-items-start flex-wrap">
                            <div className="score-ring" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '5px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--mubs-red)', flexShrink: '0' }}>2</div>
                            <div className="flex-fill">
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                    <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Budget Draft v1 — Computer Lab Upgrade</div>
                                    <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '.62rem' }}>Returned for Revision</span>
                                </div>
                                <div style={{ fontSize: '1.2rem', color: '#fca5a5', margin: '.3rem 0', letterSpacing: '2px' }}>★★<span style={{ color: '#e2e8f0' }}>★★★</span></div>
                                <div className="p-3 rounded mt-2" style={{ background: '#fff1f2', borderLeft: '4px solid var(--mubs-red)' }}>
                                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>HOD Comment — Action Required</div>
                                    <p style={{ fontSize: '.85rem', color: '#7f1d1d', margin: '0', lineHeight: '1.6' }}>"The budget figures do not align with the Procurement department's approved price schedule for FY2024-25. Vendor quotes are also missing. Please revise with updated figures and resubmit with at least 3 vendor quotations attached."</p>
                                </div>
                                <div className="d-flex align-items-center gap-3 mt-2 flex-wrap">
                                    <div className="text-muted" style={{ fontSize: '.74rem' }}>From: Dr. A. Ssekandi · 01 Apr 2025</div>
                                    <button className="btn btn-sm btn-danger fw-bold py-0 px-3" style={{ fontSize: '.78rem' }} onClick={() => alert('Routing back to submit')}>
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '15px' }}>edit</span>Revise &amp; Resubmit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score summary panel */}
                <div className="col-12 col-lg-4">
                    <div className="table-card mb-4">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>bar_chart</span>Score Breakdown</h5></div>
                        <div className="p-4">
                            <div className="text-center mb-4">
                                <div className="perf-ring mb-2 position-relative d-inline-flex align-items-center justify-content-center">
                                    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="#005696" strokeWidth="12" strokeDasharray="314" strokeDashoffset="79" strokeLinecap="round" />
                                    </svg>
                                    <div className="perf-ring-label position-absolute text-center">
                                        <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0f172a' }}>4.2</div>
                                        <div style={{ fontSize: '.65rem', color: '#64748b', fontWeight: '700' }}>out of 5</div>
                                    </div>
                                </div>
                                <div className="star-display" style={{ fontSize: '1.4rem', color: 'var(--mubs-yellow)', letterSpacing: '2px' }}>★★★★<span className="star-empty" style={{ color: '#e2e8f0' }}>★</span></div>
                                <div className="fw-bold text-muted mt-1" style={{ fontSize: '.78rem' }}>Based on 3 evaluations</div>
                            </div>

                            <div className="d-flex flex-column gap-2">
                                <div><div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: '700' }}>Budget Estimate</span><span className="fw-black" style={{ color: '#059669' }}>5 / 5</span></div><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '100%', background: '#10b981' }}></div></div></div>
                                <div><div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: '700' }}>Principal Approval</span><span className="fw-black" style={{ color: 'var(--mubs-blue)' }}>4 / 5</span></div><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '80%', background: 'var(--mubs-blue)' }}></div></div></div>
                                <div><div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: '700' }}>Site Survey</span><span className="fw-black" style={{ color: 'var(--mubs-blue)' }}>4 / 5</span></div><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '80%', background: 'var(--mubs-blue)' }}></div></div></div>
                                <div><div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: '700' }}>Budget Draft v1</span><span className="fw-black" style={{ color: 'var(--mubs-red)' }}>2 / 5</span></div><div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '40%', background: 'var(--mubs-red)' }}></div></div></div>
                            </div>

                            <div className="mt-4 p-3 rounded" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }}>Tips to Improve</div>
                                <ul style={{ fontSize: '.76rem', color: '#713f12', margin: '0', paddingLeft: '1.2rem' }}>
                                    <li>Attach scanned physical documents, not just links</li>
                                    <li>Include at least 3 vendor quotations for budget reports</li>
                                    <li>Submit progress updates before deadline if work is ongoing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
