'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '@/components/StatCard';

interface Submission {
    id: number;
    report_name: string;
    activity_title: string;
    staff_name: string;
    submitted_at: string;
    status: string;
    progress: number;
}

interface SubmissionData {
    submissions: Submission[];
    stats: {
        pending: number;
        underReview: number;
        reviewed: number;
        returned: number;
    };
    recentActivity: Array<{
        id: number;
        type: string;
        message: string;
        date: string;
    }>;
}

export default function UnitSubmissions() {
    const [data, setData] = useState<SubmissionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [staffFilter, setStaffFilter] = useState('All Staff');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/unit-head/submissions');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching unit submissions:', error);
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

    const filteredSubmissions = data.submissions.filter(s => {
        const matchesStatus = statusFilter === 'All Status' || s.status === statusFilter;
        const matchesStaff = staffFilter === 'All Staff' || s.staff_name === staffFilter;
        return matchesStatus && matchesStaff;
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const staffMembers = [...new Set(data.submissions.map(s => s.staff_name))].filter(Boolean);

    return (
        <div id="page-submissions" className="page-section active-page">
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="pending_actions"
                        label="Pending"
                        value={data.stats.pending}
                        badge="New"
                        badgeIcon="fiber_new"
                        color="yellow"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="rate_review"
                        label="Under Review"
                        value={data.stats.underReview}
                        badge="Active"
                        badgeIcon="sync"
                        color="blue"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="task_alt"
                        label="Reviewed"
                        value={data.stats.reviewed}
                        badge="Complete"
                        badgeIcon="verified"
                        color="green"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="assignment_return"
                        label="Returned"
                        value={data.stats.returned}
                        badge="Action"
                        badgeIcon="reply"
                        color="red"
                    />
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-lg-8">
                    <div className="table-card shadow-sm border-0">
                        <div className="table-card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-black text-dark d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">inbox</span>
                                All Submissions
                            </h5>
                            <div className="d-flex gap-2 flex-wrap ms-auto">
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '140px' }}
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option>All Status</option>
                                    <option>Pending</option>
                                    <option>Under Review</option>
                                    <option>Completed</option>
                                    <option>Returned</option>
                                </select>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '140px' }}
                                    value={staffFilter}
                                    onChange={(e) => setStaffFilter(e.target.value)}
                                >
                                    <option>All Staff</option>
                                    {staffMembers.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table mb-0 align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">Staff</th>
                                        <th>Report / Task</th>
                                        <th>Activity</th>
                                        <th>Submitted</th>
                                        <th>Status</th>
                                        <th className="pe-4 text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubmissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5 text-muted">No submissions found.</td>
                                        </tr>
                                    ) : (
                                        filteredSubmissions.map((s) => (
                                            <tr key={s.id}>
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center gap-2 py-1">
                                                        <div className="staff-avatar" style={{
                                                            background: 'var(--mubs-blue)',
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            fontSize: '.75rem'
                                                        }}>
                                                            {s.staff_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                                                        </div>
                                                        <span className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>{s.staff_name}</span>
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>{s.report_name}</td>
                                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>{s.activity_title}</td>
                                                <td style={{ fontSize: '.78rem', color: '#64748b' }}>{formatDate(s.submitted_at)}</td>
                                                <td>
                                                    <span className="status-badge" style={{
                                                        background: s.status === 'Completed' ? '#dcfce7' : (s.status === 'Under Review' ? '#eff6ff' : (s.status === 'Returned' ? '#fee2e2' : '#fef9c3')),
                                                        color: s.status === 'Completed' ? '#15803d' : (s.status === 'Under Review' ? '#1d4ed8' : (s.status === 'Returned' ? '#b91c1c' : '#a16207')),
                                                        fontSize: '0.65rem'
                                                    }}>{s.status}</span>
                                                </td>
                                                <td className="pe-4 text-end">
                                                    {s.status === 'Pending' || s.status === 'Under Review' ? (
                                                        <button className="btn btn-sm btn-primary fw-bold py-1 px-3 d-inline-flex align-items-center gap-1" style={{ fontSize: '.74rem', borderRadius: '8px' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rate_review</span> Evaluate
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-secondary fw-bold py-1 px-3 d-inline-flex align-items-center gap-1" style={{ fontSize: '.74rem', borderRadius: '8px' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span> View
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="table-card-footer border-top py-3 px-4">
                            <span className="footer-label small text-muted">Showing {filteredSubmissions.length} of {data.submissions.length} submissions</span>
                        </div>
                    </div>
                </div>

                {/* Submission timeline */}
                <div className="col-12 col-lg-4">
                    <div className="table-card shadow-sm border-0 h-100">
                        <div className="table-card-header bg-white border-bottom py-3">
                            <h5 className="mb-0 fw-black text-dark d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Recent Activity
                            </h5>
                        </div>
                        <div className="p-4">
                            {data.recentActivity.length === 0 ? (
                                <div className="text-center py-4 text-muted small">No recent activity.</div>
                            ) : (
                                data.recentActivity.map((activity, idx) => (
                                    <div key={idx} className="timeline-item mb-4 pb-4 border-start ps-4 position-relative" style={{ borderLeftStyle: 'dashed !important' }}>
                                        <div className="timeline-dot position-absolute" style={{
                                            left: '-10px',
                                            top: '0',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            background: (activity.type === 'Completed' ? '#dcfce7' : (activity.type === 'Returned' ? '#fee2e2' : '#fef9c3')),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid white',
                                            boxShadow: '0 0 0 1px #e2e8f0'
                                        }}>
                                            <span className="material-symbols-outlined" style={{
                                                fontSize: '12px',
                                                color: (activity.type === 'Completed' ? '#15803d' : (activity.type === 'Returned' ? '#b91c1c' : '#a16207'))
                                            }}>
                                                {activity.type === 'Completed' ? 'check_circle' : (activity.type === 'Returned' ? 'reply' : 'inbox')}
                                            </span>
                                        </div>
                                        <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>{activity.message}</div>
                                        <div className="text-muted small mt-1" style={{ fontSize: '.73rem' }}>{formatDate(activity.date)}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
