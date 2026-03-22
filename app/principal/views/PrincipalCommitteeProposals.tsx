'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { linkify } from '@/lib/linkify';

/** Extract /uploads/... paths from text for download links */
function extractUploadPaths(text: string | null | undefined): string[] {
    if (text == null || typeof text !== 'string') return [];
    const re = /\/uploads\/[^\s\]\)\"']+/g;
    const out: string[] = [];
    let m;
    while ((m = re.exec(text)) !== null) {
        const path = m[0];
        if (!out.includes(path)) out.push(path);
    }
    return out;
}

function fileNameFromPath(path: string): string {
    try {
        const segment = path.split('/').pop() || '';
        const withoutStamp = segment.replace(/^[0-9]+-?/, '');
        return decodeURIComponent(withoutStamp || segment || 'Document');
    } catch {
        return 'Document';
    }
}

interface CommitteeProposal {
    id: number;
    title: string;
    status: string;
    committee_type?: string;
    department_name?: string;
    department_id?: number | null;
    date: string | null;
    description?: string | null;
    minute_reference?: string | null;
    budget?: number | null;
    submitted_by_name?: string | null;
}

const COMMITTEE_TYPES = ['Council', 'TMC', 'Academic Board', 'Other'];

export default function PrincipalCommitteeProposals() {
    const [proposals, setProposals] = useState<CommitteeProposal[]>([]);
    const [loading, setLoading] = useState(true);
    const [committeeFilter, setCommitteeFilter] = useState<string>('All');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<CommitteeProposal | null>(null);
    const [reviewerNotes, setReviewerNotes] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState<'approve' | 'reject' | null>(null);
    const [reviewError, setReviewError] = useState<string | null>(null);

    const fetchProposals = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/principal/committee-proposals');
            setProposals(Array.isArray(res.data) ? res.data : []);
        } catch {
            setProposals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const filtered = committeeFilter === 'All'
        ? proposals
        : proposals.filter((p) => p.committee_type === committeeFilter);

    const openReviewModal = (p: CommitteeProposal) => {
        setSelectedProposal(p);
        setReviewerNotes('');
        setReviewError(null);
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setSelectedProposal(null);
        setReviewSubmitting(null);
        setReviewError(null);
    };

    const submitReview = async (action: 'Approved' | 'Rejected') => {
        if (!selectedProposal) return;
        setReviewError(null);
        setReviewSubmitting(action === 'Approved' ? 'approve' : 'reject');
        try {
            await axios.patch(`/api/principal/committee-proposals/${selectedProposal.id}`, {
                action,
                reviewer_notes: reviewerNotes.trim() || undefined
            });
            await fetchProposals();
            closeReviewModal();
        } catch (err: any) {
            setReviewError(err?.response?.data?.message || 'Request failed. Please try again.');
        } finally {
            setReviewSubmitting(null);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div id="page-proposals" className="page-section active-page">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <h5 className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                    <span className="material-symbols-outlined" style={{ color: '#7c3aed' }}>gavel</span>
                    Review committee proposals
                </h5>
                <div className="d-flex align-items-center gap-2">
                    <label className="text-muted small mb-0 me-2">Committee</label>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '160px' }}
                        value={committeeFilter}
                        onChange={(e) => setCommitteeFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        {COMMITTEE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            <p className="text-muted mb-4">Proposals recommended by Strategy Manager (strategic alignment check done). Approve to assign department and add to strategic activities, or reject / request edits with feedback.</p>

            <div className="table-card bg-white rounded-3 shadow-sm border overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Title</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Committee</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Department</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Submitted by</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ fontSize: '.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', width: '100px' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-muted">
                                        No proposals pending review.{committeeFilter !== 'All' ? ' Try "All" for committee.' : ''}
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id}>
                                        <td className="fw-bold text-dark" style={{ fontSize: '.9rem', maxWidth: '280px' }}>{p.title}</td>
                                        <td>
                                            {p.committee_type ? (
                                                <span className="badge bg-light text-dark border">{p.committee_type}</span>
                                            ) : (
                                                <span className="text-muted">—</span>
                                            )}
                                        </td>
                                        <td style={{ fontSize: '.85rem' }}>{p.department_name ?? '—'}</td>
                                        <td style={{ fontSize: '.85rem' }}>{p.submitted_by_name ?? '—'}</td>
                                        <td style={{ fontSize: '.85rem' }}>{p.date ?? '—'}</td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: p.status === 'Edit Requested' ? '#fef3c7' : '#e0e7ff',
                                                    color: p.status === 'Edit Requested' ? '#92400e' : '#3730a3',
                                                    fontSize: '.7rem'
                                                }}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-sm fw-bold text-white"
                                                style={{ background: '#7c3aed' }}
                                                onClick={() => openReviewModal(p)}
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {filtered.length > 0 && (
                    <div className="table-card-footer d-flex justify-content-between align-items-center px-3 py-2 border-top bg-light">
                        <span className="text-muted small">Showing {filtered.length} proposal{filtered.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* Review modal */}
            {reviewModalOpen && selectedProposal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ color: '#7c3aed' }}>gavel</span>
                                    Review committee proposal
                                </h5>
                                <button type="button" className="btn-close" onClick={closeReviewModal} aria-label="Close" disabled={!!reviewSubmitting} />
                            </div>
                            <div className="modal-body pt-2">
                                <div className="mb-3">
                                    <span className="text-muted small d-block">Title</span>
                                    <span className="fw-bold text-dark">{selectedProposal.title}</span>
                                </div>
                                <div className="d-flex flex-wrap gap-3 mb-3">
                                    {selectedProposal.committee_type && (
                                        <div>
                                            <span className="text-muted small d-block">Committee</span>
                                            <span className="badge bg-light text-dark">{selectedProposal.committee_type}</span>
                                        </div>
                                    )}
                                    {selectedProposal.department_name && (
                                        <div>
                                            <span className="text-muted small d-block">Department</span>
                                            <span className="text-dark">{selectedProposal.department_name}</span>
                                        </div>
                                    )}
                                    {selectedProposal.submitted_by_name && (
                                        <div>
                                            <span className="text-muted small d-block">Submitted by</span>
                                            <span className="text-dark">{selectedProposal.submitted_by_name}</span>
                                        </div>
                                    )}
                                    {selectedProposal.date && (
                                        <div>
                                            <span className="text-muted small d-block">Date</span>
                                            <span className="text-dark">{selectedProposal.date}</span>
                                        </div>
                                    )}
                                </div>
                                {(() => {
                                    const paths = [
                                        ...extractUploadPaths(selectedProposal.description),
                                        ...extractUploadPaths(selectedProposal.minute_reference ?? ''),
                                    ].filter((p, i, a) => a.indexOf(p) === i);
                                    if (paths.length === 0) return null;
                                    return (
                                        <div className="mb-3 p-3 rounded-3 border" style={{ background: '#f8fafc' }}>
                                            <span className="text-muted small d-block mb-2">
                                                <span className="material-symbols-outlined align-text-bottom me-1" style={{ fontSize: '16px' }}>attach_file</span>
                                                Attached documents
                                            </span>
                                            <div className="d-flex flex-column gap-2">
                                                {paths.map((path) => (
                                                    <a
                                                        key={path}
                                                        href={path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="d-flex align-items-center gap-2 text-primary text-decoration-none fw-bold"
                                                        style={{ fontSize: '.9rem' }}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                                                        Download — {fileNameFromPath(path)}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                                {selectedProposal.description && (
                                    <div className="mb-3">
                                        <span className="text-muted small d-block">Description</span>
                                        <div className="mb-0 text-dark" style={{ fontSize: '.9rem', wordBreak: 'break-word' }}>{linkify(selectedProposal.description)}</div>
                                    </div>
                                )}
                                {(selectedProposal.minute_reference || (selectedProposal.budget != null && selectedProposal.budget !== 0)) && (
                                    <div className="d-flex flex-wrap gap-3 mb-3">
                                        {selectedProposal.minute_reference && (
                                            <div style={{ wordBreak: 'break-word' }}>
                                                <span className="text-muted small d-block">Minute reference</span>
                                                <span className="text-dark">{linkify(selectedProposal.minute_reference)}</span>
                                            </div>
                                        )}
                                        {selectedProposal.budget != null && selectedProposal.budget !== 0 && (
                                            <div>
                                                <span className="text-muted small d-block">Budget</span>
                                                <span className="text-dark">{Number(selectedProposal.budget).toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label text-muted small">Reviewer notes (optional)</label>
                                    <textarea
                                        className="form-control"
                                        rows={2}
                                        placeholder="Add notes for the committee or for records..."
                                        value={reviewerNotes}
                                        onChange={(e) => setReviewerNotes(e.target.value)}
                                        disabled={!!reviewSubmitting}
                                    />
                                </div>
                                {reviewError && (
                                    <div className="alert alert-danger py-2 mb-3" role="alert">{reviewError}</div>
                                )}
                            </div>
                            <div className="modal-footer border-0 pt-0">

                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => submitReview('Rejected')}
                                    disabled={!!reviewSubmitting}
                                >
                                    {reviewSubmitting === 'reject' ? 'Rejecting…' : 'Reject'}
                                </button>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    style={{ background: '#7c3aed' }}
                                    onClick={() => submitReview('Approved')}
                                    disabled={!!reviewSubmitting}
                                >
                                    {reviewSubmitting === 'approve' ? 'Approving…' : 'Approve & add to strategic activities'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
