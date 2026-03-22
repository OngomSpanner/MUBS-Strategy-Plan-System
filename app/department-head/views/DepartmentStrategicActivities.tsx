'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import StatCard from '@/components/StatCard';

interface Activity {
    id: number;
    title: string;
    description?: string;
    strategic_objective?: string;
    pillar: string;
    target_kpi: string;
    kpi_target_value?: number;
    status: string;
    progress: number;
    start_date?: string;
    startDate?: string;
    end_date: string;
    unit_name: string;
    total_tasks: number;
    completed_tasks: number;
    parent_title?: string | null;
    source?: string;
}

interface ActivityData {
    activities: Activity[];
    stats: {
        total: number;
        onTrack: number;
        inProgress: number;
        delayed: number;
    };
}

export default function DepartmentStrategicActivities() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [data, setData] = useState<ActivityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    
    // --- Create Task Modal State ---
    const [departmentUsers, setDepartmentUsers] = useState<{ id: number; full_name: string; position: string | null }[]>([]);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [isSubmittingTask, setIsSubmittingTask] = useState(false);

    const toYMD = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const [taskForm, setTaskForm] = useState<{
        title: string;
        description: string;
        assigned_to_ids: number[];
        kpi_target_value: number | null;
        startDate: string;
        endDate: string;
        frequency: 'once' | 'daily' | 'weekly' | 'monthly';
        frequency_interval: number;
    }>({
        title: '',
        description: '',
        assigned_to_ids: [],
        kpi_target_value: null,
        startDate: toYMD(new Date()),
        endDate: toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        frequency: 'once',
        frequency_interval: 1
    });

    const fetchUsers = useCallback(async () => {
        if (departmentUsers.length > 0) return;
        try {
            const res = await axios.get('/api/users/department');
            setDepartmentUsers(res.data || []);
        } catch (err) {
            console.error('Failed to fetch department users:', err);
        }
    }, [departmentUsers.length]);

    const generateMultipleDates = (form: typeof taskForm): { startDate: string; endDate: string }[] => {
        if (!form.startDate || !form.endDate) return [];
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        const freq = form.frequency;

        if (freq === 'once') return [{ startDate: toYMD(start), endDate: toYMD(end) }];

        const tasks: { startDate: string; endDate: string }[] = [];
        let current = new Date(start);
        const interval = form.frequency_interval || 1;
        
        // Limit to prevent browser hangs
        let count = 0;
        while (current < end && count < 100) {
            const tStart = new Date(current);
            let tNext = new Date(current);

            if (freq === 'daily') tNext.setDate(tNext.getDate() + interval);
            else if (freq === 'weekly') tNext.setDate(tNext.getDate() + (interval * 7));
            else if (freq === 'monthly') tNext.setMonth(tNext.getMonth() + interval);
            else break;

            let tEnd: Date;
            if (tNext >= end) {
                tEnd = new Date(end); // Stretch the final task to the absolute deadline
            } else {
                tEnd = new Date(tNext);
                tEnd.setDate(tEnd.getDate() - 1);
            }

            tasks.push({
                startDate: toYMD(tStart),
                endDate: toYMD(tEnd)
            });

            if (tNext >= end) break;
            current = tNext;
            count++;
        }
        return tasks;
    };

    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedActivity) return;
        
        setIsSubmittingTask(true);
        try {
            const occurrenceDates = generateMultipleDates(taskForm);
            if (occurrenceDates.length === 0) {
                alert('Could not compute task dates. Please check Start Date and Duration.');
                setIsSubmittingTask(false);
                return;
            }
            
            const payloadBase = {
                title: taskForm.title,
                parent_id: selectedActivity.id,
                assigned_to_ids: taskForm.assigned_to_ids,
                description: taskForm.description,
                task_type: 'kpi_driver',
                kpi_target_value: taskForm.kpi_target_value,
                start_date: taskForm.startDate,
                frequency_interval: taskForm.frequency_interval
            };

            await Promise.all(
                occurrenceDates.map((occ) =>
                    axios.post('/api/department-head/tasks', {
                        ...payloadBase,
                        start_date: occ.startDate,
                        end_date: occ.endDate
                    })
                )
            );
            
            setShowCreateTaskModal(false);
            fetchData();
        } catch (error: any) {
            console.error('Error saving task:', error);
            const msg = error.response?.data?.message || error.response?.data?.detail || 'Failed to create task.';
            alert(msg);
        } finally {
            setIsSubmittingTask(false);
        }
    };


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/department-head/activities', {
                params: { _: Date.now() },
                headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
            });
            setData(response.data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching activities:', err);
            setError(err.response?.data?.message || 'Failed to load department activities. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Refetch whenever we're on activities page (e.g. after coming back from Submissions/Evaluations)
    const pg = searchParams.get('pg') || '';
    useEffect(() => {
        if (pg === 'activities') fetchData();
    }, [pg, fetchData]);

    // Refetch when user returns to tab
    useEffect(() => {
        const onFocus = () => { if (document.visibilityState === 'visible' && pg === 'activities') fetchData(); };
        document.addEventListener('visibilitychange', onFocus);
        return () => document.removeEventListener('visibilitychange', onFocus);
    }, [pg, fetchData]);

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-3 p-4" role="alert">
                    <span className="material-symbols-outlined fs-2 text-danger">error</span>
                    <div>
                        <h5 className="alert-heading text-danger fw-bold mb-1">Error Loading Activities</h5>
                        <p className="mb-0 text-dark opacity-75">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loading || !data) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const filteredActivities = data.activities.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.pillar && a.pillar.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All Statuses' || a.status === statusFilter || (statusFilter === 'Completed' && a.status === 'On Track');
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'TBD';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div id="page-activities" className="page-section active-page">
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="assignment"
                        label="Total Activities"
                        value={data.stats.total}
                        badge="Assigned"
                        badgeIcon="info"
                        color="blue"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="check_circle"
                        label="On Track"
                        value={data.stats.onTrack}
                        badge="Healthy"
                        badgeIcon="done_all"
                        color="green"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="pending"
                        label="In Progress"
                        value={data.stats.inProgress}
                        badge="Active"
                        badgeIcon="trending_up"
                        color="yellow"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="warning"
                        label="Delayed"
                        value={data.stats.delayed}
                        badge="Attention"
                        badgeIcon="error"
                        color="red"
                    />
                </div>
            </div>

            <div className="table-card shadow-sm">
                <div className="table-card-header">
                    <h5>
                        <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>track_changes</span>
                        Activities Assigned to My Department
                    </h5>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                        <div className="input-group input-group-sm" style={{ width: '190px' }}>
                            <span className="input-group-text bg-white border-end-0">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>search</span>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search activities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: '140px' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option>All Statuses</option>
                            <option>On Track</option>
                            <option>In Progress</option>
                            <option>Delayed</option>
                            <option>Completed</option>
                            <option>Not Started</option>
                        </select>
                    </div>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Activity</th>
                                <th>Pillar</th>
                                <th>Target KPI</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Tasks</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th className="pe-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-5 text-muted">
                                        No activities found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredActivities.map((a) => (
                                    <tr key={a.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="activity-icon-rounded" style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '10px',
                                                    background: '#f1f5f9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'var(--mubs-blue)'
                                                }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                                        {a.pillar?.includes('Research') ? 'science' :
                                                            a.pillar?.includes('Equity') ? 'shield' :
                                                                a.pillar?.includes('Human Capital') ? 'groups' :
                                                                    a.pillar?.includes('Partnerships') ? 'handshake' : 'description'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{a.title}</div>
                                                    <div className="text-muted small">{a.parent_title ? `Under: ${a.parent_title}` : `ID: #${a.id}`}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-badge" style={{
                                                background: a.pillar?.includes('Research') ? '#eff6ff' : (a.pillar?.includes('Equity') ? '#fef3c7' : (a.pillar?.includes('Human Capital') ? '#ecfdf5' : (a.pillar?.includes('Partnerships') ? '#f5f3ff' : '#f1f5f9'))),
                                                color: a.pillar?.includes('Research') ? '#1d4ed8' : (a.pillar?.includes('Equity') ? '#b45309' : (a.pillar?.includes('Human Capital') ? '#059669' : (a.pillar?.includes('Partnerships') ? '#7c3aed' : '#475569'))),
                                                fontSize: '0.7rem'
                                            }}>{a.pillar || 'Uncategorized'}</span>
                                        </td>
                                        <td className="small" style={{ fontSize: '.8rem' }}>{a.kpi_target_value ?? a.target_kpi}</td>
                                        <td className="small" style={{ fontSize: '.8rem' }}>{formatDate(a.start_date || '')}</td>
                                        <td className="small" style={{ fontSize: '.8rem' }}>{formatDate(a.end_date)}</td>
                                        <td className="small" style={{ fontSize: '.8rem' }}><span className="fw-bold text-primary">{a.completed_tasks}</span>/{a.total_tasks}</td>
                                        <td style={{ minWidth: '120px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="progress w-100" style={{ height: '6px', borderRadius: '10px' }}>
                                                    <div className="progress-bar" style={{
                                                        width: `${a.progress ?? 0}%`,
                                                        background: (a.progress ?? 0) > 70 ? '#10b981' : ((a.progress ?? 0) > 30 ? '#f59e0b' : '#3b82f6'),
                                                        borderRadius: '10px'
                                                    }}></div>
                                                </div>
                                                <span className="small fw-bold" style={{ fontSize: '.75rem' }}>{a.progress ?? 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-badge" style={{
                                                background: a.status === 'On Track' ? '#dcfce7' : (a.status === 'In Progress' ? '#fef9c3' : (a.status === 'Delayed' ? '#fee2e2' : '#f1f5f9')),
                                                color: a.status === 'On Track' ? '#15803d' : (a.status === 'In Progress' ? '#a16207' : (a.status === 'Delayed' ? '#b91c1c' : '#475569')),
                                                fontSize: '0.7rem'
                                            }}>{a.status}</span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <button
                                                className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1 fw-bold"
                                                style={{ fontSize: '.75rem' }}
                                                onClick={() => { setSelectedActivity(a); setShowViewModal(true); }}
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                                                <span>View Details</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="table-card-footer" style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
                    <span className="footer-label" style={{ fontSize: '.8rem', color: '#64748b' }}>Showing {filteredActivities.length} of {data.stats.total} activities</span>
                </div>
            </div>

            {/* View Activity Modal */}
            {selectedActivity && (
                <div className={`modal fade ${showViewModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: showViewModal ? 'rgba(15, 23, 42, 0.6)' : 'transparent', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                            <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>visibility</span>
                                    Activity Details
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 pt-3">
                                <div className="row g-4">
                                    <div className="col-12 border-bottom pb-3">
                                        <h4 className="fw-bold mb-1 text-primary" style={{ fontSize: '1.25rem' }}>{selectedActivity.title}</h4>
                                        <div className="d-flex align-items-center gap-2 mt-2">
                                            <span className="status-badge" style={{
                                                background: selectedActivity.status === 'On Track' ? '#dcfce7' : (selectedActivity.status === 'In Progress' ? '#fef9c3' : (selectedActivity.status === 'Delayed' ? '#fee2e2' : '#f1f5f9')),
                                                color: selectedActivity.status === 'On Track' ? '#15803d' : (selectedActivity.status === 'In Progress' ? '#a16207' : (selectedActivity.status === 'Delayed' ? '#b91c1c' : '#475569')),
                                                fontSize: '0.75rem',
                                                padding: '4px 8px',
                                                borderRadius: '6px'
                                            }}>{selectedActivity.status}</span>
                                            <span className="text-muted" style={{ fontSize: '0.85rem' }}>ID: #{selectedActivity.id}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Strategic Pillar</label>
                                        <div className="text-dark fw-medium" style={{ fontSize: '0.9rem' }}>{selectedActivity.pillar || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Target KPI</label>
                                        <div className="text-dark fw-bold h5 mb-0" style={{ color: '#005696' }}>{(selectedActivity.kpi_target_value ?? selectedActivity.target_kpi) || 'N/A'}</div>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Duration</label>
                                        <div className="text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                                            {formatDate(selectedActivity.startDate || selectedActivity.start_date)} — {formatDate(selectedActivity.end_date)}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Performance</label>
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                                                <div 
                                                    className="progress-bar bg-primary" 
                                                    role="progressbar" 
                                                    style={{ width: `${selectedActivity.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="fw-black text-primary" style={{ fontSize: '1rem' }}>{selectedActivity.progress}%</span>
                                        </div>
                                    </div>
                                    {selectedActivity.description && (
                                        <div className="col-12 mt-3">
                                            <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Description</label>
                                            <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                                <p className="mb-0 text-secondary" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{selectedActivity.description}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedActivity.strategic_objective && (
                                        <div className="col-12 mt-3">
                                            <label className="text-muted fw-bold mb-1 d-block" style={{ fontSize: '0.7rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Strategic Objective</label>
                                            <p className="mb-0 text-dark" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>{selectedActivity.strategic_objective}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-top-0 p-4 pt-0 d-flex justify-content-end gap-3">
                                <button
                                    className="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 shadow-sm"
                                    style={{ borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}
                                    onClick={() => {
                                        setShowViewModal(false);
                                        const queryTitle = selectedActivity.parent_title || selectedActivity.title;
                                        router.push(`/department-head?pg=tasks&activity=${encodeURIComponent(queryTitle)}`);
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>list</span>
                                    Go to Tasks
                                </button>
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm"
                                    style={{ borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }}
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setTaskForm({
                                            title: '',
                                            description: '',
                                            assigned_to_ids: [],
                                            kpi_target_value: null,
                                            startDate: toYMD(new Date()),
                                            endDate: selectedActivity?.end_date ? toYMD(new Date(selectedActivity.end_date)) : toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                                            frequency: 'once',
                                            frequency_interval: 1
                                        });
                                        fetchUsers();
                                        setShowCreateTaskModal(true);
                                    }}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_task</span>
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Create Task Modal */}
            <div className={`modal fade ${showCreateTaskModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ backgroundColor: showCreateTaskModal ? 'rgba(15, 23, 42, 0.6)' : 'transparent', zIndex: 1050, backdropFilter: 'blur(4px)' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                        <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                            <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>add_task</span>
                                Create New Task
                            </h5>
                            <button type="button" className="btn-close" onClick={() => setShowCreateTaskModal(false)}></button>
                        </div>
                        <div className="modal-body p-4 pt-3">
                            {selectedActivity && (
                                <div className="p-3 rounded-3 mb-4 d-flex align-items-start gap-3" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                                    <span className="material-symbols-outlined text-info mt-1" style={{ fontSize: '20px' }}>info</span>
                                    <div style={{ fontSize: '0.85rem', color: '#0369a1' }}>
                                        <div className="fw-bold mb-1">Parent: {selectedActivity.title}</div>
                                        <div className="opacity-75 d-flex align-items-center gap-2">
                                            <span>KPI-Driver Task (Strategy Plan)</span>
                                            <span>•</span>
                                            <span>Due {formatDate(selectedActivity.end_date)}</span>
                                            <span>•</span>
                                            <span className="fw-bold">KPI Target: {selectedActivity.target_kpi || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <form onSubmit={handleSaveTask} id="taskFormInActivity">
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small mb-1">Task Title <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" required value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="E.g. Identify 5 new vendors" />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label fw-semibold small mb-1">Assign To</label>
                                        <div className="border rounded p-2 bg-light" style={{ maxHeight: '160px', overflowY: 'auto' }}>
                                            <p className="small text-muted mb-2">Select one or more staff (optional)</p>
                                            {departmentUsers.map(u => {
                                                const ids = taskForm.assigned_to_ids;
                                                const checked = ids.includes(u.id);
                                                return (
                                                    <div key={u.id} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`assign-modal-${u.id}`}
                                                            checked={checked}
                                                            onChange={() => {
                                                                const next = checked ? ids.filter((id) => id !== u.id) : [...ids, u.id];
                                                                setTaskForm({ ...taskForm, assigned_to_ids: next });
                                                            }}
                                                        />
                                                        <label className="form-check-label small" htmlFor={`assign-modal-${u.id}`}>
                                                            {u.full_name}{u.position ? ` (${u.position})` : ''}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                            {departmentUsers.length === 0 && <span className="small text-muted">No staff found.</span>}
                                        </div>
                                    </div>
                                    {(() => {
                                        const calculateMaxInterval = () => {
                                            const start = new Date(taskForm.startDate || '');
                                            const end = new Date(taskForm.endDate || '');
                                            const gapDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                                            
                                            let max = 0;
                                            let unit = 'days';
                                            if (taskForm.frequency === 'daily') { max = Math.floor(gapDays); unit = 'days'; }
                                            else if (taskForm.frequency === 'weekly') { max = Math.floor(gapDays / 7); unit = 'weeks'; }
                                            else if (taskForm.frequency === 'monthly') { max = Math.floor(gapDays / 28); unit = 'months'; }
                                            
                                            return { max: Math.max(1, max), unit };
                                        };

                                        const { max, unit } = calculateMaxInterval();
                                        const isIntervalValid = taskForm.frequency === 'once' || (taskForm.frequency_interval || 1) <= max;

                                        return (
                                            <>
                                                <div className="col-6">
                                                    <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Start Date <span className="text-danger">*</span></label>
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        style={{ fontSize: '0.8rem' }}
                                                        required
                                                        value={taskForm.startDate || ''}
                                                        onChange={(e) => setTaskForm({ ...taskForm, startDate: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-6 d-none">
                                                    <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>End Date <span className="text-danger">*</span></label>
                                                    <input
                                                        type="date"
                                                        className="form-control form-control-sm"
                                                        style={{ fontSize: '0.8rem' }}
                                                        required
                                                        min={taskForm.startDate}
                                                        value={taskForm.endDate || ''}
                                                        onChange={(e) => setTaskForm({ ...taskForm, endDate: e.target.value })}
                                                    />
                                                </div>
                                                <div className="col-6">
                                                    <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Frequency</label>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ fontSize: '0.8rem' }}
                                                        value={taskForm.frequency || 'once'}
                                                        onChange={(e) => setTaskForm({ ...taskForm, frequency: e.target.value as any })}
                                                    >
                                                        <option value="once">Once</option>
                                                        <option value="daily">Daily</option>
                                                        {(() => {
                                                            const gap = (new Date(taskForm.endDate || '').getTime() - new Date(taskForm.startDate || '').getTime()) / (1000 * 3600 * 24);
                                                            return (
                                                                <>
                                                                    {gap >= 7 && <option value="weekly">Weekly</option>}
                                                                    {gap >= 28 && <option value="monthly">Monthly</option>}
                                                                </>
                                                            );
                                                        })()}
                                                    </select>
                                                </div>
                                                <div className={`col-6 ${taskForm.frequency === 'once' ? 'd-none' : ''}`}>
                                                    <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Repeat Every (Interval)</label>
                                                    <div className="input-group input-group-sm">
                                                        <input
                                                            type="number"
                                                            className={`form-control ${!isIntervalValid ? 'is-invalid' : ''}`}
                                                            min={1}
                                                            style={{ fontSize: '0.8rem' }}
                                                            value={taskForm.frequency_interval || 1}
                                                            onChange={(e) => setTaskForm({ ...taskForm, frequency_interval: parseInt(e.target.value) || 1 })}
                                                        />
                                                        <span className="input-group-text bg-light text-muted" style={{ fontSize: '0.7rem' }}>
                                                            {taskForm.frequency === 'daily' ? 'Days' : taskForm.frequency === 'weekly' ? 'Weeks' : 'Months'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="col-12 mt-2">
                                                    <div className={`p-3 rounded-2 border border-dashed ${!isIntervalValid ? 'bg-danger bg-opacity-10 border-danger' : 'bg-light'}`}>
                                                        {!isIntervalValid ? (
                                                            <div className="text-danger d-flex align-items-start gap-2">
                                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
                                                                <div style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                                                                    The maximum repeat interval is <strong>{max} {unit}</strong>, please enter a repeat interval below <strong>{max + 1} {unit}</strong>.
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div className="d-flex align-items-center gap-3 mb-2 pb-2 border-bottom border-light">
                                                                    <span className="material-symbols-outlined text-muted" style={{ fontSize: '18px' }}>event_available</span>
                                                                    <span className="fw-medium text-muted" style={{ fontSize: '0.75rem' }}>
                                                                        Timeline: <span className="text-dark fw-bold">{taskForm.startDate ? new Date(taskForm.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}</span> to <span className="text-dark fw-bold">{taskForm.endDate ? new Date(taskForm.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                                                                    </span>
                                                                    {taskForm.frequency !== 'once' && (
                                                                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle ms-auto" style={{ fontSize: '0.7rem' }}>
                                                                            {generateMultipleDates(taskForm).length} Tasks Total
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {taskForm.frequency !== 'once' && (
                                                                    <div className="row g-2 overflow-auto" style={{ maxHeight: '120px' }}>
                                                                        {generateMultipleDates(taskForm).map((occ, idx) => (
                                                                            <div key={idx} className="col-md-6">
                                                                                <div className="d-flex align-items-center gap-2 p-1 px-2 bg-white rounded border" style={{ fontSize: '0.7rem' }}>
                                                                                    <span className="fw-bold text-primary" style={{ minWidth: '24px' }}>{idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}</span>
                                                                                    <span className="text-muted">task:</span>
                                                                                    <span className="text-dark fw-medium text-truncate">{formatDate(occ.startDate)} – {formatDate(occ.endDate)}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {taskForm.frequency === 'once' && (
                                                                    <div className="text-muted small fst-italic" style={{ fontSize: '0.7rem' }}>
                                                                        A single task instance will be created.
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small mb-1">Task Description / Instructions</label>
                                        <textarea className="form-control" rows={3} value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Detailed requirements for the assignee..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer bg-light border-top-0 p-4 pt-0 d-flex justify-content-end">
                            {(() => {
                                const start = new Date(taskForm.startDate || '');
                                const end = new Date(taskForm.endDate || '');
                                const gapDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                                let max = 0;
                                if (taskForm.frequency === 'daily') max = Math.floor(gapDays);
                                else if (taskForm.frequency === 'weekly') max = Math.floor(gapDays / 7);
                                else if (taskForm.frequency === 'monthly') max = Math.floor(gapDays / 28);
                                
                                const isInvalid = taskForm.frequency !== 'once' && (taskForm.frequency_interval || 1) > Math.max(1, max);
                                
                                return (
                                    <button type="submit" form="taskFormInActivity" className="btn btn-primary fw-bold px-4 py-2 shadow-sm d-flex align-items-center gap-2" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)', borderRadius: '8px', fontSize: '0.9rem' }} disabled={isSubmittingTask || isInvalid}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                                        {isSubmittingTask ? 'Saving...' : 'Save Task'}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
