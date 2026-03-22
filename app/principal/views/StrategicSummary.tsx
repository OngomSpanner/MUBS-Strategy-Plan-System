'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { STRATEGIC_PILLARS_2025_2030 } from '@/lib/strategic-plan';

interface DepartmentActivity {
    id: number;
    title: string;
    progress: number;
    status: string;
    pillar: string;
}

interface DepartmentRisk {
    id: number;
    title: string;
    description: string;
    end_date: string;
    daysLeft: number;
}

interface DepartmentDrillDown {
    id: number;
    parent_id: number | null;
    unit_type: string | null;
    name: string;
    head: string | null;
    activitiesCount: number;
    overallProgress: number;
    completedCount: number;
    inProgressCount: number;
    delayedCount: number;
    pillars?: string[];
    recentActivities: DepartmentActivity[];
    risks: DepartmentRisk[];
}

interface PillarPerformance {
    pillar: string;
    totalActivities: number;
    avgProgress: number;
    completed: number;
    inProgress: number;
    delayed: number;
}

interface StrategicSummaryData {
    stats: {
        totalActivities: number;
        onTrack: number;
        inProgress: number;
        delayed: number;
    };
    pillarPerformance?: PillarPerformance[];
    departments: DepartmentDrillDown[];
}

const PILLAR_SHORT: Record<string, string> = {
    'Teaching & Learning': 'Teaching & Learning',
    'Research & Innovation': 'Research & Innovation',
    'Governance': 'Governance',
    'Infrastructure': 'Infrastructure',
    'Partnerships': 'Partnerships',
    'Research, Innovation & Community Engagement': 'Research & Community',
    'Equity & Social Safeguards': 'Equity & Safeguards',
    'Human Capital & Sustainability': 'Human Capital',
    'Partnerships & Internationalisation': 'Partnerships & Intl',
    'Unassigned': 'Unassigned',
};

function shortPillar(name: string): string {
    return PILLAR_SHORT[name] ?? (name.length > 22 ? name.slice(0, 19) + '…' : name);
}

const EMPTY_DATA: StrategicSummaryData = {
    stats: { totalActivities: 0, onTrack: 0, inProgress: 0, delayed: 0 },
    pillarPerformance: [],
    departments: [],
};

export default function StrategicSummary() {
    const [data, setData] = useState<StrategicSummaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pillar' | 'faculties'>('pillar');
    const [expandedUnit, setExpandedUnit] = useState<number | null>(null);
    const [pillarFilter, setPillarFilter] = useState('All Pillars');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [chartMetric, setChartMetric] = useState<'avgProgress' | 'totalActivities'>('avgProgress');

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/principal/strategic-summary');
            const raw = response.data;
            setData({
                stats: raw.stats ?? EMPTY_DATA.stats,
                pillarPerformance: Array.isArray(raw.pillarPerformance) ? raw.pillarPerformance : EMPTY_DATA.pillarPerformance,
                departments: Array.isArray(raw.departments) ? raw.departments : EMPTY_DATA.departments,
            });
        } catch (err: unknown) {
            let message = 'Failed to load strategic summary';
            if (axios.isAxiosError(err) && err.response?.data) {
                const d = err.response.data as { message?: string; detail?: string };
                message = d.message ? String(d.message) : message;
                if (d.detail) message += ` — ${String(d.detail)}`;
            } else if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading && !data) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5 px-3">
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" style={{ maxWidth: '480px' }}>
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                </div>
                <button type="button" className="btn btn-primary" onClick={fetchData}>
                    Try again
                </button>
            </div>
        );
    }

    const safeData = data ?? EMPTY_DATA;
    const departmentsRaw = safeData.departments ?? [];
    const pillarPerformance = safeData.pillarPerformance ?? [];

    const filteredDepartments = departmentsRaw.filter((dept) => {
        if (pillarFilter !== 'All Pillars') {
            const pillars = dept.pillars ?? (dept.recentActivities ?? []).map((a: DepartmentActivity) => a.pillar).filter(Boolean);
            if (!pillars.length || !pillars.includes(pillarFilter)) return false;
        }
        if (statusFilter === 'On Track') {
            const hasOnTrack = (dept.completedCount ?? 0) + (dept.inProgressCount ?? 0) > 0;
            return hasOnTrack;
        }
        if (statusFilter === 'Delayed') return (dept.delayedCount ?? 0) > 0;
        return true;
    });

    const roots = departmentsRaw.filter((d) => d.parent_id == null);
    const childrenByParentId: Record<number, DepartmentDrillDown[]> = {};
    departmentsRaw.forEach((d) => {
        if (d.parent_id != null) {
            if (!childrenByParentId[d.parent_id]) childrenByParentId[d.parent_id] = [];
            childrenByParentId[d.parent_id].push(d);
        }
    });
    const filteredIds = new Set(filteredDepartments.map((d) => d.id));
    const rootsToShow = roots.filter(
        (root) => filteredIds.has(root.id) || (childrenByParentId[root.id] ?? []).some((c) => filteredIds.has(c.id))
    );

    const toggleUnit = (id: number) => {
        setExpandedUnit(expandedUnit === id ? null : id);
    };

    const getPerformanceLabel = (progress: number) => {
        if (progress >= 85) return { label: 'Excellent', bg: '#dcfce7', color: '#15803d' };
        if (progress >= 70) return { label: 'Good', bg: '#fef9c3', color: '#a16207' };
        if (progress >= 50) return { label: 'Fair', bg: '#fde8d8', color: '#c2410c' };
        return { label: 'Critical', bg: '#fee2e2', color: '#b91c1c' };
    };

    const barColor = (value: number) => {
        if (chartMetric === 'totalActivities') return 'var(--mubs-blue)';
        return value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444';
    };

    const chartData = pillarPerformance.map((p) => ({
        name: shortPillar(p.pillar),
        fullName: p.pillar,
        avgProgress: Math.min(100, Math.max(0, p.avgProgress)),
        totalActivities: p.totalActivities,
        completed: p.completed,
        inProgress: p.inProgress,
        delayed: p.delayed,
    }));

    const pillarOptions = Array.from(new Set([...STRATEGIC_PILLARS_2025_2030, ...pillarPerformance.map((p) => p.pillar)]));

    return (
        <div id="page-strategic" className="page-section active-page">
            <div className="alert alert-primary alert-strip alert-dismissible fade show mb-4 d-flex align-items-center gap-2" role="alert" style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1d4ed8' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--mubs-blue)' }}>info</span>
                <div>Live snapshot of the institutional strategic plan. Key metrics are on <Link href="/principal?pg=executive" className="fw-bold text-decoration-underline">Executive Overview</Link>.</div>
                <button type="button" className="btn-close ms-auto" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

            {/* Tab buttons */}
            <ul className="nav nav-pills mb-4 gap-2" role="tablist">
                <li className="nav-item">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'pillar'}
                        className={`nav-link fw-bold ${activeTab === 'pillar' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'pillar' ? 'var(--mubs-blue)' : 'rgba(0,0,0,.06)',
                            color: activeTab === 'pillar' ? '#fff' : '#475569',
                            borderRadius: '10px',
                            fontSize: '.9rem',
                            padding: '10px 20px',
                            border: 'none',
                        }}
                        onClick={() => setActiveTab('pillar')}
                    >
                        <span className="material-symbols-outlined me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>bar_chart</span>
                        Performance by pillar
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={activeTab === 'faculties'}
                        className={`nav-link fw-bold ${activeTab === 'faculties' ? 'active' : ''}`}
                        style={{
                            background: activeTab === 'faculties' ? 'var(--mubs-blue)' : 'rgba(0,0,0,.06)',
                            color: activeTab === 'faculties' ? '#fff' : '#475569',
                            borderRadius: '10px',
                            fontSize: '.9rem',
                            padding: '10px 20px',
                            border: 'none',
                        }}
                        onClick={() => setActiveTab('faculties')}
                    >
                        <span className="material-symbols-outlined me-2" style={{ fontSize: '18px', verticalAlign: 'middle' }}>account_tree</span>
                        Faculties &amp; departments
                    </button>
                </li>
            </ul>

            {/* Filters */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4 p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '.7rem', letterSpacing: '.05em' }}>Filters</span>
                <select
                    className="form-select form-select-sm"
                    style={{ width: '180px', fontSize: '.85rem' }}
                    value={pillarFilter}
                    onChange={(e) => setPillarFilter(e.target.value)}
                >
                    <option value="All Pillars">All pillars</option>
                    {pillarOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
                <select
                    className="form-select form-select-sm"
                    style={{ width: '140px', fontSize: '.85rem' }}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All Statuses">All statuses</option>
                    <option value="On Track">On track</option>
                    <option value="Delayed">Delayed</option>
                </select>
                {activeTab === 'pillar' && (
                    <div className="d-flex align-items-center gap-2 ms-auto">
                        <span className="text-muted small">Chart:</span>
                        <div className="btn-group btn-group-sm" role="group">
                            <button
                                type="button"
                                className={`btn ${chartMetric === 'avgProgress' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={chartMetric === 'avgProgress' ? { background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' } : {}}
                                onClick={() => setChartMetric('avgProgress')}
                            >
                                Avg progress %
                            </button>
                            <button
                                type="button"
                                className={`btn ${chartMetric === 'totalActivities' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                style={chartMetric === 'totalActivities' ? { background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' } : {}}
                                onClick={() => setChartMetric('totalActivities')}
                            >
                                Activity count
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Tab: Performance by pillar — interactive bar chart */}
            {activeTab === 'pillar' && (
                <div className="mb-4">
                    <div className="bg-white rounded-3 shadow-sm border overflow-hidden p-4">
                        <h5 className="mb-4 d-flex align-items-center gap-2" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                            <span className="material-symbols-outlined text-primary">bar_chart</span>
                            Strategic pillar performance
                        </h5>
                        {chartData.length === 0 ? (
                            <div className="text-center py-5 text-muted">No pillar data yet. Activities with a pillar will appear here.</div>
                        ) : (
                            <>
                            <ResponsiveContainer width="100%" height={380}>
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 16, right: 24, left: 8, bottom: 80 }}
                                    barCategoryGap="20%"
                                    barGap={4}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        angle={-35}
                                        textAnchor="end"
                                        height={72}
                                        interval={0}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        domain={chartMetric === 'avgProgress' ? [0, 100] : [0, 'auto']}
                                        tickFormatter={chartMetric === 'avgProgress' ? (v: number) => `${v}%` : (v: number) => String(v)}
                                        width={chartMetric === 'avgProgress' ? 36 : 32}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                                        content={({ active, payload }) => {
                                            if (!active || !payload?.length) return null;
                                            const p = payload[0]?.payload as undefined | { fullName: string; avgProgress: number; totalActivities: number; completed: number; inProgress: number; delayed: number };
                                            if (!p) return null;
                                            if (chartMetric === 'avgProgress') {
                                                return (
                                                    <div className="p-3 bg-white rounded-3 border shadow-sm" style={{ minWidth: '200px' }}>
                                                        <div className="fw-bold text-dark mb-2">{p.fullName}</div>
                                                        <div className="d-flex flex-column gap-1 small">
                                                            <div className="d-flex justify-content-between"><span className="text-muted">Avg progress</span><span className="fw-bold">{p.avgProgress}%</span></div>
                                                            <div className="d-flex justify-content-between"><span className="text-muted">Activities</span><span className="fw-bold">{p.totalActivities}</span></div>
                                                            <div className="d-flex justify-content-between"><span className="text-success">Completed</span><span>{p.completed}</span></div>
                                                            <div className="d-flex justify-content-between"><span className="text-warning">In progress</span><span>{p.inProgress}</span></div>
                                                            <div className="d-flex justify-content-between"><span className="text-danger">Delayed</span><span>{p.delayed}</span></div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div className="p-3 bg-white rounded-3 border shadow-sm" style={{ minWidth: '180px' }}>
                                                    <div className="fw-bold text-dark mb-2">{p.fullName}</div>
                                                    <div className="small">
                                                        <span className="text-muted">Activities: </span><span className="fw-bold">{p.totalActivities}</span>
                                                        <span className="text-muted ms-2">Avg progress: </span><span className="fw-bold">{p.avgProgress}%</span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Bar
                                        dataKey={chartMetric === 'avgProgress' ? 'avgProgress' : 'totalActivities'}
                                        name={chartMetric === 'avgProgress' ? 'Avg progress %' : 'Activities'}
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={56}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={barColor(entry.avgProgress)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="d-flex gap-4 flex-wrap justify-content-center mt-3 pt-3 border-top" style={{ fontSize: '.75rem', color: '#64748b' }}>
                                <span><span className="d-inline-block rounded me-1" style={{ width: 10, height: 10, background: '#10b981' }}></span> ≥75%</span>
                                <span><span className="d-inline-block rounded me-1" style={{ width: 10, height: 10, background: '#f59e0b' }}></span> 50–74%</span>
                                <span><span className="d-inline-block rounded me-1" style={{ width: 10, height: 10, background: '#ef4444' }}></span> &lt;50%</span>
                                {chartMetric === 'totalActivities' && <span className="text-muted">(Bar color by avg progress)</span>}
                            </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Tab: Faculties & departments drill-down */}
            {activeTab === 'faculties' && (
                <div className="d-flex flex-column gap-3">
                    <h6 className="fw-bold text-dark mb-0 d-flex align-items-center" style={{ fontSize: '1rem' }}>
                        <span className="material-symbols-outlined me-2 text-primary" style={{ fontSize: '20px' }}>account_tree</span>
                        Expand a faculty or office to view departments and units
                    </h6>
                    {rootsToShow.length === 0 ? (
                        <div className="text-center py-5 text-muted">No faculties or offices match the selected filters.</div>
                    ) : (
                        rootsToShow.map((root) => {
                            const children = (childrenByParentId[root.id] ?? []).filter((c) => filteredIds.has(c.id));
                            const isExpanded = expandedUnit === root.id;
                            return (
                                <div key={root.id} className="bg-white rounded-3 shadow-sm border overflow-hidden">
                                    <div
                                        className="p-3 d-flex align-items-center justify-content-between flex-wrap gap-2"
                                        onClick={() => toggleUnit(root.id)}
                                        style={{ cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: isExpanded ? '4px solid var(--mubs-blue)' : '4px solid transparent' }}
                                    >
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid #bfdbfe' }}>
                                                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>account_balance</span>
                                            </div>
                                            <div>
                                                <div className="fw-bold text-dark" style={{ fontSize: '.95rem' }}>{root.name}</div>
                                                <div className="text-muted" style={{ fontSize: '.75rem' }}>
                                                    {children.length} department{children.length !== 1 ? 's' : ''} / unit{children.length !== 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="material-symbols-outlined text-muted" style={{ fontSize: '22px', transition: 'transform 0.2s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                            expand_more
                                        </span>
                                    </div>

                                    {isExpanded && (
                                        <div className="border-top" style={{ background: '#f8fafc' }}>
                                            {children.length === 0 ? (
                                                <div className="p-4 text-center text-muted small">No departments or units under this faculty/office match the filters.</div>
                                            ) : (
                                                <div className="p-3 pt-2 d-flex flex-column gap-2">
                                                    {children.map((dept) => {
                                                        const progress = Math.max(0, Math.min(100, Number(dept.overallProgress ?? 0)));
                                                        const perf = getPerformanceLabel(progress);
                                                        return (
                                                            <div
                                                                key={dept.id}
                                                                className="d-flex align-items-center gap-3 p-3 rounded-3 bg-white border shadow-sm"
                                                            >
                                                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                    <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '18px' }}>business</span>
                                                                </div>
                                                                <div className="flex-fill min-w-0">
                                                                    <div className="fw-bold text-dark" style={{ fontSize: '.88rem' }}>{dept.name}</div>
                                                                    <div className="d-flex align-items-center gap-2 mt-1">
                                                                        <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px', maxWidth: '200px' }}>
                                                                            <div
                                                                                className="progress-bar"
                                                                                style={{
                                                                                    width: `${progress}%`,
                                                                                    backgroundColor: progress >= 70 ? '#10b981' : progress >= 50 ? '#f59e0b' : '#ef4444',
                                                                                    borderRadius: '4px',
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <span className="fw-bold text-dark" style={{ fontSize: '.85rem', minWidth: '2.5rem' }}>{progress}%</span>
                                                                    </div>
                                                                    <div className="text-muted" style={{ fontSize: '.72rem', marginTop: '2px' }}>
                                                                        {Number(dept.activitiesCount ?? 0)} activities
                                                                        {dept.head ? ` · ${dept.head}` : ''}
                                                                    </div>
                                                                </div>
                                                                <span className="status-badge" style={{ background: perf.bg, color: perf.color, padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '.65rem' }}>
                                                                    {perf.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
