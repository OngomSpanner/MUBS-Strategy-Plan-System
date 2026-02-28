"use client";

import Link from 'next/link';

export default function CommRejected() {
    return (
        <div className="content-area-comm">
            <div className="alert d-flex align-items-center gap-2 mb-4" style={{ background: '#fff1f2', border: '1px solid #fecaca', borderLeft: '5px solid var(--mubs-red)', borderRadius: '10px', color: '#7f1d1d' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
                <div>These proposals were <strong>rejected</strong> by the Principal or Admin. Review the feedback below. You may revise and resubmit where applicable.</div>
            </div>

            {/* Rejected 1 */}
            <div className="proposal-card rejected mb-3">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon" style={{ background: 'rgba(227,24,55,.08)', borderColor: 'rgba(227,24,55,.15)' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>gavel</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="proposal-title">Third-Party Accreditation Programme</div>
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Rejected</span>
                        </div>
                        <div className="proposal-meta">Meeting #7 · Submitted 01 Apr · Rejected 08 Apr 2025 by: Principal Prof. R. Wamala</div>

                        {/* Rejection feedback */}
                        <div className="mt-3 p-3 rounded" style={{ background: '#fff1f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--mubs-red)' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-red)' }}>feedback</span>
                                <span className="fw-black text-dark" style={{ fontSize: '.85rem' }}>Rejection Reason &amp; Feedback</span>
                            </div>
                            <p style={{ fontSize: '.84rem', color: '#7f1d1d', margin: 0, lineHeight: 1.65 }}>"This proposal conflicts with NCHE regulations that restrict private institutions from granting third-party accreditation authority. Additionally, the financial model presented underestimates operational costs by approximately 40%. The committee is advised to engage NCHE directly before resubmitting."</p>
                            <div className="text-muted mt-2" style={{ fontSize: '.73rem' }}>— Principal Prof. R. Wamala · 08 Apr 2025</div>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            <Link href="/comm?pg=propose" className="btn btn-sm fw-bold text-white" style={{ background: '#7c3aed' }}>
                                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>edit</span>Revise &amp; Resubmit
                            </Link>
                            <button className="btn btn-sm btn-outline-secondary fw-bold">
                                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>description</span>View Minutes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rejected 2 */}
            <div className="proposal-card rejected">
                <div className="d-flex align-items-start gap-3 flex-wrap">
                    <div className="activity-icon" style={{ background: 'rgba(227,24,55,.08)', borderColor: 'rgba(227,24,55,.15)' }}><span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>flight</span></div>
                    <div className="flex-fill">
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                            <div className="proposal-title">External Examiner Travel Allowance</div>
                            <span className="status-badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>Rejected</span>
                        </div>
                        <div className="proposal-meta">Meeting #6 · Submitted 25 Mar · Rejected 01 Apr 2025 by: Admin</div>
                        <div className="mt-3 p-3 rounded" style={{ background: '#fff1f2', border: '1px solid #fecaca', borderLeft: '4px solid var(--mubs-red)' }}>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-red)' }}>feedback</span>
                                <span className="fw-black text-dark" style={{ fontSize: '.85rem' }}>Rejection Reason &amp; Feedback</span>
                            </div>
                            <p style={{ fontSize: '.84rem', color: '#7f1d1d', margin: 0, lineHeight: 1.65 }}>"Travel allowance structures fall under the Staff Welfare policy domain, not strategic activities. This item should be routed through the Human Resources department as a policy revision request rather than proposed as a strategic activity. The committee may resubmit it as a separate HR policy memo."</p>
                            <div className="text-muted mt-2" style={{ fontSize: '.73rem' }}>— Admin Office · 01 Apr 2025</div>
                        </div>
                        <div className="d-flex gap-2 mt-3 flex-wrap">
                            <button className="btn btn-sm btn-outline-secondary fw-bold" onClick={() => alert('Redirected to HR memo process.')}>
                                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>open_in_new</span>Route to HR Policy
                            </button>
                            <button className="btn btn-sm btn-outline-secondary fw-bold">
                                <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>description</span>View Minutes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
