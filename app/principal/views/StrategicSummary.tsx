'use client';
import React, { useState } from 'react';

export default function StrategicSummary() {
    const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

    const toggleUnit = (index: number) => {
        setExpandedUnit(expandedUnit === index ? null : index);
    };

    return (
        <div id="page-strategic" className="page-section active-page">
            <div className="alert alert-primary alert-strip alert-dismissible fade show mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--mubs-blue)' }}>info</span>
                <div>You are viewing a <strong>read-only</strong> snapshot of the institutional strategic plan. Click any unit row to drill down.</div>
                <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>

            {/* Summary stats */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-blue)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem' }}>148</div>
                        <div className="stat-label">Total Activities</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: '#10b981', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: '#059669' }}>96</div>
                        <div className="stat-label">On Track</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-yellow)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: '#b45309' }}>47</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-red)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--mubs-red)' }}>5</div>
                        <div className="stat-label">Delayed</div>
                    </div>
                </div>
            </div>

            {/* Drill-down by unit */}
            <div className="mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <h6 className="fw-bold text-white mb-0" style={{ fontSize: '1rem' }}><span className="material-symbols-outlined me-2" style={{ fontSize: '20px' }}>corporate_fare</span>Drill Down by Unit — Click to Expand</h6>
                <div className="d-flex gap-2">
                    <select className="form-select form-select-sm" style={{ width: '150px', background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff', fontSize: '.8rem' }}>
                        <option style={{ color: '#000' }}>All Pillars</option>
                        <option style={{ color: '#000' }}>Teaching &amp; Learning</option>
                        <option style={{ color: '#000' }}>Research</option>
                        <option style={{ color: '#000' }}>Governance</option>
                        <option style={{ color: '#000' }}>Infrastructure</option>
                    </select>
                    <select className="form-select form-select-sm" style={{ width: '130px', background: 'rgba(255,255,255,.12)', borderColor: 'rgba(255,255,255,.2)', color: '#fff', fontSize: '.8rem' }}>
                        <option style={{ color: '#000' }}>All Statuses</option>
                        <option style={{ color: '#000' }}>On Track</option>
                        <option style={{ color: '#000' }}>Delayed</option>
                    </select>
                </div>
            </div>

            {/* Unit rows */}
            <div id="unitAccordion">

                {/* Unit 1 */}
                <div className={`unit-drill-row ${expandedUnit === 1 ? 'expanded' : ''}`} onClick={() => toggleUnit(1)}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>laptop</span>
                            </div>
                            <div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Faculty of Computing</div>
                                <div className="text-muted" style={{ fontSize: '.75rem' }}>24 activities · Dr. A. Ssekandi (Head)</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="text-center">
                                <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>82%</div>
                                <div style={{ fontSize: '.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Progress</div>
                            </div>
                            <div className="text-center">
                                <span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Excellent</span>
                            </div>
                            <span className="material-symbols-outlined text-muted drill-arrow" style={{ fontSize: '20px' }}>
                                {expandedUnit === 1 ? 'expand_less' : 'expand_more'}
                            </span>
                        </div>
                    </div>
                    <div className="unit-drill-detail">
                        <div className="row g-3">
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>18</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>6</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>0</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Delayed</div></div></div>
                        </div>
                        <div className="mt-3">
                            <div className="fw-bold text-dark mb-2" style={{ fontSize: '.83rem' }}>Recent Activities</div>
                            <div className="d-flex align-items-center gap-2 mb-2"><div className="activity-icon"><span className="material-symbols-outlined">laptop</span></div><div><div style={{ fontSize: '.83rem', fontWeight: 600, color: '#0f172a' }}>Digital Learning Infrastructure</div><div style={{ fontSize: '.72rem', color: '#64748b' }}>78% complete · On Track</div></div><div className="ms-auto"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '78%', background: '#10b981' }}></div></div></div></div>
                            <div className="d-flex align-items-center gap-2"><div className="activity-icon"><span className="material-symbols-outlined">code</span></div><div><div style={{ fontSize: '.83rem', fontWeight: 600, color: '#0f172a' }}>Software Dev Curriculum Update</div><div style={{ fontSize: '.72rem', color: '#64748b' }}>95% complete · On Track</div></div><div className="ms-auto"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '95%', background: '#10b981' }}></div></div></div></div>
                        </div>
                    </div>
                </div>

                {/* Unit 2 */}
                <div className={`unit-drill-row ${expandedUnit === 2 ? 'expanded' : ''}`} onClick={() => toggleUnit(2)}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: '#9333ea' }}>business</span>
                            </div>
                            <div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Faculty of Commerce</div>
                                <div className="text-muted" style={{ fontSize: '.75rem' }}>18 activities · Prof. J. Batte (Head)</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="text-center"><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>74%</div><div style={{ fontSize: '.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Progress</div></div>
                            <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Good</span>
                            <span className="material-symbols-outlined text-muted drill-arrow" style={{ fontSize: '20px' }}>
                                {expandedUnit === 2 ? 'expand_less' : 'expand_more'}
                            </span>
                        </div>
                    </div>
                    <div className="unit-drill-detail">
                        <div className="row g-3">
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>12</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>5</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-warning" style={{ fontSize: '1.1rem' }}>1</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Delayed</div></div></div>
                        </div>
                        <div className="mt-3">
                            <div className="fw-bold text-dark mb-2" style={{ fontSize: '.83rem' }}>Problem Area</div>
                            <div className="d-flex align-items-start gap-2 p-2 rounded" style={{ background: '#fff7ed', borderLeft: '3px solid #fb923c' }}>
                                <span className="material-symbols-outlined mt-1" style={{ fontSize: '16px', color: '#ea580c' }}>warning</span>
                                <div style={{ fontSize: '.8rem', color: '#431407' }}><strong>Annual Industry Linkage Forum</strong> — Pending committee approval since 10 Apr. Budget: UGX 18M. Proposer: Ms. Tukahirwa.</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unit 3 (Critical) */}
                <div className={`unit-drill-row ${expandedUnit === 3 ? 'expanded' : ''}`} onClick={() => toggleUnit(3)}>
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-3">
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>account_balance</span>
                            </div>
                            <div>
                                <div className="fw-bold text-dark" style={{ fontSize: '.92rem' }}>Finance &amp; Administration</div>
                                <div className="text-muted" style={{ fontSize: '.75rem' }}>20 activities · P. Okello (Head)</div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-4 flex-wrap">
                            <div className="text-center"><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>41%</div><div style={{ fontSize: '.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Progress</div></div>
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Critical ⚠</span>
                            <span className="material-symbols-outlined text-muted drill-arrow" style={{ fontSize: '20px' }}>
                                {expandedUnit === 3 ? 'expand_less' : 'expand_more'}
                            </span>
                        </div>
                    </div>
                    <div className="unit-drill-detail">
                        <div className="row g-3">
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>7</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Completed</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>11</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</div></div></div>
                            <div className="col-sm-4"><div className="p-3 rounded text-center" style={{ background: '#f8fafc' }}><div className="fw-bold text-danger" style={{ fontSize: '1.1rem' }}>2</div><div className="text-muted" style={{ fontSize: '.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Delayed</div></div></div>
                        </div>
                        <div className="mt-3 d-flex gap-2 flex-wrap">
                            <div className="d-flex align-items-start gap-2 p-2 rounded flex-fill" style={{ background: '#fff1f2', borderLeft: '3px solid #e31837', minWidth: '200px' }}>
                                <span className="material-symbols-outlined mt-1" style={{ fontSize: '16px', color: '#e31837' }}>error</span>
                                <div style={{ fontSize: '.78rem', color: '#450a0a' }}><strong>Audit Compliance Q1</strong> — Overdue by 8 days. Escalated to Admin.</div>
                            </div>
                            <div className="d-flex align-items-start gap-2 p-2 rounded flex-fill" style={{ background: '#fff1f2', borderLeft: '3px solid #e31837', minWidth: '200px' }}>
                                <span className="material-symbols-outlined mt-1" style={{ fontSize: '16px', color: '#e31837' }}>error</span>
                                <div style={{ fontSize: '.78rem', color: '#450a0a' }}><strong>Budget Reconciliation Report</strong> — 3 days overdue. Finance Officer notified.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
