'use client';
import React from 'react';

export default function UnitTasks() {
    return (
        <div id="page-tasks" className="page-section active-page">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div className="d-flex gap-2 flex-wrap">
                    <select className="form-select form-select-sm" style={{ width: '180px' }} defaultValue="All Strategic Activities">
                        <option>All Strategic Activities</option>
                        <option>Digital Learning Infra.</option>
                        <option>Software Dev Curriculum</option>
                        <option>Industry Attachment</option>
                    </select>
                    <select className="form-select form-select-sm" style={{ width: '140px' }} defaultValue="All Assignees">
                        <option>All Assignees</option>
                        <option>J. Amuge</option>
                        <option>P. Kato</option>
                        <option>M. Ogen</option>
                        <option>C. Opio</option>
                    </select>
                </div>
            </div>

            <div className="row g-3">
                {/* To Do Column */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="kanban-column bg-light rounded p-3 h-100 border">
                        <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center text-dark">
                            To Do <span className="badge bg-secondary">3</span>
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            {/* Task 1 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-danger" style={{ fontSize: '.65rem' }}>High Priority</span>
                                    <span className="text-muted" style={{ fontSize: '.7rem' }}>Due 25 Apr</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Procure switches (x4)</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Digital Learning Infra.</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <div className="staff-avatar" style={{ background: '#7c3aed', width: '24px', height: '24px', fontSize: '.6rem' }} title="J. Amuge">JA</div>
                                    <button className="btn btn-xs btn-light py-0 px-2" style={{ fontSize: '.7rem' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span></button>
                                </div>
                            </div>

                            {/* Task 2 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-muted" style={{ fontSize: '.7rem' }}>Due 10 May</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Draft exam timetable</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Faculty Operations</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <span className="text-muted fst-italic" style={{ fontSize: '.7rem' }}>Unassigned</span>
                                    <button className="btn btn-xs btn-outline-primary py-0 px-2 fw-bold" style={{ fontSize: '.7rem' }}>Assign</button>
                                </div>
                            </div>

                            {/* Task 3 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-muted fw-bold text-danger" style={{ fontSize: '.7rem' }}>Overdue</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Review MOUs</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Industry Attachment</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <div className="staff-avatar" style={{ background: '#b45309', width: '24px', height: '24px', fontSize: '.6rem' }} title="C. Opio">CO</div>
                                    <button className="btn btn-xs btn-light py-0 px-2" style={{ fontSize: '.7rem' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="kanban-column rounded p-3 h-100 border" style={{ background: '#fef9c3' }}>
                        <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center" style={{ color: '#a16207' }}>
                            In Progress <span className="badge" style={{ background: '#a16207' }}>2</span>
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            {/* Task 1 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border border-warning" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-muted" style={{ fontSize: '.7rem' }}>Due 30 Apr</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Mount projectors (Lab C)</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Digital Learning Infra.</div>
                                <div className="progress mb-3" style={{ height: '4px' }}><div className="progress-bar bg-warning" style={{ width: '60%' }}></div></div>
                                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                    <div className="staff-avatar" style={{ background: '#7c3aed', width: '24px', height: '24px', fontSize: '.6rem' }} title="J. Amuge">JA</div>
                                    <button className="btn btn-xs btn-light py-0 px-2" style={{ fontSize: '.7rem' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span></button>
                                </div>
                            </div>

                            {/* Task 2 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border border-warning" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-danger" style={{ fontSize: '.65rem' }}>High Priority</span>
                                    <span className="text-muted" style={{ fontSize: '.7rem' }}>Due 20 Apr</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Finalize CS302 Notes</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Software Dev Curriculum</div>
                                <div className="progress mb-3" style={{ height: '4px' }}><div className="progress-bar bg-warning" style={{ width: '85%' }}></div></div>
                                <div className="d-flex justify-content-between align-items-center border-top pt-2">
                                    <div className="staff-avatar" style={{ background: '#059669', width: '24px', height: '24px', fontSize: '.6rem' }} title="P. Kato">PK</div>
                                    <button className="btn btn-xs btn-light py-0 px-2" style={{ fontSize: '.7rem' }}><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Under Review Column */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="kanban-column rounded p-3 h-100 border" style={{ background: '#eff6ff', borderColor: '#bfdbfe !important' }}>
                        <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center" style={{ color: 'var(--mubs-blue)' }}>
                            Under Review <span className="badge" style={{ background: 'var(--mubs-blue)' }}>2</span>
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            {/* Task 1 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border border-primary" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-primary fw-bold" style={{ fontSize: '.7rem' }}>Requires Evaluation</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Industry Contacts Register</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Industry Attachment</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <div className="staff-avatar" style={{ background: '#b45309', width: '24px', height: '24px', fontSize: '.6rem' }} title="M. Ogen">MO</div>
                                    <button className="btn btn-xs btn-primary fw-bold py-0 px-2" style={{ fontSize: '.7rem' }}>Evaluate</button>
                                </div>
                            </div>
                            {/* Task 2 */}
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border border-primary" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-primary fw-bold" style={{ fontSize: '.7rem' }}>Requires Evaluation</span>
                                </div>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Lab Setup Phase 1 Report</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Digital Learning Infra.</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <div className="staff-avatar" style={{ background: '#7c3aed', width: '24px', height: '24px', fontSize: '.6rem' }} title="J. Amuge">JA</div>
                                    <button className="btn btn-xs btn-primary fw-bold py-0 px-2" style={{ fontSize: '.7rem' }}>Evaluate</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completed Column */}
                <div className="col-12 col-md-6 col-xl-3">
                    <div className="kanban-column rounded p-3 h-100 border" style={{ background: '#ecfdf5', borderColor: '#a7f3d0 !important' }}>
                        <h6 className="fw-bold mb-3 d-flex justify-content-between align-items-center" style={{ color: '#059669' }}>
                            Completed <span className="badge" style={{ background: '#059669' }}>1</span>
                        </h6>
                        <div className="d-flex flex-column gap-3">
                            <div className="kanban-card p-3 bg-white rounded shadow-sm border border-success opacity-75" style={{ cursor: 'pointer' }}>
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="badge bg-secondary" style={{ fontSize: '.65rem' }}>Normal</span>
                                    <span className="text-success fw-bold" style={{ fontSize: '.7rem' }}>Done 12 Apr</span>
                                </div>
                                <div className="fw-bold text-dark mb-1 text-decoration-line-through" style={{ fontSize: '.85rem', lineHeight: '1.4' }}>Curriculum Draft CS302</div>
                                <div className="text-muted mb-2" style={{ fontSize: '.75rem' }}>Software Dev Curriculum</div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <div className="staff-avatar" style={{ background: '#059669', width: '24px', height: '24px', fontSize: '.6rem' }} title="P. Kato">PK</div>
                                    <span className="badge bg-success" style={{ fontSize: '.6rem' }}>★ 4/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
