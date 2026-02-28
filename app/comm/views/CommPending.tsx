"use client";

export default function CommPending() {
    return (
        <div className="content-area-comm">
            <div className="alert d-flex align-items-center gap-2 mb-4" style={{ background: '#fffbeb', border: '1px solid #fde68a', borderLeft: '5px solid var(--mubs-yellow)', borderRadius: '10px', color: '#713f12' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>hourglass_top</span>
                <div><strong>4 proposals</strong> are currently awaiting review. Once the Principal makes a decision, you will be notified by email and in-system.</div>
            </div>

            <div className="d-flex flex-column gap-0">

                {/* Pending 1 */}
                <div className="proposal-card pending">
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div className="activity-icon"><span className="material-symbols-outlined">smart_toy</span></div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <div className="proposal-title">AI Integration Policy for Teaching</div>
                                <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending — Principal Review</span>
                            </div>
                            <div className="proposal-meta">Meeting #8 · Proposed 10 Apr 2025 · Pillar: Teaching &amp; Learning · Priority: High</div>

                            <div className="stepper mt-3 mb-2" style={{ maxWidth: '420px' }}>
                                <div className="step done"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></div><div className="step-label">Submitted</div></div>
                                <div className="step done"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></div><div className="step-label">Admin</div></div>
                                <div className="step active-step"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>gavel</span></div><div className="step-label">Principal</div></div>
                                <div className="step"><div className="step-dot">4</div><div className="step-label">Decision</div></div>
                            </div>
                            <div className="d-flex align-items-center gap-2 mt-1">
                                <span style={{ fontSize: '.73rem', background: '#f5f3ff', color: '#6d28d9', padding: '.18rem .55rem', borderRadius: '99px', fontWeight: 700 }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>description</span> Minutes attached</span>
                                <span style={{ fontSize: '.73rem', background: '#eff6ff', color: 'var(--mubs-blue)', padding: '.18rem .55rem', borderRadius: '99px', fontWeight: 700 }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>link</span> Evidence linked</span>
                            </div>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary fw-bold">View Details</button>
                    </div>
                </div>

                {/* Pending 2 */}
                <div className="proposal-card pending">
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div className="activity-icon"><span className="material-symbols-outlined">payments</span></div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <div className="proposal-title">Student Fee Restructuring 2025–26</div>
                                <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending — Admin Review</span>
                            </div>
                            <div className="proposal-meta">Meeting #9 · Proposed 12 Apr 2025 · Pillar: Finance &amp; Resources · Priority: High</div>
                            <div className="stepper mt-3 mb-2" style={{ maxWidth: '420px' }}>
                                <div className="step done"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></div><div className="step-label">Submitted</div></div>
                                <div className="step active-step"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>manage_accounts</span></div><div className="step-label">Admin</div></div>
                                <div className="step"><div className="step-dot">3</div><div className="step-label">Principal</div></div>
                                <div className="step"><div className="step-dot">4</div><div className="step-label">Decision</div></div>
                            </div>
                            <span style={{ fontSize: '.73rem', background: '#f5f3ff', color: '#6d28d9', padding: '.18rem .55rem', borderRadius: '99px', fontWeight: 700 }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>description</span> Minutes attached</span>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary fw-bold">View Details</button>
                    </div>
                </div>

                {/* Pending 3 */}
                <div className="proposal-card pending">
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div className="activity-icon"><span className="material-symbols-outlined">handshake</span></div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <div className="proposal-title">Industry MoU Framework</div>
                                <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending — Admin Review</span>
                            </div>
                            <div className="proposal-meta">Meeting #9 · Proposed 12 Apr 2025 · Pillar: Industry Partnerships · Priority: Medium</div>
                            <div className="stepper mt-3 mb-2" style={{ maxWidth: '420px' }}>
                                <div className="step done"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></div><div className="step-label">Submitted</div></div>
                                <div className="step active-step"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>manage_accounts</span></div><div className="step-label">Admin</div></div>
                                <div className="step"><div className="step-dot">3</div><div className="step-label">Principal</div></div>
                                <div className="step"><div className="step-dot">4</div><div className="step-label">Decision</div></div>
                            </div>
                            <span style={{ fontSize: '.73rem', background: '#f5f3ff', color: '#6d28d9', padding: '.18rem .55rem', borderRadius: '99px', fontWeight: 700 }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>description</span> Minutes attached</span>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary fw-bold">View Details</button>
                    </div>
                </div>

                {/* Pending 4 */}
                <div className="proposal-card pending">
                    <div className="d-flex align-items-start gap-3 flex-wrap">
                        <div className="activity-icon"><span className="material-symbols-outlined">volunteer_activism</span></div>
                        <div className="flex-fill">
                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                <div className="proposal-title">Staff Welfare Programme</div>
                                <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207' }}>Pending — Admin Review</span>
                            </div>
                            <div className="proposal-meta">Meeting #8 · Proposed 10 Apr 2025 · Pillar: Governance · Priority: Low</div>
                            <div className="stepper mt-3 mb-2" style={{ maxWidth: '420px' }}>
                                <div className="step done"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check</span></div><div className="step-label">Submitted</div></div>
                                <div className="step active-step"><div className="step-dot"><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>manage_accounts</span></div><div className="step-label">Admin</div></div>
                                <div className="step"><div className="step-dot">3</div><div className="step-label">Principal</div></div>
                                <div className="step"><div className="step-dot">4</div><div className="step-label">Decision</div></div>
                            </div>
                            <span style={{ fontSize: '.73rem', background: '#f5f3ff', color: '#6d28d9', padding: '.18rem .55rem', borderRadius: '99px', fontWeight: 700 }}><span className="material-symbols-outlined" style={{ fontSize: '13px' }}>description</span> Minutes attached</span>
                        </div>
                        <button className="btn btn-sm btn-outline-secondary fw-bold">View Details</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
