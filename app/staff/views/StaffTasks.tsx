"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    status: string;
    priority: string;
    progress: number;
    type: string;
    daysLeft: number;
}

interface Stats {
    assigned: number;
    overdue: number;
    inProgress: number;
    completed: number;
}

export default function StaffTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats>({ assigned: 0, overdue: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get('/api/staff/tasks');
                setTasks(response.data.tasks);
                setStats(response.data.stats);
            } catch (error) {
                console.error('Error fetching staff tasks:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const urgentTasks = tasks.filter(t => t.daysLeft < 0 && t.status !== 'Completed');
    const activeTasks = tasks.filter(t => t.status !== 'Completed' && t.daysLeft >= 0);
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    return (
        <div className="content-area w-100">
            {/* Stats Header */}
            <div className="row g-4 mb-4">
                {[
                    { label: 'Assigned', value: stats.assigned, color: 'var(--mubs-blue)', icon: 'assignment' },
                    { label: 'Overdue', value: stats.overdue, color: 'var(--mubs-red)', icon: 'running_with_errors' },
                    { label: 'In Progress', value: stats.inProgress, color: 'var(--mubs-yellow)', icon: 'sync' },
                    { label: 'Completed', value: stats.completed, color: '#10b981', icon: 'check_circle' }
                ].map((stat, idx) => (
                    <div className="col-6 col-md-3" key={idx}>
                        <div className="stat-card-premium p-3 rounded-4 shadow-sm" style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${stat.color}20`,
                            borderTop: `4px solid ${stat.color}`,
                            transition: 'transform 0.2s ease'
                        }}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="icon-box" style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '12px', background: `${stat.color}15`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <span className="material-symbols-outlined" style={{ color: stat.color, fontSize: '24px' }}>{stat.icon}</span>
                                </div>
                                <div className="overflow-hidden">
                                    <div className="stat-value fw-black" style={{ fontSize: '1.5rem', lineHeight: '1', color: stat.color }}>{stat.value}</div>
                                    <div className="text-muted fw-bold text-truncate" style={{ fontSize: '.75rem', textTransform: 'uppercase' }}>{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Task List */}
            <div className="task-stack d-flex flex-column gap-4">
                {/* 1. Overdue Tasks */}
                {urgentTasks.length > 0 && (
                    <div className="section">
                        <div className="fw-black text-white mb-3 d-flex align-items-center gap-2" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>
                            <span className="material-symbols-outlined text-danger" style={{ fontSize: '18px' }}>warning</span> Urgent Attention Required
                        </div>
                        <div className="d-flex flex-column gap-3">
                            {urgentTasks.map(task => (
                                <TaskCard key={task.id} task={task} urgent />
                            ))}
                        </div>
                    </div>
                )}

                {/* 2. In Progress Tasks */}
                <div className="section">
                    <div className="fw-black text-white mb-3 d-flex align-items-center gap-2" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>
                        <span className="material-symbols-outlined text-warning" style={{ fontSize: '18px' }}>sync</span> Active Implementation
                    </div>
                    <div className="d-flex flex-column gap-3">
                        {activeTasks.length > 0 ? (
                            activeTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))
                        ) : (
                            <div className="p-4 rounded-4 bg-white shadow-sm text-center text-muted">
                                No active tasks at the moment.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Completed Section */}
                {completedTasks.length > 0 && (
                    <div className="section">
                        <div className="fw-black text-white mb-3 d-flex align-items-center justify-content-between" style={{ fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', opacity: .8 }}>
                            <div className="d-flex align-items-center gap-2">
                                <span className="material-symbols-outlined text-success" style={{ fontSize: '18px' }}>task_alt</span> Recently Completed
                            </div>
                        </div>
                        <div className="row g-3">
                            {completedTasks.slice(0, 4).map(task => (
                                <div className="col-12 col-md-6" key={task.id}>
                                    <div className="p-3 rounded-4 bg-white shadow-sm d-flex align-items-center gap-3 border" style={{ borderColor: 'rgba(16, 185, 129, 0.1)' }}>
                                        <div className="icon-check" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span className="material-symbols-outlined" style={{ color: '#059669' }}>verified</span>
                                        </div>
                                        <div className="flex-fill overflow-hidden">
                                            <div className="fw-bold text-dark text-truncate" style={{ fontSize: '.9rem' }}>{task.title}</div>
                                            <div className="text-muted" style={{ fontSize: '.75rem' }}>Completed on {new Date(task.dueDate).toLocaleDateString()}</div>
                                        </div>
                                        <Link href="/staff?pg=feedback" className="btn btn-sm btn-light fw-bold" style={{ borderRadius: '8px' }}>FEEDBACK</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TaskCard({ task, urgent }: { task: Task; urgent?: boolean }) {
    const priorityColor = task.priority === 'High' ? 'var(--mubs-red)' : (task.priority === 'Medium' ? 'var(--mubs-yellow)' : '#10b981');
    const priorityLabelColor = task.priority === 'High' ? 'var(--mubs-red)' : (task.priority === 'Medium' ? '#a16207' : '#059669');

    return (
        <div className="task-premium-card p-4 rounded-4" style={{
            background: 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${urgent ? 'rgba(227, 24, 55, 0.2)' : 'rgba(0,0,0,0.05)'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div className="priority-stripe" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: priorityColor }}></div>
            <div className="row g-4 d-flex align-items-center">
                <div className="col-12 col-lg-8">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge" style={{ background: `${priorityColor}15`, color: priorityLabelColor, fontWeight: '900', fontSize: '.65rem' }}>{task.priority.toUpperCase()} PRIORITY</span>
                        <span className="badge" style={{ background: 'rgba(0, 86, 150, 0.1)', color: 'var(--mubs-blue)', fontWeight: '900', fontSize: '.65rem' }}>{task.type.toUpperCase()}</span>
                    </div>
                    <h4 className="fw-black text-dark mb-2">{task.title}</h4>
                    <p className="text-muted mb-3" style={{ fontSize: '.9rem' }}>{task.description}</p>

                    <div className="d-flex flex-wrap gap-4 align-items-center">
                        <div className="d-flex align-items-center gap-2">
                            <div className="icon-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className={`material-symbols-outlined ${urgent ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '18px' }}>{urgent ? 'event_busy' : 'calendar_today'}</span>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold">DUE DATE</div>
                                <div className={`fw-black ${urgent ? 'text-danger' : 'text-dark'}`} style={{ fontSize: '.85rem' }}>
                                    {new Date(task.dueDate).toLocaleDateString()} {urgent && `(${Math.abs(task.daysLeft)}D Overdue)`}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <div className="icon-circle" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>info</span>
                            </div>
                            <div>
                                <div className="text-muted small fw-bold">STATUS</div>
                                <div className="fw-black text-dark" style={{ fontSize: '.85rem' }}>{task.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4 text-lg-end">
                    <div className="d-flex flex-column gap-2 align-items-lg-end">
                        <div className="progress-minimal mb-2" style={{ width: '120px' }}>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-muted fw-bold" style={{ fontSize: '.7rem' }}>PROGRESS</span>
                                <span className="fw-black" style={{ fontSize: '.7rem', color: priorityLabelColor }}>{task.progress}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                                <div style={{ width: `${task.progress}%`, height: '100%', background: priorityColor, borderRadius: '10px' }}></div>
                            </div>
                        </div>
                        <div className="d-flex gap-2 w-100">
                            <Link href="/staff?pg=submit" className={`btn ${urgent ? 'btn-primary' : 'btn-outline-primary'} fw-black px-4 d-flex align-items-center gap-2 justify-content-center flex-fill`} style={{ borderRadius: '10px', fontSize: '.85rem' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{urgent ? 'upload_file' : 'edit_note'}</span> {urgent ? 'SUBMIT REPORT' : 'UPDATE PROGRESS'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
