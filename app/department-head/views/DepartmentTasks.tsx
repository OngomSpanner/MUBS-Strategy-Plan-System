'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import StatCard from '@/components/StatCard';
import DepartmentTaskCardGrid from '@/components/Department/DepartmentTaskCardGrid';

/** task_type: process = Department Internal / Operational; kpi_driver = Strategy Plan */
const TASK_TYPE_LABELS: Record<string, string> = {
    process: 'Process Task (Dept Internal)',
    kpi_driver: 'KPI-Driver Task (Strategy Plan)',
};

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
    strategic_activity_id?: number;
    description?: string;
    reviewer_notes?: string;
    task_type?: 'process' | 'kpi_driver';
    kpi_target_value?: number | null;
    startDate?: string;
    endDate?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    frequency_interval?: number;
}

interface Evaluation {
    id: number;
    report_name: string;
    activity_title: string;
    staff_name: string;
    submitted_at: string;
    status: string;
    progress: number;
    report_summary: string;
    attachments?: string | null;
    score?: number;
    reviewer_notes?: string;
    task_type?: 'process' | 'kpi_driver';
    kpi_actual_value?: number | null;
}

/** For create form: multiple assignees + optional recurrence */
type TaskFormState = Partial<Task> & {
    assigned_to_ids?: number[];
    startDate?: string;
    endDate?: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
    frequency_interval?: number;
    isFixedFields?: boolean;
};

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

/** Format date as YYYY-MM-DD in local time (avoids UTC rollover with date inputs) */
const toYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

interface DepartmentTasksProps {
    initialActivity?: string;
    initialAssignee?: string;
}

export default function DepartmentTasks({ initialActivity, initialAssignee }: DepartmentTasksProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const actionParam = searchParams.get('action');
    const hasAutoOpened = useRef(false);
    const [data, setData] = useState<KanbanData | null>(null);
    const [availableActivities, setAvailableActivities] = useState<{ 
        id: number, 
        title: string, 
        end_date?: string,
        start_date?: string,
        pillar?: string,
        actual_value?: number,
        kpi_target_value?: number,
        target_kpi?: string,
        status?: string
    }[]>([]);
    const [departmentUsers, setDepartmentUsers] = useState<{ id: number; full_name: string; position: string | null }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activityFilter, setActivityFilter] = useState(initialActivity || 'All Tasks');
    const [assigneeFilter, setAssigneeFilter] = useState(initialAssignee || 'All Assignees');

    const UNASSIGNED_LABEL = 'Unassigned';

    // Modal States
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid' | 'activity'>('activity');
    const [selectedTaskIds, setSelectedTaskIds] = useState<number[]>([]);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [statusFilter, setStatusFilter] = useState('All');
    const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
    const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);

    // Evaluation Modal States
    const [evaluateModalItem, setEvaluateModalItem] = useState<Evaluation | null>(null);
    const [viewModalItem, setViewModalItem] = useState<Evaluation | null>(null);
    const [isEvaluationLoading, setIsEvaluationLoading] = useState(false);
    const [selectedRating, setSelectedRating] = useState<{ [key: number]: 'Complete' | 'Incomplete' | 'Not Done' }>({});
    const [evaluationComments, setEvaluationComments] = useState<{ [key: number]: string }>({});
    const [kpiActualValues, setKpiActualValues] = useState<{ [key: number]: string }>({});

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Form States (assigned_to_ids used when creating; assigned_to when editing)
    const [taskForm, setTaskForm] = useState<TaskFormState>({
        assigned_to_ids: [],
        task_type: 'process',
        kpi_target_value: null,
        startDate: toYMD(new Date()),
        endDate: toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
        frequency: 'once',
        frequency_interval: 1
    });
    
    useEffect(() => {
        if (evaluateModalItem) {
            const id = evaluateModalItem.id;
            // Pre-populate KPI value from what staff entered if not already set locally
            if (evaluateModalItem.kpi_actual_value != null && kpiActualValues[id] === undefined) {
                setKpiActualValues(prev => ({ ...prev, [id]: String(evaluateModalItem.kpi_actual_value) }));
            }
        }
    }, [evaluateModalItem]);





    /** Parse dueDate (string or Date) to local YYYY-MM-DD; return null if invalid */
    const parseDueDate = (dueDate: string | undefined | null): string | null => {
        if (dueDate == null || String(dueDate).trim() === '') return null;
        const s = String(dueDate).trim();
        const match = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (match) return `${match[1]}-${match[2]}-${match[3]}`;
        const d = new Date(s);
        if (Number.isNaN(d.getTime())) return null;
        return toYMD(d);
    };



    const generateTaskDate = (form: TaskFormState): string | null => {
        return form.endDate || null;
    };

    const generateMultipleDates = (form: TaskFormState): { startDate: string; endDate: string }[] => {
        if (!form.startDate || !form.endDate) return [];
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        const freq = form.frequency || 'once';

        if (freq === 'once') return [{ startDate: toYMD(start), endDate: toYMD(end) }];

        const tasks: { startDate: string; endDate: string }[] = [];
        if (!start || !end) return tasks;
        const startDateObj = new Date(start);
        const endDateObj = new Date(end);
        if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime()) || startDateObj >= endDateObj) return tasks;

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

    const fetchData = async () => {
        try {
            const [tasksRes, activitiesRes, usersRes] = await Promise.all([
                axios.get('/api/department-head/tasks'),
                axios.get('/api/department-head/activities').catch(() => ({ data: { activities: [] } })),
                axios.get('/api/users/department')
            ]);
            const tasksData = tasksRes.data?.kanban ? tasksRes.data : {
                kanban: tasksRes.data?.kanban || { todo: [], inProgress: [], underReview: [], completed: [] },
                availableActivities: tasksRes.data?.availableActivities || [],
                filters: tasksRes.data?.filters || { activities: [], assignees: [] }
            };
            setData(tasksData);
            setDepartmentUsers(usersRes.data || []);
            // Merge parent activities from both APIs so we never miss one (same source of truth, but union in case of any mismatch)
            const activitiesList = Array.isArray(activitiesRes?.data?.activities) ? activitiesRes.data.activities : [];
            // Parent options exactly as they appear in the Activities table
            const parentsFromActivities = activitiesList;
            const fromTasks = Array.isArray(tasksRes.data?.availableActivities) ? tasksRes.data.availableActivities : [];
            const byId = new Map<number, { id: number; title: string, end_date?: string }>();
            parentsFromActivities.forEach((a: { id: number; title: string; end_date?: string }) => byId.set(a.id, { id: a.id, title: a.title, end_date: a.end_date }));
            fromTasks.forEach((a: { id: number; title: string; end_date?: string }) => { if (!byId.has(a.id)) byId.set(a.id, { id: a.id, title: a.title, end_date: a.end_date }); });
            
            const parentOptions = Array.from(byId.values()).sort((a, b) => (a.title || '').localeCompare(b.title || ''));
            
            // Enrich parentOptions with full metadata from activitiesRes
            const enrichedOptions = parentOptions.map(opt => {
                const full = activitiesList.find((a: any) => a.id === opt.id);
                const fromT = fromTasks.find((a: any) => a.id === opt.id);
                return {
                    ...opt,
                    pillar: full?.pillar || (opt as any)?.pillar,
                    start_date: full?.start_date,
                    actual_value: full?.actual_value,
                    kpi_target_value: full?.kpi_target_value ?? fromT?.kpi_target_value,
                    target_kpi: full?.target_kpi || fromT?.target_kpi,
                    status: full?.status
                };
            });

            setAvailableActivities(enrichedOptions);
        } catch (error: any) {
            console.error('Error fetching department tasks data:', error);
            setError(error.response?.data?.message || 'Failed to load tasks data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Sync state with URL parameters to enable browser back/forward navigation
    useEffect(() => {
        const mode = searchParams.get('mode') as 'table' | 'grid' | 'activity' | null;
        const activity = searchParams.get('activity');
        const status = searchParams.get('status');

        if (mode && ['table', 'grid', 'activity'].includes(mode)) {
            setViewMode(mode);
        } else {
            // Default to activity if mode is missing or invalid (matches Hub view)
            setViewMode('activity');
        }

        if (activity) {
            setActivityFilter(activity);
        } else if (mode === 'activity' || !mode) {
            setActivityFilter('All Tasks');
        }

        if (status) {
            setStatusFilter(status);
        } else {
            setStatusFilter('All');
        }
        
        // Always reset to page 1 when any filter/mode changes via URL
        setCurrentPage(1);
    }, [searchParams]);

    // Helper to update URL and trigger navigation
    const navigate = (mode: 'table' | 'grid' | 'activity', activity?: string, status?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        // Ensure we preserve the page context
        params.set('pg', 'tasks');
        params.set('mode', mode);
        
        if (activity) {
            params.set('activity', activity);
        } else if (mode === 'activity') {
            params.delete('activity');
        }
        
        if (status && status !== 'All') {
            params.set('status', status);
        } else {
            params.delete('status');
        }

        const url = `${window.location.pathname}?${params.toString()}`;
        
        // Push state ONLY when entering detailed mode (Table/Grid) FROM activity hub.
        // Otherwise replace to keep the hub as the single 'Back' target.
        if (viewMode === 'activity' && mode !== 'activity') {
            router.push(url);
        } else {
            router.replace(url);
        }
    };

    useEffect(() => {
        if (actionParam === 'create' && availableActivities.length > 0 && !hasAutoOpened.current) {
            hasAutoOpened.current = true;
            const initialId = initialActivity && availableActivities.length
                ? availableActivities.find(a => a.title === initialActivity)?.id
                : undefined;
            const initEndDate = initialId && availableActivities.find(a => a.id === initialId)?.end_date 
                ? toYMD(new Date(availableActivities.find(a => a.id === initialId)!.end_date!)) 
                : toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
            setTaskForm({
                title: '',
                description: '',
                dueDate: '',
                status: 'Not Started',
                activity_id: initialId,
                assigned_to_ids: [],
                task_type: 'kpi_driver',
                kpi_target_value: null,
                startDate: toYMD(new Date()),
                endDate: initEndDate,
                frequency: 'once',
                frequency_interval: 1,
                isFixedFields: true
            });
            setShowTaskModal(true);

            // Clean up the URL to avoid keeping the 'action' query string active
            if (typeof window !== 'undefined') {
                const url = new URL(window.location.href);
                url.searchParams.delete('action');
                router.replace(url.pathname + url.search);
            }
        }
    }, [actionParam, availableActivities, initialActivity, router]);



    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger shadow-sm border-0 d-flex align-items-center gap-3 p-4" role="alert">
                    <span className="material-symbols-outlined fs-2 text-danger">error</span>
                    <div>
                        <h5 className="alert-heading text-danger fw-bold mb-1">Error Loading Tasks</h5>
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

    const DEPT_INTERNAL_LABEL = '— Department internal —';

    const normalizeForCompare = (s: string) => (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

    const filterTasks = (tasks: Task[]): Task[] => {
        return tasks.filter(t => {
            const taskActivity = (t.activity_title ?? '').trim();
            const displayActivity = taskActivity === '' ? DEPT_INTERNAL_LABEL : (t.activity_title ?? '');
            const taskAssignee = (t.assignee_name ?? '').trim();
            const displayAssignee = taskAssignee === '' ? UNASSIGNED_LABEL : (t.assignee_name ?? '');

            const matchesActivity =
                activityFilter === 'All Tasks' ||
                (activityFilter === 'All Strategic Activities' && displayActivity !== DEPT_INTERNAL_LABEL) ||
                normalizeForCompare(displayActivity) === normalizeForCompare(activityFilter);
            const matchesAssignee = assigneeFilter === 'All Assignees' || 
            (assigneeFilter === UNASSIGNED_LABEL ? !t.assigned_to : t.assignee_name === assigneeFilter);
        
            const p = t.progress || 0;
            const s = (t.status ?? '').trim().toLowerCase();
            const f = (statusFilter || 'All').trim().toLowerCase();
            
            const matchesStatus = f === 'all' ||
                (f === 'completed' && (p >= 100 || s === 'completed')) ||
                (f === 'in progress' && p > 0 && p < 100) ||
                (f === 'not completed' && p < 100 && s !== 'completed');

            return matchesActivity && matchesAssignee && matchesStatus;
        });
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const handleOpenCreate = () => {
        const currentAct = activityFilter !== 'All Tasks' && activityFilter !== 'All Strategic Activities' ? activityFilter : initialActivity;
        const meta = currentAct ? availableActivities.find(a => a.title === currentAct) : undefined;
        const initialId = meta?.id;
        
        const initEndDate = meta?.end_date 
            ? toYMD(new Date(meta.end_date)) 
            : toYMD(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

        setTaskForm({
            title: '',
            description: '',
            dueDate: '',
            status: 'Not Started',
            activity_id: initialId,
            assigned_to_ids: [],
            task_type: initialId ? 'kpi_driver' : 'process',
            kpi_target_value: null,
            startDate: toYMD(new Date()),
            endDate: initEndDate,
            frequency: 'once',
            frequency_interval: 1,
            isFixedFields: !!initialId
        });
        setShowTaskModal(true);
    };

    const handleOpenEdit = (task: Task) => {
        let actId = (task as any).strategic_activity_id || task.activity_id || undefined;
        // If the task is linked to an obsolete global parent activity but the department has a copy of it, auto-select the valid department copy.
        if (actId && !availableActivities.some(a => a.id === actId)) {
            const taskTitle = task.activity_title?.trim();
            const matchingActivity = availableActivities.find(a => a.title?.trim() === taskTitle);
            if (matchingActivity) {
                actId = matchingActivity.id;
            }
        }

        setTaskForm({
            ...task,
            startDate: parseDueDate(task.startDate) || parseDueDate(task.dueDate) || '',
            endDate: parseDueDate(task.endDate) || parseDueDate(task.dueDate) || '',
            assigned_to_ids: task.assigned_to ? [task.assigned_to] : [],
            activity_id: actId,
            kpi_target_value: task.kpi_target_value || null,
            task_type: task.task_type || (actId ? 'kpi_driver' : 'process'),
            frequency: task.frequency || 'once',
            frequency_interval: task.frequency_interval || 1
        });
        setShowTaskModal(true);
    };

    const handleDeleteTask = async (task: Task) => {
        if (!window.confirm(`Delete task "${task.title}"? This cannot be undone.`)) return;
        setDeletingId(task.id);
        try {
            await axios.delete(`/api/department-head/tasks/${task.id}`);
            await fetchData();
        } catch (err: any) {
            const msg = err.response?.data?.message || 'This task cannot be deleted (e.g. it may be a strategic goal).';
            alert(msg);
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleTaskSelect = (taskId: number) => {
        setSelectedTaskIds(prev => 
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTaskIds(pagedTasks.map(t => t.id));
        } else {
            setSelectedTaskIds([]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedTaskIds.length === 0) return;
        
        setIsBulkDeleting(true);
        setBulkDeleteError(null);
        try {
            await Promise.all(selectedTaskIds.map(id => axios.delete(`/api/department-head/tasks/${id}`)));
            setSelectedTaskIds([]);
            setShowBulkDeleteModal(false);
            await fetchData();
        } catch (err: any) {
            console.error('Error during bulk delete:', err);
            setBulkDeleteError('Some tasks could not be deleted (e.g. they may be strategic goals).');
            await fetchData();
        } finally {
            setIsBulkDeleting(false);
        }
    };


    const handleSaveTask = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (taskForm.id) {
                // Map camelCase to snake_case for the API
                const putPayload = {
                    ...taskForm,
                    start_date: taskForm.startDate,
                    end_date: taskForm.endDate,
                    activity_id: taskForm.activity_id,
                    frequency: taskForm.frequency,
                    frequency_interval: taskForm.frequency_interval
                };
                await axios.put('/api/department-head/tasks', putPayload);
            } else {
                const occurrenceDates = generateMultipleDates(taskForm);
                if (occurrenceDates.length === 0) {
                    alert('Could not compute task dates. Please check Start Date and Duration.');
                    setIsSubmitting(false);
                    return;
                }
                const payloadBase = {
                    title: taskForm.title,
                    parent_id: taskForm.activity_id,
                    assigned_to_ids: taskForm.assigned_to_ids ?? (taskForm.assigned_to != null ? [taskForm.assigned_to] : []),
                    description: taskForm.description,
                    task_type: taskForm.task_type || 'process',
                    kpi_target_value: taskForm.task_type === 'kpi_driver' ? taskForm.kpi_target_value : null,
                    start_date: taskForm.startDate,
                    frequency: taskForm.frequency,
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
            }
            setShowTaskModal(false);
            await fetchData();
        } catch (error: any) {
            console.error('Error saving task:', error);
            const msg = error.response?.data?.message || error.response?.data?.detail || 'Failed to save task. Please try again.';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const allTasks = [
        ...data.kanban.todo,
        ...data.kanban.inProgress,
        ...data.kanban.underReview,
        ...data.kanban.completed
    ];

    const activityFilterOptions = [
        'All Tasks',
        'All Strategic Activities',
        ...availableActivities.map(a => a.title),
        ...(allTasks.some(t => !(t.activity_title ?? '').trim()) ? [DEPT_INTERNAL_LABEL] : [])
    ];
    const assigneeFilterOptions = [
        'All Assignees',
        ...Array.from(new Set(
            allTasks.map(t => (t.assignee_name ?? '').trim()).filter(n => n.length > 0)
        )),
        ...(allTasks.some(t => !(t.assignee_name ?? '').trim()) ? [UNASSIGNED_LABEL] : [])
    ];
 
    const filteredTasks = filterTasks(allTasks);

    // Filter counts for the dropdown - must honor current activity/assignee filters but NOT status filter
    const getStatusCount = (f: string) => {
        const filterVal = f.toLowerCase();
        const baseFiltered = allTasks.filter(t => {
            const taskActivity = (t.activity_title ?? '').trim();
            const displayActivity = taskActivity === '' ? DEPT_INTERNAL_LABEL : (t.activity_title ?? '');
            const matchesActivity = activityFilter === 'All Tasks' || 
                (activityFilter === 'All Strategic Activities' && displayActivity !== DEPT_INTERNAL_LABEL) ||
                normalizeForCompare(displayActivity) === normalizeForCompare(activityFilter);
            const matchesAssignee = assigneeFilter === 'All Assignees' || 
                (assigneeFilter === UNASSIGNED_LABEL ? !t.assigned_to : t.assignee_name === assigneeFilter);
            return matchesActivity && matchesAssignee;
        });

        return baseFiltered.filter(t => {
            const p = t.progress || 0;
            const s = (t.status ?? '').trim().toLowerCase();
            if (filterVal === 'all') return true;
            if (filterVal === 'completed') return p >= 100 || s === 'completed';
            if (filterVal === 'in progress') return p > 0 && p < 100;
            if (filterVal === 'not completed') return p < 100 && s !== 'completed';
            if (filterVal === 'todo') return p === 0 && s !== 'completed';
            return false;
        }).length;
    };
 
    // Group tasks by activity for the 'activity' view
    const groupedByActivity = filteredTasks.reduce((acc, task) => {
        const key = task.activity_title || DEPT_INTERNAL_LABEL;
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
    }, {} as Record<string, Task[]>);


    const activityGroups = Object.entries(groupedByActivity).map(([title, tasks]) => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.progress >= 100 || t.status === 'Completed').length;
        const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100).length;
        const todo = tasks.filter(t => (t.progress || 0) === 0 && t.status !== 'Completed').length;
        const avgProgress = Math.round(tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / (total || 1));
        
        // Enrich from availableActivities metadata
        const meta = availableActivities.find(a => a.title === title);
        return { 
            title, 
            tasks, 
            total, 
            completed, 
            inProgress,
            todo,
            avgProgress,
            pillar: (meta as any)?.pillar,
            startDate: (meta as any)?.start_date,
            endDate: (meta as any)?.end_date,
            kpiTargetValue: (meta as any)?.kpi_target_value,
            actualValue: (meta as any)?.actual_value,
            status: (meta as any)?.status
        };
    }).sort((a, b) => {
        if (a.title === DEPT_INTERNAL_LABEL) return 1;
        if (b.title === DEPT_INTERNAL_LABEL) return -1;
        return a.title.localeCompare(b.title);
    });

    // Evaluation Helpers & Handlers
    const handleViewEvaluation = async (taskId: number) => {
        try {
            setIsEvaluationLoading(true);
            const res = await axios.get(`/api/department-head/evaluations?taskId=${taskId}`);
            const evals = [...(res.data.pending || []), ...(res.data.completed || [])];
            if (evals.length > 0) {
                const latest = evals[0];
                if (latest.status === 'Pending') {
                    setEvaluateModalItem(latest);
                } else {
                    setViewModalItem(latest);
                }
            } else {
                alert('No evaluation record found for this task.');
            }
        } catch (err) {
            console.error('Error fetching evaluation:', err);
            alert('Failed to load evaluation details.');
        } finally {
            setIsEvaluationLoading(false);
        }
    };

    const handleSubmitEvaluation = async () => {
        if (!evaluateModalItem) return;
        const id = evaluateModalItem.id;
        const status = selectedRating[id];
        const comment = evaluationComments[id];
        const isKpiDriver = evaluateModalItem.task_type === 'kpi_driver';
        const kpiActual = kpiActualValues[id];

        if (!status) {
            alert('Please select a rating: Complete (2 pts), Incomplete (1 pt), or Not Done (0 pts).');
            return;
        }
        if (status === 'Incomplete' && (!comment || String(comment).trim() === '')) {
            alert('Comment is required when marking Incomplete.');
            return;
        }

        const score = status === 'Complete' ? 2 : status === 'Incomplete' ? 1 : 0;
        try {
            setIsSubmitting(true);
            await axios.put('/api/department-head/evaluations', {
                id,
                status,
                score,
                reviewer_notes: comment || '',
                kpi_actual_value: status === 'Complete' && isKpiDriver && kpiActual != null && String(kpiActual).trim() !== '' ? Number(kpiActual) : undefined
            });

            // Refresh tasks
            await fetchData();
            
            // Close modal and reset
            setEvaluateModalItem(null);
            setSelectedRating(prev => { const next = { ...prev }; delete next[id]; return next; });
            setEvaluationComments(prev => { const next = { ...prev }; delete next[id]; return next; });
            setKpiActualValues(prev => { const next = { ...prev }; delete next[id]; return next; });
        } catch (error: any) {
            console.error('Error submitting evaluation:', error);
            const msg = error.response?.data?.message || 'Failed to submit evaluation.';
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    /** Rating used to evaluate: Complete, Incomplete, or Not Done. */
    const getRatingLabel = (e: { score?: number | null; status: string }): string => {
        if (e.status === 'Pending') return '—';
        if (e.score != null && e.score <= 2) {
            if (e.score === 2) return 'Complete';
            if (e.score === 1) return 'Incomplete';
            return 'Not Done';
        }
        if (e.status === 'Completed') return 'Complete';
        if (e.status === 'Not Done') return 'Not Done';
        if (e.status === 'Incomplete' || e.status === 'Returned') return 'Incomplete';
        return '—';
    };

    const parseEvidenceItems = (attachments?: string | null): { label: string; url: string }[] => {
        if (!attachments) return [];
        return attachments
            .split('|')
            .map(part => part.trim())
            .filter(part => part.length > 0)
            .map(part => {
                const isUpload = part.startsWith('/uploads/');
                const label = isUpload ? 'Uploaded file' : 'Evidence link';
                return { label, url: part };
            });
    };

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pagedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

    return (
        <div id="page-tasks" className="page-section active-page">
            <div className="row g-4 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="assignment"
                        label="Total Tasks"
                        value={getStatusCount('All')}
                        badge="Assigned"
                        badgeIcon="info"
                        color="blue"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="check_circle"
                        label="Completed"
                        value={getStatusCount('Completed')}
                        badge="Done"
                        badgeIcon="done_all"
                        color="green"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="pending"
                        label="In Progress"
                        value={getStatusCount('In Progress')}
                        badge="Active"
                        badgeIcon="trending_up"
                        color="yellow"
                    />
                </div>
                <div className="col-12 col-sm-6 col-xl-3">
                    <StatCard
                        icon="list_alt"
                        label="To Do"
                        value={getStatusCount('Todo')}
                        badge="Pending"
                        badgeIcon="hourglass_empty"
                        color="red"
                    />
                </div>
            </div>

            <div className="table-card shadow-sm">
                <div className="table-card-header">
                    <div>
                        <h5 className="mb-1">
                            <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>list_alt</span>
                            {viewMode === 'activity' ? 'Department Tasks' : 'Activity Tasks'}
                        </h5>
                        {viewMode !== 'activity' && (
                            <div className="text-muted small d-flex align-items-center gap-1 ms-4 ps-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>account_tree</span>
                                {activityFilter}
                            </div>
                        )}
                    </div>
                    
                    <div className="d-flex gap-2 align-items-center flex-nowrap ms-auto">
                        {viewMode !== 'activity' ? (
                            <>
                                <select 
                                    className="form-select form-select-sm fw-bold border shadow-sm bg-light text-secondary" 
                                    style={{ width: '150px', fontSize: '0.75rem', height: '32px', borderRadius: '8px', cursor: 'pointer' }}
                                    value={statusFilter}
                                    onChange={(e) => navigate(viewMode, activityFilter, e.target.value)}
                                    title="Filter by status"
                                >
                                    <option value="All">All Progress ({getStatusCount('All')})</option>
                                    <option value="Not Completed">Not Completed ({getStatusCount('Not Completed')})</option>
                                    <option value="In Progress">In Progress ({getStatusCount('In Progress')})</option>
                                    <option value="Completed">Completed ({getStatusCount('Completed')})</option>
                                </select>

                                <button
                                    className="btn btn-sm btn-primary d-flex align-items-center gap-2 fw-bold shadow-sm px-3"
                                    style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)', height: '32px', borderRadius: '8px' }}
                                    onClick={handleOpenCreate}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> New Task
                                </button>

                                <div className="btn-group border rounded-3 p-1 bg-light shadow-sm" style={{ height: '32px' }}>
                                    <button 
                                        className={`btn btn-sm d-flex align-items-center justify-content-center ${viewMode === 'grid' ? 'btn-primary shadow-sm' : 'btn-light border-0'}`}
                                        onClick={() => navigate('grid', activityFilter)}
                                        style={{ borderRadius: '6px', width: '32px', height: '24px', transition: 'all 0.2s', padding: 0 }}
                                        title="Grid View"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>dashboard</span>
                                    </button>
                                    <button 
                                        className={`btn btn-sm d-flex align-items-center justify-content-center ${viewMode === 'table' ? 'btn-primary shadow-sm' : 'btn-light border-0'}`}
                                        onClick={() => navigate('table', activityFilter)}
                                        style={{ borderRadius: '6px', width: '32px', height: '24px', transition: 'all 0.2s', padding: 0 }}
                                        title="Table View"
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>table_rows</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                className="btn btn-sm btn-primary d-flex align-items-center gap-2 fw-bold shadow-sm px-3"
                                style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)', height: '32px', borderRadius: '8px' }}
                                onClick={() => handleOpenCreate()}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span> New Task
                            </button>
                        )}
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedTaskIds.length > 0 && (
                    <div className="alert alert-primary d-flex align-items-center justify-content-between p-2 m-3 shadow-sm border" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534' }}>
                        <div className="d-flex align-items-center gap-2 px-2">
                            <span className="material-symbols-outlined rounded-circle" style={{ fontSize: '20px', color: '#166534' }}>check_circle</span>
                            <span className="fw-bold" style={{ fontSize: '.9rem' }}>{selectedTaskIds.length} tasks selected</span>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                className="btn btn-sm btn-outline-secondary fw-bold bg-white" 
                                onClick={() => setSelectedTaskIds([])}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-sm btn-danger fw-bold d-flex align-items-center gap-1 shadow-sm" 
                                onClick={() => setShowBulkDeleteModal(true)}
                                disabled={isBulkDeleting}
                            >
                                {isBulkDeleting ? (
                                    <span className="spinner-border spinner-border-sm" style={{ width: '14px', height: '14px' }} />
                                ) : (
                                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                                )}
                                Delete Selected
                            </button>
                        </div>
                    </div>
                )}
                                {viewMode === 'activity' ? (
                    <div className="p-4" style={{ background: '#f8fafc' }}>
                        <div className="row g-4">
                            {activityGroups.map((group) => (
                                <div key={group.title} className="col-12 col-md-6 col-xl-4">
                                    <div 
                                        className="card h-100 border-0 shadow-sm" 
                                        style={{ 
                                            transition: 'all 0.3s ease', 
                                            borderRadius: '20px',
                                            cursor: 'default',
                                            backgroundColor: '#ffffff'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-10px)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)';
                                        }}
                                    >
                                        <div className="card-body p-4 d-flex flex-column">
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <span className="badge" style={{ 
                                                        background: group.title === DEPT_INTERNAL_LABEL ? '#f1f5f9' : '#dbeafe', 
                                                        color: group.title === DEPT_INTERNAL_LABEL ? '#475569' : '#1e40af',
                                                        fontSize: '0.7rem'
                                                    }}>
                                                        {group.title === DEPT_INTERNAL_LABEL ? 'Operational' : (group.pillar || 'Strategic Activity')}
                                                    </span>
                                                    {group.startDate && group.endDate && (
                                                        <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                                                            {formatDate(group.startDate)} — {formatDate(group.endDate)}
                                                        </span>
                                                    )}
                                                </div>
                                                <h6 className="card-title fw-bold text-dark mb-1" style={{ fontSize: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3rem' }}>
                                                    {group.title}
                                                </h6>
                                            </div>

                                            {/* KPI Metrics - if available */}
                                            {group.kpiTargetValue != null && (
                                                <div className="mb-3 p-2 rounded bg-light border border-dashed">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>KPI Actual vs Target</span>
                                                        <span className="fw-bold" style={{ fontSize: '0.75rem' }}>
                                                            {group.actualValue || 0} / {group.kpiTargetValue}
                                                        </span>
                                                    </div>
                                                    <div className="progress" style={{ height: '4px' }}>
                                                        <div className="progress-bar bg-info" style={{ width: `${Math.min(100, (group.actualValue || 0) / (group.kpiTargetValue || 1) * 100)}%` }}></div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto">
                                                <div className="d-flex justify-content-between align-items-center mb-1">
                                                    <span className="text-muted small">Completion</span>
                                                    <span className="fw-bold small">{group.avgProgress}%</span>
                                                </div>
                                                <div className="progress mb-3" style={{ height: '8px', borderRadius: '10px' }}>
                                                    <div className="progress-bar" style={{ 
                                                        width: `${group.avgProgress}%`,
                                                        background: group.avgProgress > 70 ? '#10b981' : (group.avgProgress > 30 ? '#f59e0b' : '#3b82f6'),
                                                        borderRadius: '10px'
                                                    }}></div>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                                                    <div className="d-grid flex-grow-1" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{group.total}</div>
                                                            <div className="text-muted small" style={{ fontSize: '0.6rem' }}>Total</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-danger" style={{ fontSize: '0.9rem' }}>{group.todo}</div>
                                                            <div className="text-muted small" style={{ fontSize: '0.6rem' }}>To Do</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-warning" style={{ fontSize: '0.9rem' }}>{group.inProgress}</div>
                                                            <div className="text-muted small" style={{ fontSize: '0.6rem' }}>Doing</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="fw-bold text-success" style={{ fontSize: '0.9rem' }}>{group.completed}</div>
                                                            <div className="text-muted small" style={{ fontSize: '0.6rem' }}>Done</div>
                                                        </div>
                                                    </div>
                                                    <div className="ms-2">
                                                        <button 
                                                            className="btn btn-sm fw-bold d-flex align-items-center gap-1"
                                                            onClick={() => navigate('table', group.title)}
                                                            style={{ borderRadius: '8px', padding: '6px 12px', background: 'var(--mubs-blue)', color: '#fff', fontSize: '0.75rem' }}
                                                        >
                                                            Details
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {activityGroups.length === 0 && (
                                <div className="col-12 text-center py-5">
                                    <div className="text-muted">No activities found matching filters.</div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="p-4" style={{ background: '#f8fafc' }}>
                        <DepartmentTaskCardGrid 
                            tasks={pagedTasks}
                            onEdit={handleOpenEdit}
                            onDelete={handleDeleteTask}
                            onViewEvaluation={handleViewEvaluation}
                            deletingId={deletingId}
                            selectedTaskIds={selectedTaskIds}
                            onToggleTaskSelect={handleToggleTaskSelect}
                        />
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table mb-0 align-middle">
                            <thead className="bg-light">
                            <tr>
                                <th className="ps-4" style={{ width: '40px' }}>
                                    <div className="form-check m-0">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            checked={pagedTasks.length > 0 && pagedTasks.every(t => selectedTaskIds.includes(t.id))}
                                            onChange={handleSelectAll}
                                            style={{ cursor: 'pointer', borderColor: '#cbd5e1' }}
                                        />
                                    </div>
                                </th>
                                <th>Task Title</th>
                                <th>Strategic Activity</th>
                                <th>Task Type</th>
                                <th>Assignee</th>
                                <th>Start Date</th>
                                <th>End date</th>

                                <th>Progress</th>
                                <th>Status</th>
                                <th className="pe-4 text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody key={`tasks-${activityFilter}-${assigneeFilter}-${pagedTasks.length}`}>
                            {pagedTasks.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-5 text-muted">
                                        No tasks found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                pagedTasks.map((task, idx) => (
                                    <tr key={`task-${task.id}-${task.assigned_to ?? 'u'}-${idx}`} className={selectedTaskIds.includes(task.id) ? 'bg-primary bg-opacity-10' : ''}>
                                        <td className="ps-4">
                                            <div className="form-check m-0">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={selectedTaskIds.includes(task.id)}
                                                    onChange={() => handleToggleTaskSelect(task.id)}
                                                    style={{ cursor: 'pointer', borderColor: '#cbd5e1' }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{task.title}</div>
                                            <div className="text-muted small">ID: #{task.id}</div>
                                        </td>
                                        <td>
                                            <span className="text-muted" style={{ fontSize: '.8rem' }}>{task.activity_title || DEPT_INTERNAL_LABEL}</span>
                                        </td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    fontSize: '.65rem',
                                                    fontWeight: 600,
                                                    background: task.task_type === 'kpi_driver' ? '#dbeafe' : '#f1f5f9',
                                                    color: task.task_type === 'kpi_driver' ? '#1e40af' : '#475569'
                                                }}
                                            >
                                                {task.task_type === 'kpi_driver' ? 'KPI-Driver Task (Strategy Plan)' : 'Process Task (Dept Internal)'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="staff-avatar" style={{
                                                    background: 'var(--mubs-blue)',
                                                    width: '28px',
                                                    height: '28px',
                                                    fontSize: '.7rem',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: 'bold'
                                                }} title={task.assignee_name || UNASSIGNED_LABEL}>
                                                    {task.assignee_name?.split(' ').map(n => n[0]).join('') || '?'}
                                                </div>
                                                <span className="fw-semibold text-dark" style={{ fontSize: '.8rem' }}>{task.assignee_name?.split(' ')[0] || UNASSIGNED_LABEL}</span>
                                            </div>
                                        </td>
                                        <td className="small" style={{ fontSize: '.8rem' }}>
                                            <div className="d-flex align-items-center gap-1 text-muted">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                                {formatDate(task.startDate || '')}
                                            </div>
                                        </td>
                                        <td className="small" style={{ fontSize: '.8rem' }}>
                                            <div className="d-flex align-items-center gap-1 text-muted">
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event</span>
                                                {formatDate(task.dueDate)}
                                            </div>
                                        </td>

                                        <td style={{ minWidth: '120px' }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="progress w-100" style={{ height: '6px', borderRadius: '10px' }}>
                                                    <div className="progress-bar" style={{
                                                        width: `${task.progress || 0}%`,
                                                        background: (task.progress || 0) > 70 ? '#10b981' : ((task.progress || 0) > 30 ? '#f59e0b' : '#3b82f6'),
                                                        borderRadius: '10px'
                                                    }}></div>
                                                </div>
                                                <span className="small fw-bold" style={{ fontSize: '.75rem' }}>{task.progress || 0}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="status-badge" style={{
                                                background: task.status === 'Completed' ? '#dcfce7' : (task.status === 'In Progress' ? '#fef9c3' : (task.status === 'Under Review' ? '#eff6ff' : '#f1f5f9')),
                                                color: task.status === 'Completed' ? '#15803d' : (task.status === 'In Progress' ? '#a16207' : (task.status === 'Under Review' ? '#1d4ed8' : '#475569')),
                                                fontSize: '0.7rem',
                                                padding: '4px 8px',
                                                borderRadius: '6px',
                                                fontWeight: '600'
                                            }}>{task.status}</span>
                                        </td>
                                        <td className="pe-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                {task.status === 'Under Review' ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1 py-1 px-2 fw-bold shadow-sm"
                                                        style={{ fontSize: '.75rem', background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }}
                                                        onClick={() => handleViewEvaluation(task.id)}
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>rate_review</span>
                                                        Evaluate
                                                    </button>
                                                ) : task.status === 'Completed' ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-light border py-1 px-2 d-inline-flex align-items-center gap-1"
                                                        style={{ fontSize: '.75rem', color: '#15803d', borderColor: '#86efac' }}
                                                        onClick={() => handleViewEvaluation(task.id)}
                                                        title="View evaluation record"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>visibility</span>
                                                        View evaluation
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-light bg-opacity-50 py-1 px-2 border d-inline-flex align-items-center gap-1"
                                                            style={{ fontSize: '.75rem', color: '#64748b' }}
                                                            onClick={() => handleOpenEdit(task)}
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>edit</span>
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger py-1 px-2 d-inline-flex align-items-center gap-1"
                                                            style={{ fontSize: '.75rem' }}
                                                            onClick={() => handleDeleteTask(task)}
                                                            disabled={deletingId === task.id}
                                                            title="Delete task"
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
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
                {/* Footer: pagination + page count (only show for table/grid) */}
                {viewMode !== 'activity' && (
                    <div className="table-card-footer d-flex align-items-center justify-content-between flex-wrap gap-2" style={{ padding: '0.85rem 1.5rem', borderTop: '1px solid #f1f5f9' }}>
                        <span className="text-muted" style={{ fontSize: '.8rem' }}>
                            Showing <strong>{pagedTasks.length > 0 ? (safePage - 1) * pageSize + 1 : 0}</strong>–<strong>{Math.min(safePage * pageSize, filteredTasks.length)}</strong> of <strong>{filteredTasks.length}</strong> tasks
                        </span>
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted" style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>Rows per page:</span>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: '70px' }}
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                </select>
                            </div>
                            <nav className="m-0">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${safePage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link border-0" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} style={{ backgroundColor: 'transparent', color: safePage === 1 ? '#cbd5e1' : 'var(--mubs-blue)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle' }}>chevron_left</span>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i + 1} className={`page-item ${safePage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link border-0" onClick={() => setCurrentPage(i + 1)} style={{ borderRadius: '4px', margin: '0 2px', backgroundColor: safePage === i + 1 ? 'var(--mubs-blue)' : 'transparent', color: safePage === i + 1 ? '#fff' : '#334155' }}>
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${safePage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link border-0" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} style={{ backgroundColor: 'transparent', color: safePage === totalPages ? '#cbd5e1' : 'var(--mubs-blue)' }}>
                                            <span className="material-symbols-outlined" style={{ fontSize: '18px', verticalAlign: 'middle' }}>chevron_right</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Task Modal UI */}
            {showTaskModal && (
                <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
            )}
            <div className={`modal fade ${showTaskModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                        <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                            <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>{taskForm.id ? 'edit_square' : 'add_task'}</span>
                                {taskForm.id ? 'Edit Task' : 'New Task'}
                            </h6>
                            <button type="button" className="btn-close" onClick={() => setShowTaskModal(false)}></button>
                        </div>
                        <div className="modal-body p-4">
                            {taskForm.activity_id && (
                                <div className="alert alert-info py-3 px-3 mb-4 d-flex align-items-center gap-3 border-0 shadow-sm" style={{ fontSize: '0.85rem', background: '#eef2ff', color: '#3730a3', borderRadius: '12px' }}>
                                    <div className="bg-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm">
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>account_tree</span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="fw-bold text-uppercase opacity-75 mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>Strategic Parent Activity</div>
                                        {(() => {
                                            const meta = availableActivities.find(a => a.id === taskForm.activity_id);
                                            return (
                                                <div className="d-flex flex-column gap-1">
                                                    <span className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.3' }}>{meta?.title}</span>
                                                    <div className="d-flex align-items-center gap-3 opacity-75" style={{ fontSize: '0.75rem' }}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schema</span>
                                                            <span>{meta?.pillar || 'Pillar'}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                                            <span>Ends {meta?.end_date ? formatDate(meta.end_date) : 'N/A'}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>ads_click</span>
                                                            <span className="fw-bold">KPI Target: {meta?.target_kpi || meta?.kpi_target_value || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                            )}
                            <form onSubmit={handleSaveTask} id="taskForm">
                                <div className="row g-2">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Task Title <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control form-control-sm" style={{ fontSize: '0.8rem' }} required value={taskForm.title || ''} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} placeholder="E.g. Identify 5 new vendors" />
                                    </div>
                                    {!taskForm.isFixedFields && (
                                        <div className="col-12">
                                            <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Task Type <span className="text-danger">*</span></label>
                                            <select className="form-select form-select-sm" style={{ fontSize: '0.8rem' }} value={taskForm.task_type || 'process'} onChange={(e) => {
                                                const type = e.target.value as 'process' | 'kpi_driver';
                                                setTaskForm({ ...taskForm, task_type: type, kpi_target_value: type === 'kpi_driver' ? taskForm.kpi_target_value : null, activity_id: type === 'process' ? undefined : taskForm.activity_id });
                                            }}>
                                                <option value="process">{TASK_TYPE_LABELS.process}</option>
                                                <option value="kpi_driver">{TASK_TYPE_LABELS.kpi_driver}</option>
                                            </select>
                                        </div>
                                    )}
                                    {!taskForm.isFixedFields && (
                                        <div className="col-md-12">
                                            <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                                                Parent Strategic Activity {(taskForm.task_type || 'process') === 'kpi_driver' && <span className="text-danger">*</span>}
                                            </label>
                                            {(taskForm.task_type || 'process') === 'process' ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm bg-light"
                                                        value="— None (internal only) —"
                                                        readOnly
                                                        disabled
                                                        style={{ cursor: 'not-allowed', fontSize: '0.75rem' }}
                                                    />
                                                    <small className="text-muted d-block mt-1" style={{ fontSize: '0.65rem' }}>Process tasks are departmental and not linked to a strategic activity.</small>
                                                </>
                                            ) : (
                                                <div>
                                                    <select
                                                        className="form-select form-select-sm"
                                                        style={{ fontSize: '0.8rem' }}
                                                        required
                                                        value={taskForm.activity_id ?? ''}
                                                        onChange={(e) => {
                                                            const actId = e.target.value === '' ? undefined : parseInt(e.target.value);
                                                            const selectedAct = actId ? availableActivities.find(a => a.id === actId) : undefined;
                                                            const newEndDate = selectedAct?.end_date ? toYMD(new Date(selectedAct.end_date)) : taskForm.endDate;
                                                            const newStartDate = selectedAct?.start_date ? toYMD(new Date(selectedAct.start_date)) : taskForm.startDate;
                                                            setTaskForm({ ...taskForm, activity_id: actId, startDate: newStartDate, endDate: newEndDate });
                                                        }}
                                                    >
                                                        <option value="">— Select Parent Activity —</option>
                                                        {availableActivities.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                                                    </select>
                                                    {taskForm.activity_id && taskForm.endDate && (
                                                        <div className="mt-1">
                                                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle" style={{ fontSize: '0.65rem' }}>
                                                                Ends on {new Date(taskForm.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {!taskForm.activity_id && (
                                                        <small className="text-muted d-block mt-1" style={{ fontSize: '0.65rem' }}>KPI-Driver tasks must be linked to a strategic activity.</small>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Assign To</label>
                                        {taskForm.id ? (
                                            <select className="form-select form-select-sm" style={{ fontSize: '0.8rem' }} value={taskForm.assigned_to || ''} onChange={(e) => setTaskForm({ ...taskForm, assigned_to: parseInt(e.target.value) || undefined })}>
                                                <option value="">Unassigned</option>
                                                {departmentUsers.map(u => (
                                                    <option key={u.id} value={u.id}>
                                                        {u.full_name}{u.position ? ` (${u.position})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="border rounded p-2 bg-light" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                                <p className="text-muted mb-1" style={{ fontSize: '0.65rem' }}>Select one or more staff</p>
                                                {departmentUsers.map(u => {
                                                    const ids = taskForm.assigned_to_ids || [];
                                                    const checked = ids.includes(u.id);
                                                    return (
                                                        <div key={u.id} className="form-check mb-1">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`assign-${u.id}`}
                                                                checked={checked}
                                                                onChange={() => {
                                                                    const next = checked ? ids.filter((id) => id !== u.id) : [...ids, u.id];
                                                                    setTaskForm({ ...taskForm, assigned_to_ids: next });
                                                                }}
                                                            />
                                                            <label className="form-check-label" htmlFor={`assign-${u.id}`} style={{ fontSize: '0.75rem' }}>
                                                                {u.full_name}{u.position ? ` (${u.position})` : ''}
                                                            </label>
                                                        </div>
                                                    );
                                                })}
                                                {departmentUsers.length === 0 && <span className="text-muted" style={{ fontSize: '0.7rem' }}>No staff found.</span>}
                                            </div>
                                        )}
                                    </div>

                                    {/* Interval Validation Logic */}
                                    {(() => {
                                        const calculateMaxInterval = () => {
                                            if (!taskForm.startDate || !taskForm.endDate || taskForm.frequency === 'once') return { max: 0, unit: '' };
                                            const start = new Date(taskForm.startDate);
                                            const end = new Date(taskForm.endDate);
                                            const gapDays = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                                            
                                            let max = 0;
                                            let unit = '';
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
                                                <div className={`col-6 ${taskForm.task_type === 'kpi_driver' ? 'd-none' : ''}`}>
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
                                                                                    <span className="fw-bold text-primary">{idx + 1}{idx === 0 ? 'st' : idx === 1 ? 'nd' : idx === 2 ? 'rd' : 'th'}</span>
                                                                                    <span className="text-muted">task:</span>
                                                                                    <span className="text-dark fw-medium">{formatDate(occ.startDate)} – {formatDate(occ.endDate)}</span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {taskForm.frequency === 'once' && (
                                                                    <div className="text-muted small italic" style={{ fontSize: '0.7rem' }}>
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
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>Instructions</label>
                                        <textarea className="form-control" style={{ fontSize: '0.9rem' }} rows={3} value={taskForm.description || ''} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} placeholder="Requirements..."></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer bg-light border-top-0 py-3">
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
                                    <button 
                                        type="submit" 
                                        form="taskForm" 
                                        className="btn btn-primary fw-bold px-4 shadow-sm" 
                                        style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)', borderRadius: '8px' }} 
                                        disabled={isSubmitting || isInvalid}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Save Task'}
                                    </button>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>


            {/* Bulk Delete Confirmation Modal UI */}
            {showBulkDeleteModal && (
                <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>
            )}
            <div className={`modal fade ${showBulkDeleteModal ? 'show d-block' : ''}`} tabIndex={-1} style={{ zIndex: 1050 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
                        <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                            <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                <span className="material-symbols-outlined text-danger" style={{ fontSize: '24px' }}>warning</span>
                                Delete Tasks
                            </h6>
                            <button type="button" className="btn-close" onClick={() => setShowBulkDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body p-4 pt-3">
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
                                Delete <strong>{selectedTaskIds.length}</strong> task{selectedTaskIds.length !== 1 ? 's' : ''}? This cannot be undone.
                            </p>
                            
                            {bulkDeleteError && (
                                <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger d-flex align-items-center p-2 mb-3" style={{ fontSize: '0.85rem' }}>
                                    <span className="material-symbols-outlined me-2" style={{ fontSize: '18px' }}>error</span>
                                    {bulkDeleteError}
                                </div>
                            )}

                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-sm btn-light border fw-bold px-3" style={{ fontSize: '0.75rem', borderRadius: '8px' }} onClick={() => setShowBulkDeleteModal(false)} disabled={isBulkDeleting}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-sm btn-danger fw-bold px-3 shadow-sm" style={{ fontSize: '0.75rem', borderRadius: '8px' }} onClick={handleBulkDelete} disabled={isBulkDeleting}>
                                    {isBulkDeleting ? 'Deleting...' : 'Delete All'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* In-Page Evaluation Modals */}
            {(evaluateModalItem || viewModalItem || isEvaluationLoading) && (
                <div className="modal-backdrop fade show" style={{ zIndex: 1060, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)' }}></div>
            )}

            {/* 1. View Details Modal */}
            <div className={`modal fade ${viewModalItem ? 'show d-block' : ''}`} tabIndex={-1} style={{ zIndex: 1070 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                            <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>description</span>
                                Evaluation Record
                            </h6>
                            <button type="button" className="btn-close" onClick={() => setViewModalItem(null)}></button>
                        </div>
                        {viewModalItem && (
                            <div className="modal-body p-4">
                                <div className="p-3 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-3">
                                        <div className="flex-fill">
                                            <div className="d-flex align-items-center gap-3 mb-2">
                                                <div className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>{viewModalItem.report_name}</div>
                                                <span className="badge" style={{
                                                    background: viewModalItem.status === 'Completed' ? '#dcfce7' : '#fee2e2',
                                                    color: viewModalItem.status === 'Completed' ? '#15803d' : '#b91c1c',
                                                    fontSize: '.75rem',
                                                    padding: '4px 8px',
                                                    borderRadius: '6px'
                                                }}>{viewModalItem.status === 'Completed' ? 'Accepted' : 'Returned'}</span>
                                            </div>
                                            <div className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                                                <span className="material-symbols-outlined me-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>category</span>
                                                {viewModalItem.activity_title}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                <span className="material-symbols-outlined me-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>person</span>
                                                {viewModalItem.staff_name} &middot; {formatDate(viewModalItem.submitted_at)}
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center gap-4 mt-3 pt-3 border-top w-100">
                                            <div className="flex-grow-1">
                                                <div className="text-dark fw-bold mb-2" style={{ fontSize: '0.7rem', letterSpacing: '.05em' }}>REPORTED PROGRESS</div>
                                                <div className="progress" style={{ height: '8px', borderRadius: '4px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${viewModalItem.progress || 0}%` }}></div>
                                                </div>
                                            </div>
                                            <div className="fw-black text-primary" style={{ fontSize: '1.1rem' }}>{viewModalItem.progress || 0}%</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '18px' }}>subject</span>
                                        Report Summary
                                    </label>
                                    <div className="p-3 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light">
                                            <span className="text-muted fw-bold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>ACHIEVED KPI VALUE</span>
                                            <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.9rem', borderRadius: '8px' }}>{viewModalItem.kpi_actual_value ?? 0}</span>
                                        </div>
                                        <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                            {viewModalItem.report_summary || 'No summary provided.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-3" style={{ 
                                    background: viewModalItem.status === 'Completed' ? '#f0fdf4' : '#fff1f2', 
                                    border: `1px solid ${viewModalItem.status === 'Completed' ? '#dcfce7' : '#fee2e2'}` 
                                }}>
                                    <div className="row g-3 align-items-center">
                                        <div className="col-4 text-center border-end">
                                            <div className="fw-black text-dark" style={{ fontSize: '1.4rem', lineHeight: '1' }}>{viewModalItem.score ?? '-'}</div>
                                            <div className="text-muted fw-bold mt-2" style={{ fontSize: '0.6rem', letterSpacing: '0.5px' }}>RATING</div>
                                            <div className="fw-bold mt-2" style={{ 
                                                fontSize: '0.8rem',
                                                color: getRatingLabel(viewModalItem) === 'Complete' ? '#15803d' : (getRatingLabel(viewModalItem) === 'Not Done' ? '#64748b' : '#b45309')
                                            }}>
                                                {getRatingLabel(viewModalItem)}
                                            </div>
                                        </div>
                                        <div className="col-8 ps-4">
                                            <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                                                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '18px' }}>forum</span>
                                                Feedback
                                            </div>
                                            <p className="mb-0 text-dark italic" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                                                {viewModalItem.reviewer_notes ? `"${viewModalItem.reviewer_notes}"` : 'No feedback.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Evaluate Modal */}
            <div className={`modal fade ${evaluateModalItem ? 'show d-block' : ''}`} tabIndex={-1} style={{ zIndex: 1070 }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <div className="modal-header border-bottom-0 pb-0 px-4 pt-4">
                            <h6 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.1rem' }}>
                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>rate_review</span>
                                Evaluate Submission
                            </h6>
                            <button type="button" className="btn-close" onClick={() => setEvaluateModalItem(null)}></button>
                        </div>
                        <div className="modal-body p-4 pt-3">
                            {evaluateModalItem && (
                                <>
                                <div className="p-3 rounded-3 mb-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                    <div className="fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                                        {evaluateModalItem.report_name}
                                        <span className="badge ms-2 fw-semibold" style={{ background: '#eff6ff', color: 'var(--mubs-blue)', fontSize: '.75rem', verticalAlign: 'middle' }}>Pending</span>
                                    </div>
                                    <div className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                                        <span className="material-symbols-outlined me-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>category</span>
                                        {evaluateModalItem.activity_title}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                        <span className="material-symbols-outlined me-2" style={{ fontSize: '16px', verticalAlign: 'middle' }}>person</span>
                                        {evaluateModalItem.staff_name} &middot; {formatDate(evaluateModalItem.submitted_at)}
                                    </div>
                                    {evaluateModalItem.report_summary && (
                                        <div className="mt-3 pt-3 border-top border-light">
                                            <div className="fw-semibold text-dark mb-1" style={{ fontSize: '0.8rem' }}>Summary</div>
                                            <p className="mb-0 text-secondary" style={{ fontSize: '0.9rem', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                                                {evaluateModalItem.report_summary}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>attach_file</span>
                                        Evidence
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {parseEvidenceItems(evaluateModalItem.attachments).length === 0 ? (
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>No evidence provided</span>
                                        ) : (
                                            parseEvidenceItems(evaluateModalItem.attachments).map((ev, idx) => (
                                                <button key={idx} type="button" className="btn btn-xs btn-outline-primary py-0 px-2 d-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }} onClick={() => window.open(ev.url, '_blank')}>
                                                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>visibility</span>
                                                    {ev.label}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-12">
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Rating <span className="text-danger">*</span></label>
                                        <div className="d-flex gap-1">
                                            {(['Complete', 'Incomplete', 'Not Done'] as const).map(opt => (
                                                <div 
                                                    key={opt}
                                                    onClick={() => setSelectedRating(prev => ({ ...prev, [evaluateModalItem.id]: opt }))}
                                                    className="flex-fill text-center p-1 rounded-2 border"
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 'bold',
                                                        transition: 'all 0.2s',
                                                        borderColor: selectedRating[evaluateModalItem.id] === opt ? 'var(--mubs-blue)' : '#e2e8f0',
                                                        background: selectedRating[evaluateModalItem.id] === opt ? 'var(--mubs-blue)' : '#fff',
                                                        color: selectedRating[evaluateModalItem.id] === opt ? '#fff' : '#475569'
                                                    }}
                                                >
                                                    {opt === 'Complete' ? '2 (Done)' : opt === 'Incomplete' ? '1 (Part)' : '0 (No)'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* KPI achieved value: Visible for KPI-Driver tasks */}
                                    {evaluateModalItem.task_type === 'kpi_driver' && (
                                        <div className="col-12">
                                            <label className="form-label fw-semibold mb-1 d-flex align-items-center gap-2" style={{ fontSize: '0.75rem' }}>
                                                <span className="material-symbols-outlined text-primary" style={{ fontSize: '16px' }}>analytics</span>
                                                Achieved value
                                            </label>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm fw-bold border-primary-subtle shadow-sm"
                                                    min={0}
                                                    step="any"
                                                    placeholder="0"
                                                    value={kpiActualValues[evaluateModalItem.id] ?? ''}
                                                    onChange={(e) => setKpiActualValues(prev => ({ ...prev, [evaluateModalItem.id]: e.target.value }))}
                                                    style={{ maxWidth: '100px', borderRadius: '8px', fontSize: '0.85rem' }}
                                                />
                                                {evaluateModalItem.kpi_actual_value != null && (
                                                    <div className="text-muted border-start ps-2 py-0">
                                                        <div style={{ fontSize: '0.55rem', fontWeight: 'bold' }}>STAFF:</div>
                                                        <div className="text-dark fw-black" style={{ fontSize: '0.8rem' }}>{evaluateModalItem.kpi_actual_value}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-12">
                                        <label className="form-label fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>Comment {selectedRating[evaluateModalItem.id] === 'Incomplete' && <span className="text-danger">*</span>}</label>
                                        <textarea
                                            className="form-control form-control-sm"
                                            rows={2}
                                            placeholder="Feedback..."
                                            value={evaluationComments[evaluateModalItem.id] || ''}
                                            onChange={(e) => setEvaluationComments(prev => ({ ...prev, [evaluateModalItem.id]: e.target.value }))}
                                            style={{ fontSize: '0.8rem' }}
                                        ></textarea>
                                    </div>
                                </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer bg-light border-top-0 py-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-primary fw-bold px-4 shadow-sm"
                                style={{ borderRadius: '8px' }}
                                disabled={isSubmitting || !evaluateModalItem || !selectedRating[evaluateModalItem.id]}
                                onClick={handleSubmitEvaluation}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Spinner for Evaluation Fetch */}
            {isEvaluationLoading && (
                <div className="position-fixed top-50 start-50 translate-middle" style={{ zIndex: 1080 }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

        </div>
    );
}
