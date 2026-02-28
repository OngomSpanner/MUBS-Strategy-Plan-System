'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Evaluation {
    id: number;
    report_name: string;
    activity_title: string;
    staff_name: string;
    submitted_at: string;
    status: string;
    progress: number;
    report_summary: string;
}

interface EvaluationData {
    pending: Evaluation[];
    completed: Evaluation[];
}

export default function UnitEvaluations() {
    const [data, setData] = useState<EvaluationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [scores, setScores] = useState<{ [key: number]: number }>({});
    const [comments, setComments] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/unit-head/evaluations');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching unit evaluations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const handleScore = (id: number, score: number) => {
        setScores(prev => ({ ...prev, [id]: score }));
    };

    const handleComment = (id: number, comment: string) => {
        setComments(prev => ({ ...prev, [id]: comment }));
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
    };

    return (
        <div id="page-evaluations" className="page-section active-page">
            <div className="table-card mb-4 shadow-sm border-0" style={{ borderTop: '4px solid var(--mubs-yellow)' }}>
                <div className="table-card-header" style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7' }}>
                    <h5 className="mb-0 fw-black text-dark d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined text-warning" style={{ fontSize: '24px' }}>pending_actions</span>
                        Pending Evaluations
                        <span className="badge rounded-pill bg-warning text-dark ms-2" style={{ fontSize: '.75rem' }}>
                            {data.pending.length} to review
                        </span>
                    </h5>
                </div>
                <div className="p-0">
                    {data.pending.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <span className="material-symbols-outlined d-block mb-2" style={{ fontSize: '48px', opacity: .3 }}>task_alt</span>
                            All caught up! No pending evaluations.
                        </div>
                    ) : (
                        data.pending.map((evalItem) => (
                            <div key={evalItem.id} className="p-4 border-bottom last-child-no-border">
                                <div className="d-flex align-items-start gap-4 flex-wrap">
                                    <div className="staff-avatar" style={{
                                        background: 'var(--mubs-blue)',
                                        width: '48px',
                                        height: '48px',
                                        fontSize: '1rem',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 'bold'
                                    }}>
                                        {getInitials(evalItem.staff_name)}
                                    </div>
                                    <div className="flex-fill">
                                        <div className="d-flex align-items-center gap-3 flex-wrap mb-1">
                                            <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>
                                                {evalItem.staff_name} — {evalItem.report_name}
                                            </div>
                                            <span className="status-badge" style={{ background: '#fef9c3', color: '#a16207', fontSize: '.65rem' }}>
                                                {evalItem.status}
                                            </span>
                                        </div>
                                        <div className="text-muted small" style={{ fontSize: '.8rem' }}>
                                            Activity: {evalItem.activity_title} · Submitted: {formatDate(evalItem.submitted_at)}
                                        </div>

                                        <div className="mt-3 p-3 rounded-3 bg-light border border-light-subtle">
                                            <div className="fw-bold text-dark mb-1 small" style={{ letterSpacing: '.02em' }}>REPORT SUMMARY</div>
                                            <p className="mb-0 text-secondary" style={{ fontSize: '.85rem', lineHeight: 1.6 }}>
                                                {evalItem.report_summary || 'No summary provided in report.'}
                                            </p>
                                        </div>

                                        <div className="mt-4 row g-4 align-items-center">
                                            <div className="col-12 col-md-4">
                                                <div className="fw-bold text-dark mb-2 small">QUALITY SCORE (1–5)</div>
                                                <div className="d-flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button
                                                            key={star}
                                                            onClick={() => handleScore(evalItem.id, star)}
                                                            className="btn p-0 border-0"
                                                            style={{
                                                                color: star <= (scores[evalItem.id] || 0) ? '#f59e0b' : '#e2e8f0',
                                                                transition: 'color 0.2s'
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '28px', fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="text-muted small mt-1" style={{ fontSize: '.7rem' }}>
                                                    {scores[evalItem.id] ? `Rating: ${scores[evalItem.id]}/5` : 'Click to rate'}
                                                </div>
                                            </div>
                                            <div className="col-12 col-md-8">
                                                <div className="fw-bold text-dark mb-2 small">EVALUATOR COMMENTS</div>
                                                <textarea
                                                    className="form-control form-control-sm border-light-subtle"
                                                    rows={2}
                                                    placeholder="Add feedback or instructions for improvement..."
                                                    value={comments[evalItem.id] || ''}
                                                    onChange={(e) => handleComment(evalItem.id, e.target.value)}
                                                    style={{ borderRadius: '10px' }}
                                                ></textarea>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-4 flex-wrap">
                                            <button className="btn btn-primary fw-bold px-4 d-flex align-items-center gap-2" style={{ borderRadius: '10px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                                                Submit Evaluation
                                            </button>
                                            <button className="btn btn-outline-danger fw-bold px-4 d-flex align-items-center gap-2" style={{ borderRadius: '10px' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>reply</span>
                                                Return for Revision
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="table-card shadow-sm border-0">
                <div className="table-card-header bg-white border-bottom py-3 px-4">
                    <h5 className="mb-0 fw-black text-dark d-flex align-items-center gap-2">
                        <span className="material-symbols-outlined text-primary">history_edu</span>
                        Recent Evaluations
                    </h5>
                    <button className="btn btn-sm btn-outline-success fw-bold ms-auto d-flex align-items-center gap-2 px-3">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                        Export
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Staff</th>
                                <th>Report / Task</th>
                                <th>Date Evaluated</th>
                                <th>Score</th>
                                <th>Outcome</th>
                                <th className="pe-4 text-end">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.completed.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-muted small">No completed evaluations found.</td>
                                </tr>
                            ) : (
                                data.completed.map((e) => (
                                    <tr key={e.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-2 py-1">
                                                <div className="staff-avatar" style={{
                                                    background: '#64748b',
                                                    width: '28px',
                                                    height: '28px',
                                                    borderRadius: '6px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    fontSize: '.65rem'
                                                }}>
                                                    {getInitials(e.staff_name)}
                                                </div>
                                                <span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>{e.staff_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '.83rem' }}>{e.report_name}</td>
                                        <td style={{ fontSize: '.8rem', color: '#64748b' }}>{formatDate(e.submitted_at)}</td>
                                        <td>
                                            <span className="score-badge d-flex align-items-center gap-1" style={{
                                                background: e.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                                                color: e.status === 'Completed' ? '#15803d' : '#b91c1c',
                                                fontSize: '.75rem',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                fontWeight: 700
                                            }}>
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} className="material-symbols-outlined" style={{ fontSize: '10px', fontVariationSettings: "'FILL' 1" }}>star</span>)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="status-badge" style={{
                                                background: e.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                                                color: e.status === 'Completed' ? '#15803d' : '#b91c1c',
                                                fontSize: '.65rem'
                                            }}>{e.status === 'Completed' ? 'Accepted' : 'Returned'}</span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button className="btn btn-sm btn-icon border-0 bg-light p-2" title="View Details">
                                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
