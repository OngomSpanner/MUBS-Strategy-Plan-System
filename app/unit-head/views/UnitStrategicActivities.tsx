'use client';
import React from 'react';

export default function UnitStrategicActivities() {
    return (
        <div id="page-activities" className="page-section active-page">
            <div className="row g-3 mb-4">
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-blue)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem' }}>24</div>
                        <div className="stat-label">Assigned</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: '#10b981', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: '#059669' }}>18</div>
                        <div className="stat-label">On Track</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-yellow)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: '#b45309' }}>5</div>
                        <div className="stat-label">In Progress</div>
                    </div>
                </div>
                <div className="col-6 col-sm-3">
                    <div className="stat-card text-center" style={{ borderLeftColor: 'var(--mubs-red)', padding: '1rem' }}>
                        <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--mubs-red)' }}>1</div>
                        <div className="stat-label">Delayed</div>
                    </div>
                </div>
            </div>

            <div className="table-card">
                <div className="table-card-header">
                    <h5>
                        <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>track_changes</span>
                        Activities Assigned to My Unit
                    </h5>
                    <div className="d-flex gap-2 flex-wrap">
                        <div className="input-group input-group-sm" style={{ width: '190px' }}>
                            <span className="input-group-text bg-white">
                                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>search</span>
                            </span>
                            <input type="text" className="form-control" placeholder="Search..." />
                        </div>
                        <select className="form-select form-select-sm" style={{ width: '130px' }} defaultValue="All Statuses">
                            <option>All Statuses</option>
                            <option>On Track</option>
                            <option>In Progress</option>
                            <option>Delayed</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead>
                            <tr>
                                <th>Activity</th>
                                <th>Pillar</th>
                                <th>Target / KPI</th>
                                <th>Deadline</th>
                                <th>Tasks</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="activity-icon"><span className="material-symbols-outlined">laptop</span></div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Digital Learning Infrastructure</div>
                                            <div className="text-muted" style={{ fontSize: '.72rem' }}>Assigned by: Super Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Infrastructure</span></td>
                                <td style={{ fontSize: '.8rem' }}>4 Labs upgraded</td>
                                <td style={{ fontSize: '.8rem' }}>30 Jun 2025</td>
                                <td style={{ fontSize: '.83rem' }}><span className="fw-bold">4</span>/5</td>
                                <td style={{ minWidth: '110px' }}>
                                    <div className="progress-bar-custom">
                                        <div className="progress-bar-fill" style={{ width: '78%', background: '#005696' }}></div>
                                    </div>
                                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>78%</span>
                                </td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>On Track</span></td>
                                <td>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_task</span> Tasks
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="activity-icon"><span className="material-symbols-outlined">code</span></div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Software Dev Curriculum Update</div>
                                            <div className="text-muted" style={{ fontSize: '.72rem' }}>Assigned by: Super Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge" style={{ background: '#fdf2f8', color: '#9333ea', fontSize: '.62rem' }}>Teaching</span></td>
                                <td style={{ fontSize: '.8rem' }}>3 modules revised</td>
                                <td style={{ fontSize: '.8rem' }}>15 May 2025</td>
                                <td style={{ fontSize: '.83rem' }}><span className="fw-bold">4</span>/4</td>
                                <td style={{ minWidth: '110px' }}>
                                    <div className="progress-bar-custom">
                                        <div className="progress-bar-fill" style={{ width: '95%', background: '#10b981' }}></div>
                                    </div>
                                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>95%</span>
                                </td>
                                <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}>On Track</span></td>
                                <td>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_task</span> Tasks
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="activity-icon"><span className="material-symbols-outlined">school</span></div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Industry Attachment Programme</div>
                                            <div className="text-muted" style={{ fontSize: '.72rem' }}>Assigned by: Super Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '.62rem' }}>Partnerships</span></td>
                                <td style={{ fontSize: '.8rem' }}>50 students placed</td>
                                <td style={{ fontSize: '.8rem' }}>01 Aug 2025</td>
                                <td style={{ fontSize: '.83rem' }}><span className="fw-bold">2</span>/6</td>
                                <td style={{ minWidth: '110px' }}>
                                    <div className="progress-bar-custom">
                                        <div className="progress-bar-fill" style={{ width: '38%', background: '#ffcd00' }}></div>
                                    </div>
                                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>38%</span>
                                </td>
                                <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>In Progress</span></td>
                                <td>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_task</span> Tasks
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="activity-icon"><span className="material-symbols-outlined">computer</span></div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Computer Lab Upgrade — Phase 2</div>
                                            <div className="text-muted" style={{ fontSize: '.72rem', color: 'var(--mubs-red)' }}>⚠ OVERDUE</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.62rem' }}>Infrastructure</span></td>
                                <td style={{ fontSize: '.8rem' }}>2 labs refurbished</td>
                                <td style={{ fontSize: '.8rem', color: 'var(--mubs-red)', fontWeight: 700 }}>30 Apr 2025</td>
                                <td style={{ fontSize: '.83rem' }}><span className="fw-bold">1</span>/4</td>
                                <td style={{ minWidth: '110px' }}>
                                    <div className="progress-bar-custom">
                                        <div className="progress-bar-fill" style={{ width: '20%', background: '#e31837' }}></div>
                                    </div>
                                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>20%</span>
                                </td>
                                <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Delayed</span></td>
                                <td>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_task</span> Tasks
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="activity-icon"><span className="material-symbols-outlined">science</span></div>
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>Final Year Project Coordination</div>
                                            <div className="text-muted" style={{ fontSize: '.72rem' }}>Assigned by: Super Admin</div>
                                        </div>
                                    </div>
                                </td>
                                <td><span className="status-badge" style={{ background: '#fdf2f8', color: '#9333ea', fontSize: '.62rem' }}>Teaching</span></td>
                                <td style={{ fontSize: '.8rem' }}>120 projects supervised</td>
                                <td style={{ fontSize: '.8rem' }}>30 Sep 2025</td>
                                <td style={{ fontSize: '.83rem' }}><span className="fw-bold">0</span>/5</td>
                                <td style={{ minWidth: '110px' }}>
                                    <div className="progress-bar-custom">
                                        <div className="progress-bar-fill" style={{ width: '10%', background: '#94a3b8' }}></div>
                                    </div>
                                    <span style={{ fontSize: '.72rem', color: '#64748b' }}>10%</span>
                                </td>
                                <td><span className="status-badge" style={{ background: '#f1f5f9', color: '#475569' }}>Not Started</span></td>
                                <td>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>add_task</span> Tasks
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="table-card-footer">
                    <span className="footer-label">Showing 5 of 24 activities</span>
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
    );
}
