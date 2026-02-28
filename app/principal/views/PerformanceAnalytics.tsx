'use client';
import React, { useState } from 'react';

export default function PerformanceAnalytics() {
    const [activeTab, setActiveTab] = useState<'unit' | 'compliance' | 'staff'>('unit');

    return (
        <div id="page-analytics" className="page-section active-page">
            {/* Tabs */}
            <ul className="nav nav-pills mb-4 gap-2" id="analyticsTab">
                <li className="nav-item">
                    <button
                        className={`nav-link fw-bold ${activeTab === 'unit' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'unit' ? 'var(--mubs-blue)' : 'rgba(255,255,255,.1)',
                            color: activeTab === 'unit' ? '#fff' : '#bfdbfe',
                            borderRadius: '8px',
                            fontSize: '.83rem'
                        }}
                        onClick={() => setActiveTab('unit')}
                    >
                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>corporate_fare</span>Unit Comparison
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link fw-bold ${activeTab === 'compliance' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'compliance' ? 'var(--mubs-blue)' : 'rgba(255,255,255,.1)',
                            color: activeTab === 'compliance' ? '#fff' : '#bfdbfe',
                            borderRadius: '8px',
                            fontSize: '.83rem'
                        }}
                        onClick={() => setActiveTab('compliance')}
                    >
                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>fact_check</span>Compliance
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link fw-bold ${activeTab === 'staff' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'staff' ? 'var(--mubs-blue)' : 'rgba(255,255,255,.1)',
                            color: activeTab === 'staff' ? '#fff' : '#bfdbfe',
                            borderRadius: '8px',
                            fontSize: '.83rem'
                        }}
                        onClick={() => setActiveTab('staff')}
                    >
                        <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>person_search</span>Staff Performance
                    </button>
                </li>
            </ul>

            {/* Tab 1: Unit Comparison */}
            {activeTab === 'unit' && (
                <div id="tab-unit" className="analytics-tab">
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>bar_chart</span>Unit Performance Comparison</h5>
                                    <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Pillars">
                                        <option>All Pillars</option>
                                        <option>Teaching</option>
                                        <option>Research</option>
                                        <option>Governance</option>
                                    </select>
                                </div>
                                <div className="p-4">
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Library Unit</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '88%', background: '#10b981' }}>88%</div></div>
                                        <span className="compare-bar-pct">88%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Faculty of Computing</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '82%', background: '#10b981' }}>82%</div></div>
                                        <span className="compare-bar-pct">82%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Faculty of Commerce</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '74%', background: '#22c55e' }}>74%</div></div>
                                        <span className="compare-bar-pct">74%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Faculty of Management</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '70%', background: '#84cc16' }}>70%</div></div>
                                        <span className="compare-bar-pct">70%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">School of Grad Studies</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '68%', background: '#ffcd00' }}>68%</div></div>
                                        <span className="compare-bar-pct">68%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Dean of Students</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '62%', background: '#fb923c' }}>62%</div></div>
                                        <span className="compare-bar-pct">62%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">HR Department</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '55%', background: '#fb923c' }}>55%</div></div>
                                        <span className="compare-bar-pct">55%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Finance &amp; Admin</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '41%', background: '#ef4444' }}>41%</div></div>
                                        <span className="compare-bar-pct">41%</span>
                                    </div>
                                    <div className="compare-bar-wrap">
                                        <span className="compare-bar-label">Research &amp; Innovation</span>
                                        <div className="compare-bar-track"><div className="compare-bar-fill" style={{ width: '29%', background: '#e31837' }}>29%</div></div>
                                        <span className="compare-bar-pct">29%</span>
                                    </div>
                                    {/* Average line indicator */}
                                    <div className="mt-3 pt-3 border-top">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span style={{ fontSize: '.78rem', color: '#64748b', fontWeight: 600 }}>Institution Average</span>
                                            <span className="fw-bold" style={{ color: 'var(--mubs-blue)', fontSize: '.9rem' }}>67%</span>
                                        </div>
                                        <div className="gauge-bar mt-1"><div className="gauge-fill" style={{ width: '67%', background: 'var(--mubs-blue)' }}></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Donut rings */}
                        <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                            <div className="table-card">
                                <div className="table-card-header"><h5 style={{ fontSize: '.88rem' }}>Activity Status Split</h5></div>
                                <div className="p-4 d-flex align-items-center justify-content-center gap-4">
                                    <div className="ring-wrap">
                                        <svg width="130" height="130" viewBox="0 0 130 130">
                                            {/* Background circle */}
                                            <circle cx="65" cy="65" r="52" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                                            {/* On track (96/148 = 65%) */}
                                            <circle cx="65" cy="65" r="52" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray="213 114" strokeLinecap="round" />
                                            {/* In Progress (47/148 = 32%) */}
                                            <circle cx="65" cy="65" r="52" fill="none" stroke="#ffcd00" strokeWidth="14" strokeDasharray="100 227" strokeDashoffset="-213" strokeLinecap="round" />
                                            {/* Delayed (5/148 = 3%) */}
                                            <circle cx="65" cy="65" r="52" fill="none" stroke="#e31837" strokeWidth="14" strokeDasharray="11 316" strokeDashoffset="-313" strokeLinecap="round" />
                                        </svg>
                                        <div className="ring-text"><div className="ring-pct">148</div><div className="ring-lbl">Activities</div></div>
                                    </div>
                                    <div className="d-flex flex-column gap-2">
                                        <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }}></div><div><div style={{ fontSize: '.78rem', fontWeight: 700, color: '#0f172a' }}>96</div><div style={{ fontSize: '.65rem', color: '#64748b' }}>On Track</div></div></div>
                                        <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#ffcd00' }}></div><div><div style={{ fontSize: '.78rem', fontWeight: 700, color: '#0f172a' }}>47</div><div style={{ fontSize: '.65rem', color: '#64748b' }}>In Progress</div></div></div>
                                        <div className="d-flex align-items-center gap-2"><div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e31837' }}></div><div><div style={{ fontSize: '.78rem', fontWeight: 700, color: '#0f172a' }}>5</div><div style={{ fontSize: '.65rem', color: '#64748b' }}>Delayed</div></div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="table-card">
                                <div className="table-card-header"><h5 style={{ fontSize: '.88rem' }}>Top &amp; Bottom Units</h5></div>
                                <div className="p-3">
                                    <div style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#059669', marginBottom: '.5rem' }}>Top Performers</div>
                                    <div className="d-flex align-items-center gap-2 mb-2"><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#059669' }}>emoji_events</span><span style={{ fontSize: '.82rem', fontWeight: 700, color: '#0f172a' }}>Library Unit</span><span className="ms-auto fw-bold" style={{ color: '#059669', fontSize: '.82rem' }}>88%</span></div>
                                    <div className="d-flex align-items-center gap-2 mb-3"><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#22c55e' }}>emoji_events</span><span style={{ fontSize: '.82rem', fontWeight: 700, color: '#0f172a' }}>Faculty of Computing</span><span className="ms-auto fw-bold" style={{ color: '#22c55e', fontSize: '.82rem' }}>82%</span></div>
                                    <div style={{ fontSize: '.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', color: '#e31837', marginBottom: '.5rem' }}>Needs Attention</div>
                                    <div className="d-flex align-items-center gap-2 mb-2"><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#e31837' }}>arrow_downward</span><span style={{ fontSize: '.82rem', fontWeight: 700, color: '#0f172a' }}>Research &amp; Innovation</span><span className="ms-auto fw-bold" style={{ color: '#e31837', fontSize: '.82rem' }}>29%</span></div>
                                    <div className="d-flex align-items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#fb923c' }}>arrow_downward</span><span style={{ fontSize: '.82rem', fontWeight: 700, color: '#0f172a' }}>Finance &amp; Admin</span><span className="ms-auto fw-bold" style={{ color: '#fb923c', fontSize: '.82rem' }}>41%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 2: Compliance */}
            {activeTab === 'compliance' && (
                <div id="tab-compliance" className="analytics-tab">
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="table-card">
                                <div className="table-card-header">
                                    <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>fact_check</span>Compliance Rate by Department</h5>
                                    <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Institutional Target: 85%</span>
                                </div>
                                <div className="table-responsive">
                                    <table className="table mb-0">
                                        <thead><tr><th>Department / Unit</th><th>Activities</th><th>Compliant</th><th>Compliance Rate</th><th>Target Gap</th><th>Status</th></tr></thead>
                                        <tbody>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Faculty of Computing</td><td style={{ fontSize: '.83rem' }}>24</td><td style={{ fontSize: '.83rem' }}>22</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '92%', background: '#10b981' }}></div></div><span style={{ fontSize: '.75rem' }}>92%</span></div></td><td style={{ fontSize: '.83rem', color: '#059669' }}>+7%</td><td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Compliant</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Faculty of Commerce</td><td style={{ fontSize: '.83rem' }}>18</td><td style={{ fontSize: '.83rem' }}>15</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '80%', background: '#10b981' }}></div></div><span style={{ fontSize: '.75rem' }}>80%</span></div></td><td style={{ fontSize: '.83rem', color: '#059669' }}>+5%</td><td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Compliant</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Library Unit</td><td style={{ fontSize: '.83rem' }}>10</td><td style={{ fontSize: '.83rem' }}>8</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '76%', background: '#22c55e' }}></div></div><span style={{ fontSize: '.75rem' }}>76%</span></div></td><td style={{ fontSize: '.83rem', color: '#059669' }}>+1%</td><td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Compliant</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>School of Grad Studies</td><td style={{ fontSize: '.83rem' }}>15</td><td style={{ fontSize: '.83rem' }}>10</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '68%', background: '#ffcd00' }}></div></div><span style={{ fontSize: '.75rem' }}>68%</span></div></td><td style={{ fontSize: '.83rem', color: '#b45309' }}>–17%</td><td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Watch</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>HR Department</td><td style={{ fontSize: '.83rem' }}>8</td><td style={{ fontSize: '.83rem' }}>5</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '58%', background: '#fb923c' }}></div></div><span style={{ fontSize: '.75rem' }}>58%</span></div></td><td style={{ fontSize: '.83rem', color: '#c2410c' }}>–27%</td><td><span className="status-badge" style={{ background: '#fde8d8', color: '#c2410c' }}>At Risk</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Finance &amp; Admin</td><td style={{ fontSize: '.83rem' }}>20</td><td style={{ fontSize: '.83rem' }}>8</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '41%', background: '#e31837' }}></div></div><span style={{ fontSize: '.75rem' }}>41%</span></div></td><td style={{ fontSize: '.83rem', color: '#b91c1c' }}>–44%</td><td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Critical</span></td></tr>
                                            <tr><td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Research &amp; Innovation</td><td style={{ fontSize: '.83rem' }}>12</td><td style={{ fontSize: '.83rem' }}>3</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '29%', background: '#e31837' }}></div></div><span style={{ fontSize: '.75rem' }}>29%</span></div></td><td style={{ fontSize: '.83rem', color: '#b91c1c' }}>–56%</td><td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Critical</span></td></tr>
                                            <tr style={{ background: '#f8fafc' }}><td className="fw-bold" style={{ color: 'var(--mubs-blue)' }}>Institution Average</td><td className="fw-bold">107</td><td className="fw-bold">71</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '80px' }}><div className="progress-bar-fill" style={{ width: '73%', background: 'var(--mubs-blue)' }}></div></div><span className="fw-bold" style={{ fontSize: '.75rem' }}>73%</span></div></td><td className="fw-bold" style={{ color: '#b45309' }}>–12%</td><td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Watch</span></td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-card-footer">
                                    <span className="footer-label">Compliance target: 85% by December 2025</span>
                                    <button className="btn btn-sm btn-success fw-bold"><span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>download</span>Export</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-4">
                            <div className="table-card">
                                <div className="table-card-header"><h5 style={{ fontSize: '.9rem' }}>Compliance Distribution</h5></div>
                                <div className="p-4">
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: 700, color: '#059669' }}>≥75% — Compliant</span><span className="fw-bold" style={{ fontSize: '.8rem' }}>3 units</span></div>
                                        <div className="gauge-bar"><div className="gauge-fill" style={{ width: '43%', background: '#10b981' }}></div></div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: 700, color: '#a16207' }}>50–74% — Watchlist</span><span className="fw-bold" style={{ fontSize: '.8rem' }}>2 units</span></div>
                                        <div className="gauge-bar"><div className="gauge-fill" style={{ width: '29%', background: '#ffcd00' }}></div></div>
                                    </div>
                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.8rem', fontWeight: 700, color: '#b91c1c' }}>&lt;50% — Critical</span><span className="fw-bold" style={{ fontSize: '.8rem' }}>2 units</span></div>
                                        <div className="gauge-bar"><div className="gauge-fill" style={{ width: '29%', background: '#e31837' }}></div></div>
                                    </div>
                                    <hr />
                                    <div className="text-center mt-3">
                                        <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--mubs-blue)' }}>73%</div>
                                        <div style={{ fontSize: '.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#64748b' }}>Institutional Average</div>
                                        <div style={{ fontSize: '.75rem', color: '#b45309', fontWeight: 600, marginTop: '.3rem' }}>12% below target (85%)</div>
                                        <div className="gauge-bar mt-2"><div className="gauge-fill" style={{ width: '73%', background: 'var(--mubs-blue)' }}></div></div>
                                        <div className="d-flex justify-content-between mt-1"><span style={{ fontSize: '.65rem', color: '#94a3b8' }}>0%</span><span style={{ fontSize: '.65rem', color: 'var(--mubs-blue)', fontWeight: 800 }}>85% target</span><span style={{ fontSize: '.65rem', color: '#94a3b8' }}>100%</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab 3: Staff Performance */}
            {activeTab === 'staff' && (
                <div id="tab-staff" className="analytics-tab">
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>person_search</span>Staff Performance Summaries</h5>
                            <div className="d-flex gap-2">
                                <select className="form-select form-select-sm" style={{ width: '160px' }} defaultValue="All Units">
                                    <option>All Units</option>
                                    <option>Faculty of Computing</option>
                                    <option>Finance &amp; Admin</option>
                                    <option>Research &amp; Innovation</option>
                                </select>
                                <select className="form-select form-select-sm" style={{ width: '130px' }} defaultValue="All Ratings">
                                    <option>All Ratings</option>
                                    <option>Excellent</option>
                                    <option>Good</option>
                                    <option>Poor</option>
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead><tr><th>Staff</th><th>Unit</th><th>Activities</th><th>Completed</th><th>Rate</th><th>Rating</th></tr></thead>
                                <tbody>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mubs-blue)' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Dr. A. Ssekandi</div></div></td><td style={{ fontSize: '.83rem' }}>Faculty of Computing</td><td style={{ fontSize: '.83rem' }}>8</td><td style={{ fontSize: '.83rem' }}>7</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '87%', background: '#10b981' }}></div></div><span style={{ fontSize: '.75rem' }}>87%</span></div></td><td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Excellent</span></td></tr>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mubs-blue)' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Ms. N. Amone</div></div></td><td style={{ fontSize: '.83rem' }}>Library Unit</td><td style={{ fontSize: '.83rem' }}>10</td><td style={{ fontSize: '.83rem' }}>9</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '90%', background: '#10b981' }}></div></div><span style={{ fontSize: '.75rem' }}>90%</span></div></td><td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>Excellent</span></td></tr>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mubs-blue)' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Ms. B. Nalugo</div></div></td><td style={{ fontSize: '.83rem' }}>HR Department</td><td style={{ fontSize: '.83rem' }}>6</td><td style={{ fontSize: '.83rem' }}>4</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '66%', background: '#ffcd00' }}></div></div><span style={{ fontSize: '.75rem' }}>66%</span></div></td><td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Good</span></td></tr>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--mubs-blue)' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Mr. P. Okello</div></div></td><td style={{ fontSize: '.83rem' }}>Finance &amp; Admin</td><td style={{ fontSize: '.83rem' }}>7</td><td style={{ fontSize: '.83rem' }}>3</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '43%', background: '#fb923c' }}></div></div><span style={{ fontSize: '.75rem' }}>43%</span></div></td><td><span className="status-badge" style={{ background: '#fde8d8', color: '#c2410c' }}>Fair</span></td></tr>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#e31837' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Mr. C. Opio</div></div></td><td style={{ fontSize: '.83rem' }}>Research &amp; Innovation</td><td style={{ fontSize: '.83rem' }}>5</td><td style={{ fontSize: '.83rem' }}>1</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '20%', background: '#e31837' }}></div></div><span style={{ fontSize: '.75rem' }}>20%</span></div></td><td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Poor</span></td></tr>
                                    <tr><td><div className="d-flex align-items-center gap-2"><div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#e31837' }}>person</span></div><div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Dr. R. Nabasa</div></div></td><td style={{ fontSize: '.83rem' }}>Research &amp; Innovation</td><td style={{ fontSize: '.83rem' }}>4</td><td style={{ fontSize: '.83rem' }}>1</td><td><div className="d-flex align-items-center gap-2"><div className="progress-bar-custom" style={{ width: '70px' }}><div className="progress-bar-fill" style={{ width: '25%', background: '#e31837' }}></div></div><span style={{ fontSize: '.75rem' }}>25%</span></div></td><td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Poor</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-card-footer">
                            <span className="footer-label">Showing 6 of 86 staff · Read-only view</span>
                            <div className="d-flex gap-1">
                                <button className="page-btn" disabled>‹</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">3</button>
                                <button className="page-btn">›</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
