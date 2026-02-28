"use client";

import React from 'react';

export default function StaffNotifications() {
    return (
        <div className="content-area w-100">
            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="table-card">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>notifications</span>All Notifications</h5>
                            <div className="d-flex gap-2">
                                <button className="btn btn-sm btn-outline-secondary" onClick={() => alert('Toast: All notifications marked as read.')}>Mark all read</button>
                                <select className="form-select form-select-sm" style={{ width: '130px' }} defaultValue="All">
                                    <option value="All">All</option>
                                    <option value="Unread">Unread</option>
                                    <option value="Tasks">Tasks</option>
                                    <option value="Deadlines">Deadlines</option>
                                    <option value="Feedback">Feedback</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <div className="notif-item unread">
                                <div className="notif-icon" style={{ background: '#eff6ff' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>task_alt</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">New Task Assigned: Create Inventory Checklist</div>
                                    <div className="notif-meta">Assigned by Dr. A. Ssekandi · Due 25 Apr 2025 · Digital Learning Infra.</div>
                                    <div className="notif-meta mt-1">Today, 10:15 AM</div>
                                </div>
                                <div className="unread-dot"></div>
                            </div>
                            <div className="notif-item unread">
                                <div className="notif-icon" style={{ background: '#ecfdf5' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>star</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">Evaluation Score Received — Budget Estimate: 5/5</div>
                                    <div className="notif-meta">HOD comment: "Excellent work. Very thorough cost analysis — no revisions needed."</div>
                                    <div className="notif-meta mt-1">Yesterday, 15:10 PM</div>
                                </div>
                                <div className="unread-dot"></div>
                            </div>
                            <div className="notif-item unread">
                                <div className="notif-icon" style={{ background: '#fff1f2' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>event_busy</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">⚠ Task Overdue: Write Tender for Computers</div>
                                    <div className="notif-meta">This task was due 15 Apr and remains incomplete. Please submit immediately or message your HOD.</div>
                                    <div className="notif-meta mt-1">Today, 08:00 AM</div>
                                </div>
                                <div className="unread-dot"></div>
                            </div>
                            <div className="notif-item unread">
                                <div className="notif-icon" style={{ background: '#fffbeb' }}><span className="material-symbols-outlined" style={{ color: '#b45309' }}>schedule</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">Deadline Reminder: Configure LAN Switches — due in 2 days</div>
                                    <div className="notif-meta">Please ensure you submit your completion report before 21 Apr 2025.</div>
                                    <div className="notif-meta mt-1">Today, 08:00 AM</div>
                                </div>
                                <div className="unread-dot"></div>
                            </div>
                            <div className="notif-item">
                                <div className="notif-icon" style={{ background: '#f8fafc' }}><span className="material-symbols-outlined" style={{ color: '#64748b' }}>inbox</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">Report Received: Lab Setup Report — Phase 1</div>
                                    <div className="notif-meta">Your submission was received by the system on 20 Apr 2025 at 08:42. HOD review in progress.</div>
                                    <div className="notif-meta mt-1">Today, 08:42 AM</div>
                                </div>
                            </div>
                            <div className="notif-item">
                                <div className="notif-icon" style={{ background: '#f8fafc' }}><span className="material-symbols-outlined" style={{ color: '#64748b' }}>task_alt</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">New Task Assigned: Configure LAN Switches</div>
                                    <div className="notif-meta">Assigned by Dr. A. Ssekandi · Due 21 Apr · Digital Learning Infrastructure</div>
                                    <div className="notif-meta mt-1">14 Apr 2025, 09:30 AM</div>
                                </div>
                            </div>
                            <div className="notif-item">
                                <div className="notif-icon" style={{ background: '#ecfdf5' }}><span className="material-symbols-outlined" style={{ color: '#059669' }}>check_circle</span></div>
                                <div className="flex-fill">
                                    <div className="notif-title">Task Completed: Prepare Budget Estimate — Score 5/5</div>
                                    <div className="notif-meta">Your report was reviewed and accepted. Great job!</div>
                                    <div className="notif-meta mt-1">08 Apr 2025, 03:10 PM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notification stats */}
                <div className="col-12 col-lg-4">
                    <div className="table-card">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>inbox</span>Notification Stats</h5></div>
                        <div className="p-4">
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.82rem', fontWeight: '700', color: '#0f172a' }}>Unread</span><span className="fw-black" style={{ color: 'var(--mubs-blue)' }}>4</span></div>
                                    <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '57%', background: 'var(--mubs-blue)' }}></div></div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.82rem', fontWeight: '700', color: '#0f172a' }}>Task Alerts</span><span className="fw-black" style={{ color: '#b45309' }}>3</span></div>
                                    <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '43%', background: 'var(--mubs-yellow)' }}></div></div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.82rem', fontWeight: '700', color: '#0f172a' }}>Feedback</span><span className="fw-black" style={{ color: '#059669' }}>2</span></div>
                                    <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '29%', background: '#10b981' }}></div></div>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-between mb-1"><span style={{ fontSize: '.82rem', fontWeight: '700', color: '#0f172a' }}>System</span><span className="fw-black" style={{ color: '#64748b' }}>2</span></div>
                                    <div className="progress-bar-custom"><div className="progress-bar-fill" style={{ width: '29%', background: '#94a3b8' }}></div></div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 rounded" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '.83rem' }}>Notification Settings</div>
                                <div className="form-check form-switch mb-1">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="sw1" />
                                    <label className="form-check-label" htmlFor="sw1" style={{ fontSize: '.78rem' }}>Email notifications</label>
                                </div>
                                <div className="form-check form-switch mb-1">
                                    <input className="form-check-input" type="checkbox" defaultChecked id="sw2" />
                                    <label className="form-check-label" htmlFor="sw2" style={{ fontSize: '.78rem' }}>Deadline reminders</label>
                                </div>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id="sw3" />
                                    <label className="form-check-label" htmlFor="sw3" style={{ fontSize: '.78rem' }}>SMS alerts</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
