'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import StatCard from '@/components/StatCard';
import Link from 'next/link';

interface CommitteeData {
    stats: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    };
    proposals: Array<{
        title: string;
        status: string;
        date: string;
        meta: string;
    }>;
    activity: Array<{
        description: string;
        timestamp: string;
        icon: string;
        bgColor: string;
        iconColor: string;
    }>;
}

export default function CommitteeDashboard() {
    const [data, setData] = useState<CommitteeData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/dashboard/committee');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching committee dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!loading && data) {
            // Animate approval arc on load
            const arc = document.getElementById('approvalArc');
            if (arc) {
                const total = data.stats.total || 1;
                const approved = data.stats.approved || 0;
                const percentage = (approved / total) * 100;
                const offset = 377 - (377 * percentage) / 100;

                setTimeout(() => {
                    const arcElement = arc as unknown as SVGPathElement;
                    arcElement.style.transition = 'stroke-dashoffset 1.2s ease';
                    arcElement.setAttribute('stroke-dashoffset', offset.toString());
                }, 400);
            }
        }
    }, [loading, data]);

    if (loading || !data) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const { stats, proposals, activity } = data;
    const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

    return (
        <div id="page-dashboard" className="page-section active-page">
            {/* Hero banner */}
            <div className="p-4 mb-4 rounded-3 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="material-symbols-outlined" style={{ color: '#93c5fd', fontSize: '28px' }}>groups</span>
                            <div>
                                <h4 className="fw-bold mb-0">Committee Overview</h4>
                                <p className="mb-0 opacity-75" style={{ color: '#93c5fd' }}>Academic Board Committee Dashboard</p>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-4 text-center flex-wrap">
                        <div>
                            <div className="fw-black" style={{ fontSize: '2rem', lineHeight: 1 }}>{stats.total}</div>
                            <div className="text-uppercase opacity-75" style={{ fontSize: '.65rem', letterSpacing: '.1em' }}>Total Proposals</div>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,.1)' }}></div>
                        <div>
                            <div className="fw-black" style={{ fontSize: '2rem', lineHeight: 1, color: '#4ade80' }}>{stats.approved}</div>
                            <div className="text-uppercase opacity-75" style={{ fontSize: '.65rem', letterSpacing: '.1em' }}>Approved</div>
                        </div>
                        <div style={{ width: '1px', background: 'rgba(255,255,255,.1)' }}></div>
                        <div>
                            <div className="fw-black" style={{ fontSize: '2rem', lineHeight: 1, color: '#fbbf24' }}>{stats.pending}</div>
                            <div className="text-uppercase opacity-75" style={{ fontSize: '.65rem', letterSpacing: '.1em' }}>Pending</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="list_alt"
                        label="Total Proposals"
                        value={stats.total}
                        badge="2025"
                        badgeIcon="calendar_today"
                        color="blue"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="pending_actions"
                        label="Pending Review"
                        value={stats.pending}
                        badge="Awaiting"
                        badgeIcon="schedule"
                        color="yellow"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="check_circle"
                        label="Approved"
                        value={stats.approved}
                        badge="Active"
                        badgeIcon="verified"
                        color="green"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="cancel"
                        label="Rejected"
                        value={stats.rejected}
                        badge="Review"
                        badgeIcon="info"
                        color="red"
                    />
                </div>
            </div>

            <div className="row g-4">
                {/* Recent proposals */}
                <div className="col-12 col-lg-8">
                    <div className="table-card mb-4 shadow-sm">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>list_alt</span>Recent Proposals</h5>
                            <Link href="/comm?pg=my-proposals" className="btn btn-sm btn-outline-secondary">View All</Link>
                        </div>
                        <div className="p-3 d-flex flex-column gap-3">
                            {proposals.map((p, index) => (
                                <div key={index} className={`proposal-card ${p.status.toLowerCase()}`}>
                                    <div className="d-flex align-items-start gap-3 flex-wrap">
                                        <div className="activity-icon">
                                            <span className="material-symbols-outlined">
                                                {p.title.toLowerCase().includes('research') ? 'science' :
                                                    p.title.toLowerCase().includes('ai') ? 'smart_toy' : 'description'}
                                            </span>
                                        </div>
                                        <div className="flex-fill">
                                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                                <div className="proposal-title fw-bold" style={{ fontSize: '.85rem' }}>{p.title}</div>
                                                <span className="status-badge" style={{
                                                    background: p.status === 'Approved' ? '#dcfce7' : (p.status === 'Pending' ? '#fef9c3' : '#fee2e2'),
                                                    color: p.status === 'Approved' ? '#15803d' : (p.status === 'Pending' ? '#a16207' : '#b91c1c')
                                                }}>{p.status}</span>
                                            </div>
                                            <div className="proposal-meta text-muted small mt-1">Proposed {p.date} · {p.meta}</div>
                                        </div>
                                        <button className="btn btn-sm btn-outline-primary fw-bold" style={{ fontSize: '.78rem' }}>View</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="table-card shadow-sm">
                        <div className="table-card-header">
                            <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>analytics</span>Proposal Pipeline</h5>
                        </div>
                        <div className="p-4">
                            <div className="row g-3 text-center">
                                <div className="col-3">
                                    <div className="fw-black h2 mb-0" style={{ color: 'var(--mubs-blue)' }}>{stats.total}</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}><div className="progress-bar" style={{ width: '100%', background: 'var(--mubs-blue)' }}></div></div>
                                    <div className="small fw-bold mt-2 opacity-75">Submitted</div>
                                </div>
                                <div className="col-3">
                                    <div className="fw-black h2 mb-0 text-warning">{stats.pending}</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}><div className="progress-bar bg-warning" style={{ width: stats.total > 0 ? `${(stats.pending / stats.total) * 100}%` : '0%' }}></div></div>
                                    <div className="small fw-bold mt-2 opacity-75">Pending</div>
                                </div>
                                <div className="col-3">
                                    <div className="fw-black h2 mb-0 text-success">{stats.approved}</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}><div className="progress-bar bg-success" style={{ width: stats.total > 0 ? `${(stats.approved / stats.total) * 100}%` : '0%' }}></div></div>
                                    <div className="small fw-bold mt-2 opacity-75">Approved</div>
                                </div>
                                <div className="col-3">
                                    <div className="fw-black h2 mb-0 text-danger">{stats.rejected}</div>
                                    <div className="progress mt-2" style={{ height: '6px' }}><div className="progress-bar bg-danger" style={{ width: stats.total > 0 ? `${(stats.rejected / stats.total) * 100}%` : '0%' }}></div></div>
                                    <div className="small fw-bold mt-2 opacity-75">Rejected</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                    <div className="table-card shadow-sm">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>donut_large</span>Approval Rate</h5></div>
                        <div className="p-4 text-center">
                            <div className="position-relative d-inline-flex align-items-center justify-content-center">
                                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="70" cy="70" r="60" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                                    <circle cx="70" cy="70" r="60" fill="none" stroke="#1e3a8a" strokeWidth="12" strokeDasharray="377" strokeDashoffset="377" strokeLinecap="round" id="approvalArc" />
                                </svg>
                                <div className="position-absolute text-center">
                                    <div className="h2 fw-black mb-0">{approvalRate}%</div>
                                    <div className="small text-muted fw-bold">Approved</div>
                                </div>
                            </div>
                            <div className="mt-3 small text-muted fw-semibold">{stats.approved} approved out of {stats.total} total</div>
                        </div>
                    </div>

                    <div className="table-card shadow-sm">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>bolt</span>Quick Actions</h5></div>
                        <div className="p-3 d-flex flex-column gap-2">
                            <Link href="/comm?pg=propose" className="btn btn-outline-primary fw-bold text-start d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>post_add</span> New Proposal from Minutes
                            </Link>
                            <Link href="/comm?pg=pending" className="btn btn-outline-warning fw-bold text-start d-flex align-items-center gap-2 text-dark">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>pending_actions</span> Check Pending Review
                                <span className="badge bg-warning text-dark ms-auto">{stats.pending}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="table-card shadow-sm">
                        <div className="table-card-header"><h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history</span>Recent Activity</h5></div>
                        <div className="p-4">
                            {activity.map((act, index) => (
                                <div key={index} className={`timeline-item ${index > 0 ? 'mt-3' : ''}`}>
                                    <div className="timeline-dot" style={{ background: act.bgColor }}><span className="material-symbols-outlined" style={{ color: act.iconColor }}>{act.icon}</span></div>
                                    <div className="fw-bold text-dark" style={{ fontSize: '.83rem' }}>{act.description}</div>
                                    <div className="text-muted" style={{ fontSize: '.73rem' }}>{act.timestamp}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
