"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface Task {
    id: number;
    title: string;
    status: string;
    progress: number;
    dueDate: string;
    assignee_name: string;
    assigned_to?: number;
    assigned_to_ids?: number[];
    activity_title: string;
    activity_id?: number;
    description?: string;
    reviewer_notes?: string;
    task_type?: 'process' | 'kpi_driver';
    kpi_target_value?: number | null;
    startDate?: string;
    endDate?: string;
}

interface DepartmentTaskCardGridProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onViewEvaluation: (taskId: number) => void;
    deletingId: number | null;
    selectedTaskIds: number[];
    onToggleTaskSelect: (taskId: number) => void;
}

const DEPT_INTERNAL_LABEL = '— Department internal —';
const UNASSIGNED_LABEL = 'Unassigned';

const DepartmentTaskCardGrid: React.FC<DepartmentTaskCardGridProps> = ({ 
    tasks, onEdit, onDelete, onViewEvaluation, deletingId, selectedTaskIds, onToggleTaskSelect 
}) => {
    const router = useRouter();

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return 'TBD';
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const getStatusStyle = (status: string) => {
        if (status === 'Completed') return { bg: '#dcfce7', color: '#15803d' };
        if (status === 'In Progress') return { bg: '#fef9c3', color: '#a16207' };
        if (status === 'Under Review') return { bg: '#eff6ff', color: '#1d4ed8' };
        return { bg: '#f1f5f9', color: '#475569' };
    };

    return (
        <div className="row g-4">
            {tasks.map((task) => {
                const statusStyle = getStatusStyle(task.status);
                const progressColor = (task.progress || 0) > 70 ? '#10b981' : ((task.progress || 0) > 30 ? '#f59e0b' : '#3b82f6');
                const assigneeName = task.assignee_name?.split(' ')[0] || UNASSIGNED_LABEL;
                const initials = task.assignee_name?.split(' ').map(n => n[0]).join('') || '?';

                const isSelected = selectedTaskIds.includes(task.id);

                return (
                    <div key={`grid-${task.id}`} className="col-12 col-md-6 col-xxl-4 position-relative">
                         <div 
                            className={`task-card h-100 p-4 bg-white border rounded-4 shadow-sm d-flex flex-column ${isSelected ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                            style={{ 
                                transition: 'all 0.3s ease',
                                borderTop: `6px solid ${progressColor}`,
                                boxShadow: isSelected ? '0 0 0 2px var(--mubs-blue)' : '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = isSelected ? '0 8px 16px rgba(0, 86, 150, 0.2)' : '0 12px 24px rgba(0,0,0,0.1)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isSelected ? '0 0 0 2px var(--mubs-blue)' : '0 4px 12px rgba(0,0,0,0.05)'; }}
                        >
                            <div className="position-absolute" style={{ top: '15px', right: '15px', zIndex: 2 }}>
                                <div className="form-check m-0">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                                        checked={isSelected}
                                        onChange={() => onToggleTaskSelect(task.id)}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-between align-items-start mb-3 pe-4">
                                <div>
                                    <span 
                                        className="badge mb-2" 
                                        style={{ 
                                            fontSize: '.65rem', fontWeight: 600, 
                                            background: task.task_type === 'kpi_driver' ? '#dbeafe' : '#f1f5f9', 
                                            color: task.task_type === 'kpi_driver' ? '#1e40af' : '#475569' 
                                        }}
                                    >
                                        {task.task_type === 'kpi_driver' ? 'KPI-Driver Task (Strategy)' : 'Process Task (Internal)'}
                                    </span>
                                    <h6 className="fw-bold text-dark mb-1" style={{ wordBreak: 'break-word' }}>{task.title}</h6>
                                    <div className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>category</span>
                                        <span style={{ wordBreak: 'break-word' }}>
                                            {task.activity_title || DEPT_INTERNAL_LABEL}
                                        </span>
                                    </div>
                                </div>
                                <span className="status-badge px-2 py-1 rounded-pill" style={{ background: statusStyle.bg, color: statusStyle.color, fontSize: '0.65rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                    {task.status}
                                </span>
                            </div>

                            <div className="flex-fill">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="staff-avatar" style={{
                                            background: 'var(--mubs-blue)', width: '28px', height: '28px', fontSize: '.7rem',
                                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontWeight: 'bold'
                                        }} title={task.assignee_name || UNASSIGNED_LABEL}>
                                            {initials}
                                        </div>
                                        <span className="fw-semibold text-dark" style={{ fontSize: '.8rem', maxWidth: '100px', wordBreak: 'break-word' }}>
                                            {assigneeName}
                                        </span>
                                    </div>
                                    <div className="vr" style={{ opacity: 0.2 }}></div>
                                    <div className="d-flex align-items-center gap-1 text-muted small" style={{ fontSize: '.8rem' }}>
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event</span>
                                        {formatDate(task.dueDate)}
                                    </div>
                                </div>

                                <div className="progress-section mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="small text-muted fw-bold" style={{ fontSize: '0.65rem' }}>PROGRESS</span>
                                        <span className="small fw-bold" style={{ fontSize: '0.7rem' }}>{task.progress || 0}%</span>
                                    </div>
                                    <div className="progress" style={{ height: '6px', borderRadius: '10px', background: '#f1f5f9' }}>
                                        <div className="progress-bar" style={{ 
                                            width: `${task.progress || 0}%`, 
                                            background: progressColor,
                                            borderRadius: '10px'
                                        }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex justify-content-end gap-2 mt-auto pt-3 border-top">
                                {task.status === 'Under Review' ? (
                                    <button
                                        type="button"
                                        className="btn btn-sm w-100 d-inline-flex justify-content-center align-items-center gap-1 py-2 fw-bold shadow-sm text-white"
                                        style={{ fontSize: '.75rem', background: 'var(--mubs-blue)', borderRadius: '8px' }}
                                        onClick={() => onViewEvaluation(task.id)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>rate_review</span>
                                        Evaluate
                                    </button>
                                ) : task.status === 'Completed' ? (
                                    <button
                                        type="button"
                                        className="btn btn-sm w-100 bg-success bg-opacity-10 border py-2 d-inline-flex justify-content-center align-items-center gap-1"
                                        style={{ fontSize: '.75rem', color: '#15803d', borderColor: '#86efac', borderRadius: '8px', fontWeight: 'bold' }}
                                        onClick={() => onViewEvaluation(task.id)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                        View evaluation
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light bg-opacity-50 py-2 border d-inline-flex flex-fill justify-content-center align-items-center gap-1"
                                            style={{ fontSize: '.75rem', color: '#64748b', borderRadius: '8px', fontWeight: 'bold' }}
                                            onClick={() => onEdit(task)}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger py-2 d-inline-flex flex-fill justify-content-center align-items-center gap-1"
                                            style={{ fontSize: '.75rem', borderRadius: '8px', fontWeight: 'bold' }}
                                            onClick={() => onDelete(task)}
                                            disabled={deletingId === task.id}
                                        >
                                            {deletingId === task.id ? (
                                                <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>delete</span>
                                            )}
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default DepartmentTaskCardGrid;
