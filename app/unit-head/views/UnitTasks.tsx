'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    status: string;
    priority: string;
    progress: number;
    dueDate: string;
    assignee_name: string;
    activity_title: string;
}

interface KanbanData {
    kanban: {
        todo: Task[];
        inProgress: Task[];
        underReview: Task[];
        completed: Task[];
    };
    filters: {
        activities: string[];
        assignees: string[];
    };
}

export default function UnitTasks() {
    const [data, setData] = useState<KanbanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activityFilter, setActivityFilter] = useState('All Strategic Activities');
    const [assigneeFilter, setAssigneeFilter] = useState('All Assignees');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/unit-head/tasks');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching unit tasks:', error);
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

    const filterTasks = (tasks: Task[]) => {
        return tasks.filter(t => {
            const matchesActivity = activityFilter === 'All Strategic Activities' || t.activity_title === activityFilter;
            const matchesAssignee = assigneeFilter === 'All Assignees' || t.assignee_name === assigneeFilter;
            return matchesActivity && matchesAssignee;
        });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const columns = [
        { key: 'todo', label: 'To Do', color: '#64748b', bg: '#f1f5f9', tasks: filterTasks(data.kanban.todo) },
        { key: 'inProgress', label: 'In Progress', color: '#b45309', bg: '#fef9c3', tasks: filterTasks(data.kanban.inProgress) },
        { key: 'underReview', label: 'Under Review', color: '#1d4ed8', bg: '#eff6ff', tasks: filterTasks(data.kanban.underReview) },
        { key: 'completed', label: 'Completed', color: '#15803d', bg: '#ecfdf5', tasks: filterTasks(data.kanban.completed) }
    ];

    return (
        <div id="page-tasks" className="page-section active-page">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 p-3 bg-white rounded shadow-sm border">
                <div className="d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-primary">filter_list</span>
                    <span className="fw-bold text-dark">Filters:</span>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '200px' }}
                        value={activityFilter}
                        onChange={(e) => setActivityFilter(e.target.value)}
                    >
                        <option>All Strategic Activities</option>
                        {data.filters.activities.map(a => <option key={a}>{a}</option>)}
                    </select>
                    <select
                        className="form-select form-select-sm"
                        style={{ width: '160px' }}
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                    >
                        <option>All Assignees</option>
                        {data.filters.assignees.map(a => <option key={a}>{a}</option>)}
                    </select>
                </div>
                <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 ms-auto fw-bold">
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> New Task
                </button>
            </div>

            <div className="row g-3" style={{ minHeight: 'calc(100vh - 250px)' }}>
                {columns.map(col => (
                    <div className="col-12 col-md-6 col-xl-3" key={col.key}>
                        <div className="kanban-column rounded-3 p-3 h-100 border shadow-sm" style={{ background: col.bg, borderColor: `${col.color}20` }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-black mb-0" style={{ color: col.color, fontSize: '.9rem', letterSpacing: '.05em', textTransform: 'uppercase' }}>
                                    {col.label}
                                </h6>
                                <span className="badge rounded-pill" style={{ background: `${col.color}20`, color: col.color, fontSize: '.75rem' }}>
                                    {col.tasks.length}
                                </span>
                            </div>

                            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                                {col.tasks.length === 0 ? (
                                    <div className="text-center py-4 text-muted small border border-dashed rounded bg-white bg-opacity-50">
                                        No tasks here
                                    </div>
                                ) : (
                                    col.tasks.map(task => (
                                        <div key={task.id} className="kanban-card p-3 bg-white rounded-3 shadow-sm border" style={{
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            borderLeft: `4px solid ${task.priority === 'High' ? 'var(--mubs-red)' : (task.priority === 'Medium' ? 'var(--mubs-yellow)' : '#10b981')}`
                                        }}>
                                            <div className="d-flex justify-content-between mb-2 align-items-start">
                                                <span className={`badge ${task.priority === 'High' ? 'bg-danger-subtle text-danger' : (task.priority === 'Medium' ? 'bg-warning-subtle text-dark' : 'bg-success-subtle text-success')}`} style={{ fontSize: '.6rem', fontWeight: 800 }}>
                                                    {task.priority.toUpperCase()}
                                                </span>
                                                <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '.65rem' }}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>calendar_today</span>
                                                    {formatDate(task.dueDate)}
                                                </div>
                                            </div>

                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: '.83rem', lineHeight: '1.4' }}>{task.title}</div>
                                            <div className="text-muted mb-2 overflow-hidden text-truncate w-100" style={{ fontSize: '.72rem' }}>{task.activity_title}</div>

                                            {task.status === 'In Progress' && (
                                                <div className="progress mb-3" style={{ height: '4px', borderRadius: '4px' }}>
                                                    <div className="progress-bar bg-warning" style={{ width: `${task.progress}%` }}></div>
                                                </div>
                                            )}

                                            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light">
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="staff-avatar" style={{
                                                        background: 'var(--mubs-blue)',
                                                        width: '24px',
                                                        height: '24px',
                                                        fontSize: '.65rem',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontWeight: 'bold'
                                                    }} title={task.assignee_name || 'Unassigned'}>
                                                        {task.assignee_name?.split(' ').map(n => n[0]).join('') || '?'}
                                                    </div>
                                                    <span className="small text-muted" style={{ fontSize: '.65rem' }}>{task.assignee_name?.split(' ')[0] || 'Unassigned'}</span>
                                                </div>
                                                <div className="d-flex gap-1">
                                                    {col.key === 'underReview' ? (
                                                        <button className="btn btn-xs btn-primary py-0 px-2 fw-bold" style={{ fontSize: '.65rem' }}>Evaluate</button>
                                                    ) : (
                                                        <button className="btn btn-xs btn-light py-0 px-2" style={{ fontSize: '.65rem' }}>
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
