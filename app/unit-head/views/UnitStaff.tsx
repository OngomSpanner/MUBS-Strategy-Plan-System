'use client';
import React from 'react';

export default function UnitStaff() {
    return (
        <div id="page-staff" className="page-section active-page">
            <div className="row g-4">
                {/* HR Alerts (Top priority) */}
                <div className="col-12 col-xl-4 order-xl-2">
                    <div className="table-card mb-4" style={{ borderTop: '4px solid var(--mubs-red)' }}>
                        <div className="table-card-header" style={{ background: '#fff1f2' }}>
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-red)' }}>assignment_late</span>HR Action Required</h5>
                        </div>
                        <div className="p-3">
                            <div className="warn-card mb-3" style={{ background: '#fffbeb', borderLeftColor: '#b45309' }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                        <div className="staff-avatar" style={{ background: '#b45309', width: '28px', height: '28px', fontSize: '.7rem' }}>CO</div>
                                        C. Opio
                                    </div>
                                    <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>Contract</span>
                                </div>
                                <div className="text-dark fw-bold mb-1" style={{ fontSize: '.8rem' }}>Contract Expires in 12 Days</div>
                                <div className="text-muted mb-3" style={{ fontSize: '.75rem', lineHeight: '1.4' }}>
                                    Position: Research Asst.<br />
                                    End Date: 27 Apr 2025<br />
                                    Required: Renewal / Termination feedback to HR.
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-warning fw-bold text-dark flex-fill" style={{ fontSize: '.75rem' }} data-bs-toggle="modal" data-bs-target="#viewContractModal">Action</button>
                                </div>
                            </div>

                            <div className="warn-card" style={{ background: '#fff1f2', borderLeftColor: '#e31837' }}>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="fw-bold text-dark d-flex align-items-center gap-2">
                                        <div className="staff-avatar" style={{ background: '#7c3aed', width: '28px', height: '28px', fontSize: '.7rem', opacity: .5 }}>BN</div>
                                        B. Nakato
                                    </div>
                                    <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Leave</span>
                                </div>
                                <div className="text-dark fw-bold mb-1" style={{ fontSize: '.8rem' }}>On Medical Leave</div>
                                <div className="text-muted mb-3" style={{ fontSize: '.75rem', lineHeight: '1.4' }}>
                                    Duration: 18 Apr – 25 Apr<br />
                                    Impact: 3 active tasks assigned.
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-danger fw-bold flex-fill" style={{ fontSize: '.75rem' }} data-bs-toggle="modal" data-bs-target="#viewLeaveModal">Reassign Tasks</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Staff List */}
                <div className="col-12 col-xl-8 order-xl-1">
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>group</span>Unit Staff Roster</h5>
                            <div className="d-flex gap-2">
                                <div className="input-group input-group-sm" style={{ width: '200px' }}>
                                    <span className="input-group-text bg-white"><span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#64748b' }}>search</span></span>
                                    <input type="text" className="form-control" placeholder="Search staff..." />
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>Staff Member</th>
                                        <th>Role</th>
                                        <th>Active Tasks</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#7c3aed' }}>JA</div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>J. Amuge</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>j.amuge@mubs.ac.ug</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.8rem' }}>Lecturer</td>
                                        <td><span className="fw-bold text-dark">4</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>active</span></td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>circle</span>Active</span></td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }} data-bs-toggle="modal" data-bs-target="#assignTaskModal"><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>assignment_ind</span></button>
                                                <button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.75rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#059669' }}>PK</div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>P. Kato</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>p.kato@mubs.ac.ug</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.8rem' }}>Lecturer</td>
                                        <td><span className="fw-bold text-dark">3</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>active</span></td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>circle</span>Active</span></td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }} data-bs-toggle="modal" data-bs-target="#assignTaskModal"><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>assignment_ind</span></button>
                                                <button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.75rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr style={{ background: '#fff9f0' }}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#7c3aed', opacity: .5 }}>BN</div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>B. Nakato <span style={{ fontSize: '.65rem', background: '#fef9c3', color: '#a16207', padding: '.1rem .4rem', borderRadius: '99px', fontWeight: 800, marginLeft: '4px' }}>ON LEAVE</span></div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>b.nakato@mubs.ac.ug</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.8rem' }}>Tutorial Assistant</td>
                                        <td><span className="fw-bold text-muted">3</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>paused</span></td>
                                        <td><span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>circle</span>On Leave</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-danger py-0 px-2 fw-bold" style={{ fontSize: '.72rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>swap_horiz</span> Cover</button>
                                        </td>
                                    </tr>
                                    <tr style={{ background: '#fffbeb' }}>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#b45309' }}>CO</div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>C. Opio <span style={{ fontSize: '.65rem', background: '#fee2e2', color: '#b91c1c', padding: '.1rem .4rem', borderRadius: '99px', fontWeight: 800, marginLeft: '4px' }}>CONTRACT ⚠</span></div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>c.opio@mubs.ac.ug</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.8rem' }}>Research Asst.</td>
                                        <td><span className="fw-bold text-dark">2</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>active</span></td>
                                        <td><span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>circle</span>Expiring</span></td>
                                        <td>
                                            <button className="btn btn-xs btn-warning py-0 px-2 fw-bold text-dark" style={{ fontSize: '.72rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>badge</span> Renew</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{ background: '#b45309' }}>MO</div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>M. Ogen</div>
                                                    <div className="text-muted" style={{ fontSize: '.72rem' }}>m.ogen@mubs.ac.ug</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.8rem' }}>Lab Technician</td>
                                        <td><span className="fw-bold text-dark">3</span> <span className="text-muted" style={{ fontSize: '.75rem' }}>active</span></td>
                                        <td><span className="status-badge" style={{ background: '#dcfce7', color: '#15803d' }}><span className="material-symbols-outlined" style={{ fontSize: '11px' }}>circle</span>Active</span></td>
                                        <td>
                                            <div className="d-flex gap-1">
                                                <button className="btn btn-xs btn-outline-primary py-0 px-2" style={{ fontSize: '.75rem' }} data-bs-toggle="modal" data-bs-target="#assignTaskModal"><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>assignment_ind</span></button>
                                                <button className="btn btn-xs btn-outline-secondary py-0 px-2" style={{ fontSize: '.75rem' }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>visibility</span></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="table-card-footer">
                            <span className="footer-label">Showing 5 of 12 staff</span>
                            <div className="d-flex gap-1">
                                <button className="page-btn" disabled>‹</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">›</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
