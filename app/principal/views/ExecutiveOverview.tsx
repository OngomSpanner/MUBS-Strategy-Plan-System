'use client';
import React from 'react';

export default function ExecutiveOverview() {
    return (
        <div id="page-overview" className="page-section active-page">
            {/* KPI Hero Banner */}
            <div className="kpi-hero mb-4">
                <div className="row align-items-center g-3">
                    <div className="col-12 col-md-auto text-center text-md-start">
                        <div className="kpi-hero-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>verified</span> Institutional Overview · FY 2024–25
                        </div>
                        <div className="d-flex align-items-end gap-3 flex-wrap justify-content-center justify-content-md-start">
                            <div>
                                <div className="kpi-hero-value">67<span style={{ fontSize: '2rem', color: '#93c5fd' }}>%</span></div>
                                <div className="kpi-hero-label">Overall Strategic Progress</div>
                            </div>
                            <div className="kpi-divider d-none d-sm-block"></div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>148</div>
                                <div className="kpi-hero-label">Total Activities</div>
                            </div>
                            <div className="kpi-divider d-none d-sm-block"></div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--mubs-yellow)' }}>73<span style={{ fontSize: '1.2rem' }}>%</span></div>
                                <div className="kpi-hero-label">Compliance Rate</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md ms-md-auto">
                        <div className="row g-3 text-white">
                            <div className="col-6 col-sm-3 col-md-6 col-lg-3 text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#4ade80' }}>96</div>
                                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '.08em' }}>On Track</div>
                            </div>
                            <div className="col-6 col-sm-3 col-md-6 col-lg-3 text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--mubs-yellow)' }}>47</div>
                                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#fde68a', textTransform: 'uppercase', letterSpacing: '.08em' }}>In Progress</div>
                            </div>
                            <div className="col-6 col-sm-3 col-md-6 col-lg-3 text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fca5a5' }}>5</div>
                                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '.08em' }}>Delayed</div>
                            </div>
                            <div className="col-6 col-sm-3 col-md-6 col-lg-3 text-center">
                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#c4b5fd' }}>14</div>
                                <div style={{ fontSize: '.68rem', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase', letterSpacing: '.08em' }}>Units</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#ecfdf5' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>verified_user</span></div>
                            <span className="stat-badge" style={{ background: '#ecfdf5', color: '#059669' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>trending_up</span> +4%</span>
                        </div>
                        <div className="stat-label">Compliance Rate</div>
                        <div className="stat-value">73%</div>
                        <div className="stat-sub">Target: 85% by Dec 2025</div>
                        <div className="gauge-bar mt-2"><div className="gauge-fill" style={{ width: '73%', background: '#10b981' }}></div></div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-red)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fff1f2' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>running_with_errors</span></div>
                            <span className="stat-badge" style={{ background: '#fff1f2', color: 'var(--mubs-red)' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>trending_up</span> +2</span>
                        </div>
                        <div className="stat-label">Delayed Activities</div>
                        <div className="stat-value">5</div>
                        <div className="stat-sub">Across 3 units · Escalated</div>
                        <div className="gauge-bar mt-2"><div className="gauge-fill" style={{ width: '33%', background: '#e31837' }}></div></div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-yellow)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#fffbeb' }}><span className="material-symbols-outlined" style={{ color: '#b45309' }}>crisis_alert</span></div>
                            <span className="stat-badge" style={{ background: '#fffbeb', color: '#b45309' }}>Open</span>
                        </div>
                        <div className="stat-label">Risk Alerts</div>
                        <div className="stat-value">7</div>
                        <div className="stat-sub">2 Critical · 5 Watchlist</div>
                        <div className="gauge-bar mt-2"><div className="gauge-fill" style={{ width: '50%', background: '#ffcd00' }}></div></div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-blue)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="stat-icon" style={{ background: '#eff6ff' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>groups</span></div>
                            <span className="stat-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Staff</span>
                        </div>
                        <div className="stat-label">Active Staff</div>
                        <div className="stat-value">86</div>
                        <div className="stat-sub">Across 14 academic units</div>
                        <div className="gauge-bar mt-2"><div className="gauge-fill" style={{ width: '86%', background: 'var(--mubs-blue)' }}></div></div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Risk Alerts Panel */}
                <div className="col-12 col-lg-5">
                    <div className="table-card h-100">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>crisis_alert</span>Active Risk Alerts</h5>
                            <span className="badge" style={{ background: 'var(--mubs-red)', fontSize: '.72rem' }}>7 Open</span>
                        </div>
                        <div className="p-3">
                            {/* Critical */}
                            <div className="risk-item" style={{ background: '#fff1f2', borderLeft: '4px solid #e31837' }}>
                                <div className="risk-dot" style={{ background: '#e31837' }}></div>
                                <div>
                                    <div className="risk-title">Research Modernisation — Critically Overdue</div>
                                    <div className="risk-meta">Research &amp; Innovation · 14 days past deadline · 22% complete</div>
                                    <span className="status-badge mt-1" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '.62rem' }}>Critical</span>
                                </div>
                            </div>
                            <div className="risk-item" style={{ background: '#fff1f2', borderLeft: '4px solid #e31837' }}>
                                <div className="risk-dot" style={{ background: '#e31837' }}></div>
                                <div>
                                    <div className="risk-title">Finance &amp; Admin — Compliance Below Threshold</div>
                                    <div className="risk-meta">41% compliance · Target is 75% · 2 delayed activities</div>
                                    <span className="status-badge mt-1" style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '.62rem' }}>Critical</span>
                                </div>
                            </div>
                            {/* Watchlist */}
                            <div className="risk-item" style={{ background: '#fffbeb', borderLeft: '4px solid #ffcd00' }}>
                                <div className="risk-dot" style={{ background: '#ffcd00' }}></div>
                                <div>
                                    <div className="risk-title">School of Grad Studies — Progress Slowing</div>
                                    <div className="risk-meta">68% avg progress · 2 activities at risk of delay</div>
                                    <span className="status-badge mt-1" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.62rem' }}>Watchlist</span>
                                </div>
                            </div>
                            <div className="risk-item" style={{ background: '#fffbeb', borderLeft: '4px solid #ffcd00' }}>
                                <div className="risk-dot" style={{ background: '#ffcd00' }}></div>
                                <div>
                                    <div className="risk-title">Staff Appraisal Cycle — Deadline Approaching</div>
                                    <div className="risk-meta">HR Department · Due in 3 days · 55% complete</div>
                                    <span className="status-badge mt-1" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.62rem' }}>Watchlist</span>
                                </div>
                            </div>
                            <div className="risk-item" style={{ background: '#fffbeb', borderLeft: '4px solid #ffcd00' }}>
                                <div className="risk-dot" style={{ background: '#ffcd00' }}></div>
                                <div>
                                    <div className="risk-title">Postgraduate Enrolment Drive — Behind Schedule</div>
                                    <div className="risk-meta">School of Grad Studies · 48% complete · Due in 5 days</div>
                                    <span className="status-badge mt-1" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.62rem' }}>Watchlist</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compliance & Institutional health */}
                <div className="col-12 col-lg-7">
                    <div className="table-card mb-4">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>fact_check</span>Compliance by Unit</h5>
                        </div>
                        <div className="p-4">
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">Faculty of Computing</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '92%', background: '#10b981' }}>92%</div></div>
                                <span className="compare-bar-pct">92%</span>
                            </div>
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">Faculty of Commerce</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '80%', background: '#10b981' }}>80%</div></div>
                                <span className="compare-bar-pct">80%</span>
                            </div>
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">Library Unit</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '76%', background: '#10b981' }}>76%</div></div>
                                <span className="compare-bar-pct">76%</span>
                            </div>
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">School of Grad Studies</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '68%', background: '#ffcd00' }}>68%</div></div>
                                <span className="compare-bar-pct">68%</span>
                            </div>
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">Finance &amp; Admin</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '41%', background: '#fb923c' }}>41%</div></div>
                                <span className="compare-bar-pct">41%</span>
                            </div>
                            <div className="compare-bar-wrap">
                                <span className="compare-bar-label">Research &amp; Innovation</span>
                                <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '29%', background: '#e31837' }}>29%</div></div>
                                <span className="compare-bar-pct">29%</span>
                            </div>
                            <div className="mt-3 pt-3 border-top d-flex gap-3 flex-wrap">
                                <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div><span style={{ fontSize: '.75rem', color: '#475569', fontWeight: 600 }}>≥75% — Compliant</span></div>
                                <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffcd00' }}></div><span style={{ fontSize: '.75rem', color: '#475569', fontWeight: 600 }}>50–74% — Watch</span></div>
                                <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e31837' }}></div><span style={{ fontSize: '.75rem', color: '#475569', fontWeight: 600 }}>&lt;50% — Critical</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Quick delayed table */}
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>schedule</span>Overdue Activities</h5>
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>5 Overdue</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead><tr><th>Activity</th><th>Unit</th><th>Days Overdue</th><th>Progress</th></tr></thead>
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Research Modernisation</td>
                                        <td style={{ fontSize: '.8rem' }}>Research &amp; Innovation</td>
                                        <td><span className="badge bg-danger">+14</span></td>
                                        <td><div className="progress-bar-custom" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}><div className="progress-bar-fill" style={{ width: '22%', background: '#e31837' }}></div></div><span style={{ fontSize: '.73rem', marginLeft: '5px', color: '#64748b' }}>22%</span></td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Audit Compliance Q1</td>
                                        <td style={{ fontSize: '.8rem' }}>Finance &amp; Admin</td>
                                        <td><span className="badge bg-danger">+8</span></td>
                                        <td><div className="progress-bar-custom" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}><div className="progress-bar-fill" style={{ width: '35%', background: '#e31837' }}></div></div><span style={{ fontSize: '.73rem', marginLeft: '5px', color: '#64748b' }}>35%</span></td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Postgrad Enrolment Drive</td>
                                        <td style={{ fontSize: '.8rem' }}>School of Grad Studies</td>
                                        <td><span className="badge bg-warning text-dark">+5</span></td>
                                        <td><div className="progress-bar-custom" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}><div className="progress-bar-fill" style={{ width: '48%', background: '#fb923c' }}></div></div><span style={{ fontSize: '.73rem', marginLeft: '5px', color: '#64748b' }}>48%</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
