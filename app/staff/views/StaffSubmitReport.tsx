"use client";

import React, { useState } from 'react';

export default function StaffSubmitReport() {
    const [taskVal, setTaskVal] = useState('');
    const [progressVal, setProgressVal] = useState('40');

    const taskInfoData: { [key: string]: { title: string, due: string } } = {
        overdue: { title: 'Write Tender for Computers — Computer Lab Upgrade', due: '⚠ Overdue · Was due 15 Apr 2025. Submit immediately.' },
        lan: { title: 'Configure LAN Switches — Digital Learning Infrastructure', due: 'Due: 21 Apr 2025 · 2 days remaining' },
        switches: { title: 'Procure Network Switches (x4) — Digital Learning Infrastructure', due: 'Due: 20 Apr 2025 · 1 day remaining' },
        safety: { title: 'Draft Lab Safety Guidelines — Digital Learning Infrastructure', due: 'Due: 22 Apr 2025 · 3 days remaining' },
        inventory: { title: 'Create Inventory Checklist — Digital Learning Infrastructure', due: 'Due: 25 Apr 2025 · 6 days remaining' },
    };

    return (
        <div className="content-area w-100">
            <div className="row g-4">
                <div className="col-12 col-lg-7">
                    <div className="table-card">
                        <div className="table-card-header" style={{ background: 'linear-gradient(90deg,#eff6ff,#fff)' }}>
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>upload_file</span>Submit Task Report / Update</h5>
                        </div>
                        <div className="p-4">
                            <div className="row g-3">

                                {/* Task select */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small">Select Task <span className="text-danger">*</span></label>
                                    <select className="form-select" id="taskSelect" value={taskVal} onChange={(e) => setTaskVal(e.target.value)}>
                                        <option value="">— Choose a task —</option>
                                        <option value="overdue">Write Tender for Computers ⚠ OVERDUE</option>
                                        <option value="lan">Configure LAN Switches</option>
                                        <option value="switches">Procure Network Switches</option>
                                        <option value="safety">Draft Lab Safety Guidelines</option>
                                        <option value="inventory">Create Inventory Checklist</option>
                                    </select>
                                </div>

                                {/* Task info callout */}
                                {taskVal && taskInfoData[taskVal] && (
                                    <div className="col-12" id="taskInfoBox">
                                        <div className="p-3 rounded" style={{ background: '#f0f7ff', border: '1px solid #bfdbfe', borderLeft: '4px solid var(--mubs-blue)' }}>
                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '.82rem' }} id="taskInfoTitle">{taskInfoData[taskVal].title}</div>
                                            <div className="text-muted" style={{ fontSize: '.75rem' }} id="taskInfoDue">{taskInfoData[taskVal].due}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Report type */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small">Report Type</label>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <div className="form-check"><input className="form-check-input" type="radio" name="reportType" id="rt1" value="progress" defaultChecked /><label className="form-check-label small fw-bold" htmlFor="rt1">Progress Update</label></div>
                                        <div className="form-check"><input className="form-check-input" type="radio" name="reportType" id="rt2" value="completion" /><label className="form-check-label small fw-bold" htmlFor="rt2">Completion Report</label></div>
                                        <div className="form-check"><input className="form-check-input" type="radio" name="reportType" id="rt3" value="issue" /><label className="form-check-label small fw-bold" htmlFor="rt3">Issue / Blocker</label></div>
                                    </div>
                                </div>

                                {/* Progress slider */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small">Current Progress: <span id="progressVal" className="text-primary">{progressVal}</span>%</label>
                                    <input type="range" className="form-range" min="0" max="100" step="5" value={progressVal} onChange={(e) => setProgressVal(e.target.value)} />
                                </div>

                                {/* Description */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small">Report Details <span className="text-danger">*</span></label>
                                    <textarea className="form-control" rows={5} placeholder="Describe what was done, what remains, any challenges encountered...&#10;&#10;e.g. Installed and configured 2 of 4 network switches in Lab A. Encountered IP conflict issue — resolved by reassigning VLAN. Lab B configuration pending hardware delivery on 22 Apr."></textarea>
                                </div>

                                {/* Evidence link */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small d-flex align-items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>link</span>Evidence Link (Google Drive, SharePoint, etc.)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white"><span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94a3b8' }}>insert_link</span></span>
                                        <input type="url" className="form-control" id="evidenceLinkInput" placeholder="https://drive.google.com/file/..." />
                                        <button className="btn btn-outline-secondary fw-bold" type="button" onClick={() => alert('Toast: Preview link successful')}>Preview</button>
                                    </div>
                                </div>

                                {/* File upload zone */}
                                <div className="col-12">
                                    <label className="form-label fw-black text-dark small d-flex align-items-center gap-2"><span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>attach_file</span>Attach Supporting File (optional)</label>
                                    <div className="upload-zone" onClick={() => alert('Toast: File picker opened.')}>
                                        <span className="material-symbols-outlined">cloud_upload</span>
                                        <div className="fw-bold text-muted" style={{ fontSize: '.88rem' }}>Click to upload or drag &amp; drop</div>
                                        <div className="text-muted" style={{ fontSize: '.75rem' }}>PDF, DOCX, XLSX, PNG, JPG · Max 10MB</div>
                                    </div>
                                </div>

                                <div className="col-12 d-flex gap-3 flex-wrap mt-1">
                                    <button className="btn fw-bold text-white px-4 py-2 d-flex align-items-center justify-content-center" style={{ background: 'var(--mubs-blue)' }} onClick={() => alert('Toast: Report submitted successfully!')}>
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>send</span>Submit Report
                                    </button>
                                    <button className="btn btn-outline-secondary fw-bold d-flex align-items-center justify-content-center" onClick={() => alert('Toast: Draft saved.')}>
                                        <span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>save</span>Save Draft
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips & recent submissions */}
                <div className="col-12 col-lg-5 d-flex flex-column gap-4">
                    <div className="table-card">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: '#b45309' }}>tips_and_updates</span>Submission Tips</h5></div>
                        <div className="p-4">
                            <div className="d-flex gap-3 mb-3 align-items-start">
                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>link</span></div>
                                <div><div className="fw-bold text-dark" style={{ fontSize: '.84rem' }}>Include Evidence Links</div><div className="text-muted" style={{ fontSize: '.76rem' }}>Attach a Google Drive or SharePoint link to photos, spreadsheets, or documents supporting your report.</div></div>
                            </div>
                            <div className="d-flex gap-3 mb-3 align-items-start">
                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#059669' }}>fact_check</span></div>
                                <div><div className="fw-bold text-dark" style={{ fontSize: '.84rem' }}>Be Specific</div><div className="text-muted" style={{ fontSize: '.76rem' }}>State what was done, quantities, dates and any obstacles clearly. Vague reports often get returned for revision.</div></div>
                            </div>
                            <div className="d-flex gap-3 mb-3 align-items-start">
                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fef9c3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>schedule</span></div>
                                <div><div className="fw-bold text-dark" style={{ fontSize: '.84rem' }}>Submit Before Deadline</div><div className="text-muted" style={{ fontSize: '.76rem' }}>Late submissions affect your evaluation score. Use Progress Updates if a task isn't yet complete.</div></div>
                            </div>
                            <div className="d-flex gap-3 align-items-start">
                                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0' }}><span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-red)' }}>report_problem</span></div>
                                <div><div className="fw-bold text-dark" style={{ fontSize: '.84rem' }}>Report Blockers Early</div><div className="text-muted" style={{ fontSize: '.76rem' }}>If you're facing an issue, submit an "Issue / Blocker" report immediately — don't wait for the deadline.</div></div>
                            </div>
                        </div>
                    </div>

                    <div className="table-card">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history</span>Recent Submissions</h5></div>
                        <div className="p-3 d-flex flex-column gap-2">
                            <div className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '22px' }}>check_circle</span>
                                <div className="flex-fill"><div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Lab Setup Report — Phase 1</div><div className="text-muted" style={{ fontSize: '.73rem' }}>Today · Under Review</div></div>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '22px' }}>check_circle</span>
                                <div className="flex-fill"><div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Budget Estimate</div><div className="text-muted" style={{ fontSize: '.73rem' }}>08 Apr · Score: 5/5</div></div>
                            </div>
                            <div className="d-flex align-items-center gap-3 p-2 rounded" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '22px' }}>check_circle</span>
                                <div className="flex-fill"><div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>Obtain Principal Approval</div><div className="text-muted" style={{ fontSize: '.73rem' }}>05 Apr · Score: 4/5</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
