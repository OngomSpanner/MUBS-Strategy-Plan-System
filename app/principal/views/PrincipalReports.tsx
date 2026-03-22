'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const HISTORY_KEY = 'principal-report-history';
const MAX_HISTORY = 10;

type ReportType = 'executive' | 'department' | 'staff' | 'risk';
type ApiReportType = 'activity-summary' | 'staff-evaluation' | 'delayed-activities';
type ExportFormat = 'PDF' | 'Excel';
type PeriodPreset = 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'ytd' | 'last_year' | 'custom';

interface ReportHistoryItem {
    id: string;
    reportType: ReportType;
    title: string;
    subtitle: string;
    scopeLabel: string;
    generatedAt: string;
    format: ExportFormat;
    params: { from?: string; to?: string; department?: string };
}

interface ShareContext {
    reportType: ReportType;
    title: string;
    subtitle: string;
    params: { from?: string; to?: string; department?: string };
}

const REPORT_TITLES: Record<ReportType, string> = {
    executive: 'Executive Summary',
    department: 'Department Performance Report',
    staff: 'Staff Evaluation Report',
    risk: 'Risk & Delayed Activities',
};

const REPORT_DESCRIPTIONS: Record<ReportType, string> = {
    executive: 'Institutional overview for council or board — KPIs and compliance.',
    department: 'Per-department breakdown and comparison for internal review.',
    staff: 'Individual and departmental evaluation scores and completion rates.',
    risk: 'Overdue activities, escalation and risk mitigation status.',
};

const REPORT_API_TYPE: Record<ReportType, ApiReportType> = {
    executive: 'activity-summary',
    department: 'activity-summary',
    staff: 'staff-evaluation',
    risk: 'delayed-activities',
};

const getScore = (progress: number) =>
    progress >= 80 ? 'Excellent' : progress >= 65 ? 'Good' : progress >= 50 ? 'Fair' : 'Poor';

const getEvaluation = (rate: number) =>
    rate >= 80 ? 'Excellent' : rate >= 60 ? 'Good' : rate >= 40 ? 'Fair' : 'Poor';

function getPeriodDatesFromPreset(preset: PeriodPreset, customFrom?: string, customTo?: string): { from?: string; to?: string; label: string } {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const firstOfMonth = (year: number, month: number) => {
        const d = new Date(year, month, 1);
        return d.toISOString().slice(0, 10);
    };
    const lastOfMonth = (year: number, month: number) => {
        const d = new Date(year, month + 1, 0);
        return d.toISOString().slice(0, 10);
    };
    if (preset === 'custom' && customFrom && customTo) {
        return { from: customFrom, to: customTo, label: `Custom (${customFrom} – ${customTo})` };
    }
    switch (preset) {
        case 'this_month': {
            const from = firstOfMonth(y, m), to = lastOfMonth(y, m);
            return { from, to, label: `${now.toLocaleString('en-GB', { month: 'short' })} ${y}` };
        }
        case 'last_month': {
            const from = firstOfMonth(y, m - 1), to = lastOfMonth(y, m - 1);
            const last = new Date(y, m - 1);
            return { from, to, label: `${last.toLocaleString('en-GB', { month: 'short' })} ${y}` };
        }
        case 'this_quarter': {
            const q = Math.floor(m / 3) + 1;
            const startM = (q - 1) * 3;
            const from = firstOfMonth(y, startM), to = lastOfMonth(y, startM + 2);
            return { from, to, label: `Q${q} ${y}` };
        }
        case 'last_quarter': {
            const q = Math.floor(m / 3) + 1;
            const prevQ = q === 1 ? 4 : q - 1;
            const prevY = q === 1 ? y - 1 : y;
            const startM = (prevQ - 1) * 3;
            const from = firstOfMonth(prevY, startM), to = lastOfMonth(prevY, startM + 2);
            return { from, to, label: `Q${prevQ} ${prevY}` };
        }
        case 'ytd':
            return { from: `${y}-01-01`, to: lastOfMonth(y, m), label: `YTD ${y}` };
        case 'last_year':
            return { from: `${y - 1}-01-01`, to: `${y - 1}-12-31`, label: `Annual ${y - 1}` };
        default:
            return { label: 'All data' };
    }
}

const PERIOD_PRESET_OPTIONS: { value: PeriodPreset; label: string }[] = [
    { value: 'this_quarter', label: 'This quarter' },
    { value: 'last_quarter', label: 'Last quarter' },
    { value: 'this_month', label: 'This month' },
    { value: 'last_month', label: 'Last month' },
    { value: 'ytd', label: 'Year to date' },
    { value: 'last_year', label: 'Last year' },
    { value: 'custom', label: 'Custom range' },
];

function useReportFetch() {
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchReport = useCallback(async (
        type: ApiReportType,
        params: { from?: string; to?: string; department?: string } = {}
    ) => {
        const key = `${type}-${JSON.stringify(params)}`;
        setLoading(key);
        setError(null);
        try {
            const searchParams = new URLSearchParams();
            searchParams.set('type', type);
            if (params.from) searchParams.set('from', params.from);
            if (params.to) searchParams.set('to', params.to);
            if (params.department && params.department !== 'All Departments') searchParams.set('department', params.department);
            const { data } = await axios.get(`/api/reports?${searchParams.toString()}`);
            return data;
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Failed to load report';
            setError(msg);
            throw new Error(msg);
        } finally {
            setLoading(null);
        }
    }, []);

    return { fetchReport, loading, error };
}

export default function PrincipalReports() {
    const [departments, setDepartments] = useState<string[]>([]);
    const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('this_quarter');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [reportHistory, setReportHistory] = useState<ReportHistoryItem[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    /* Report builder */
    const [builderOpen, setBuilderOpen] = useState(false);
    const [builderStep, setBuilderStep] = useState<1 | 2 | 3>(1);
    const [builderType, setBuilderType] = useState<ReportType | null>(null);
    const [builderPeriod, setBuilderPeriod] = useState<PeriodPreset>('this_quarter');
    const [builderCustomFrom, setBuilderCustomFrom] = useState('');
    const [builderCustomTo, setBuilderCustomTo] = useState('');
    const [builderDepartment, setBuilderDepartment] = useState('All Departments');
    const [builderFormat, setBuilderFormat] = useState<ExportFormat>('PDF');
    const [builderGenerating, setBuilderGenerating] = useState(false);

    /* Share by email modal */
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareContext, setShareContext] = useState<ShareContext | null>(null);
    const [shareToEmail, setShareToEmail] = useState('');
    const [shareFormat, setShareFormat] = useState<ExportFormat>('PDF');
    const [shareSending, setShareSending] = useState(false);

    const { fetchReport, loading } = useReportFetch();

    useEffect(() => {
        axios.get('/api/departments')
            .then(({ data }) => setDepartments((Array.isArray(data) ? data : []).map((d: any) => d.name)))
            .catch(() => setDepartments([]));
    }, []);

    useEffect(() => {
        try {
            const raw = typeof window !== 'undefined' ? localStorage.getItem(HISTORY_KEY) : null;
            const parsed = raw ? JSON.parse(raw) : [];
            if (Array.isArray(parsed) && parsed.length > 0) {
                const migrated = parsed.slice(0, MAX_HISTORY).map((item: ReportHistoryItem) => ({
                    ...item,
                    scopeLabel: item.scopeLabel ?? (item.params ? `${(item.params.from && item.params.to) ? `${item.params.from} – ${item.params.to}` : 'All'} · ${item.params.department || 'All'}` : '—'),
                }));
                setReportHistory(migrated);
            }
        } catch {
            setReportHistory([]);
        }
    }, []);

    const persistHistory = useCallback((next: ReportHistoryItem[]) => {
        setReportHistory(next);
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(next.slice(0, MAX_HISTORY)));
            }
        } catch {}
    }, []);

    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const getParamsFromFilters = useCallback((): { from?: string; to?: string; department?: string } => {
        const { from, to } = getPeriodDatesFromPreset(periodPreset, dateFrom, dateTo);
        return {
            from,
            to,
            department: departmentFilter !== 'All Departments' ? departmentFilter : undefined,
        };
    }, [periodPreset, dateFrom, dateTo, departmentFilter]);

    const getBuilderParams = useCallback((): { from?: string; to?: string; department?: string } => {
        const { from, to } = getPeriodDatesFromPreset(builderPeriod, builderCustomFrom, builderCustomTo);
        return {
            from,
            to,
            department: builderDepartment !== 'All Departments' ? builderDepartment : undefined,
        };
    }, [builderPeriod, builderCustomFrom, builderCustomTo, builderDepartment]);

    const addToHistory = useCallback((
        reportType: ReportType,
        title: string,
        subtitle: string,
        scopeLabel: string,
        format: ExportFormat,
        params: { from?: string; to?: string; department?: string }
    ) => {
        const item: ReportHistoryItem = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            reportType,
            title,
            subtitle,
            scopeLabel,
            generatedAt: new Date().toISOString(),
            format,
            params,
        };
        setReportHistory(prev => {
            const next = [item, ...prev].slice(0, MAX_HISTORY);
            try {
                if (typeof window !== 'undefined') localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
            } catch {}
            return next;
        });
    }, []);

    const exportExcel = useCallback(async (
        reportType: ReportType,
        params: { from?: string; to?: string; department?: string },
        title: string,
        subtitle: string,
        skipHistory?: boolean
    ) => {
        const apiType = REPORT_API_TYPE[reportType];
        try {
            const res = await fetchReport(apiType, params);
            const raw = (res.data || []) as any[];

            if (reportType === 'executive' || reportType === 'department') {
                const rows = raw.map((r: any) => ({
                    Department: r.department,
                    'Total Activities': Number(r.total_activities ?? 0),
                    Completed: Number(r.completed ?? 0),
                    'In Progress': Number(r.in_progress ?? 0),
                    Delayed: Number(r.delayed_cnt ?? 0),
                    'Avg Progress (%)': Number(r.avg_progress ?? 0),
                    Score: getScore(Number(r.avg_progress ?? 0)),
                }));
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Report');
                XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
            } else if (reportType === 'staff') {
                const rows = raw.map((r: any) => ({
                    'Staff Name': r.name,
                    Department: r.department ?? '—',
                    Assigned: Number(r.assigned ?? 0),
                    Completed: Number(r.completed ?? 0),
                    'Completion Rate (%)': Number(r.rate ?? 0),
                    Evaluation: getEvaluation(Number(r.rate ?? 0)),
                }));
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Report');
                XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
            } else {
                const rows = raw.map((r: any) => ({
                    Title: r.title,
                    Department: r.department,
                    Deadline: r.deadline,
                    'Days Overdue': r.days_overdue,
                    'Progress (%)': r.progress,
                    Status: r.status,
                }));
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Report');
                XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
            }
            if (!skipHistory) {
                const periodInfo = getPeriodDatesFromPreset('custom', params.from, params.to);
                const periodLabel = params.from && params.to ? `${params.from} – ${params.to}` : 'All data';
                const deptLabel = params.department || 'All';
                addToHistory(reportType, title, subtitle, `${periodLabel} · ${deptLabel}`, 'Excel', params);
            }
            showToast('Report downloaded.');
        } catch {
            showToast('Failed to generate report.', 'error');
        }
    }, [fetchReport, addToHistory, showToast]);

    const exportPDF = useCallback(async (
        reportType: ReportType,
        params: { from?: string; to?: string; department?: string },
        title: string,
        subtitle: string,
        skipHistory?: boolean
    ) => {
        const apiType = REPORT_API_TYPE[reportType];
        try {
            const res = await fetchReport(apiType, params);
            const raw = (res.data || []) as any[];

            const { default: jsPDF } = await import('jspdf');
            const { default: autoTable } = await import('jspdf-autotable');
            const doc = new jsPDF({ orientation: 'landscape' });
            doc.setFontSize(14);
            doc.text(title, 14, 15);
            doc.setFontSize(9);
            doc.text(subtitle || `Generated: ${new Date().toLocaleString()}`, 14, 22);

            if (reportType === 'executive' || reportType === 'department') {
                const body = raw.map((r: any) => [
                    r.department,
                    Number(r.total_activities ?? 0),
                    Number(r.completed ?? 0),
                    Number(r.in_progress ?? 0),
                    Number(r.delayed_cnt ?? 0),
                    `${Number(r.avg_progress ?? 0)}%`,
                    getScore(Number(r.avg_progress ?? 0)),
                ]);
                autoTable(doc, {
                    startY: 28,
                    head: [['Department', 'Total', 'Completed', 'In Progress', 'Delayed', 'Avg Progress', 'Score']],
                    body,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [30, 92, 164] },
                });
            } else if (reportType === 'staff') {
                const body = raw.map((r: any) => [
                    r.name,
                    r.department ?? '—',
                    Number(r.assigned ?? 0),
                    Number(r.completed ?? 0),
                    `${Number(r.rate ?? 0)}%`,
                    getEvaluation(Number(r.rate ?? 0)),
                ]);
                autoTable(doc, {
                    startY: 28,
                    head: [['Staff Name', 'Department', 'Assigned', 'Completed', 'Rate', 'Evaluation']],
                    body,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [30, 92, 164] },
                });
            } else {
                const body = raw.map((r: any) => [
                    (r.title || '').slice(0, 40),
                    r.department,
                    r.deadline,
                    r.days_overdue,
                    `${r.progress ?? 0}%`,
                    r.status,
                ]);
                autoTable(doc, {
                    startY: 28,
                    head: [['Title', 'Department', 'Deadline', 'Days Overdue', 'Progress', 'Status']],
                    body,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [30, 92, 164] },
                });
            }
            doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
            if (!skipHistory) {
                const periodLabel = params.from && params.to ? `${params.from} – ${params.to}` : 'All data';
                const deptLabel = params.department || 'All';
                addToHistory(reportType, title, subtitle, `${periodLabel} · ${deptLabel}`, 'PDF', params);
            }
            showToast('Report downloaded.');
        } catch {
            showToast('Failed to generate report.', 'error');
        }
    }, [fetchReport, addToHistory, showToast]);

    const params = getParamsFromFilters();
    const isCardLoading = (key: ReportType) => loading !== null && loading.startsWith(REPORT_API_TYPE[key]);

    const openBuilder = useCallback((prefill?: { type?: ReportType; period?: PeriodPreset; department?: string }) => {
        setBuilderStep(1);
        setBuilderType(prefill?.type ?? null);
        setBuilderPeriod(prefill?.period ?? 'this_quarter');
        setBuilderDepartment(prefill?.department ?? departmentFilter);
        setBuilderFormat('PDF');
        setBuilderCustomFrom(dateFrom);
        setBuilderCustomTo(dateTo);
        setBuilderOpen(true);
    }, [departmentFilter, dateFrom, dateTo]);

    const handleBuilderGenerate = useCallback(async () => {
        if (builderType == null) return;
        const p = getBuilderParams();
        const { label: periodLabel } = getPeriodDatesFromPreset(builderPeriod, builderCustomFrom, builderCustomTo);
        const title = REPORT_TITLES[builderType];
        const subtitle = builderDepartment !== 'All Departments' ? builderDepartment : (p.from && p.to ? `${p.from} – ${p.to}` : periodLabel);
        const scopeLabel = `${periodLabel} · ${builderDepartment !== 'All Departments' ? builderDepartment : 'All'}`;
        setBuilderGenerating(true);
        try {
            if (builderFormat === 'PDF') {
                await exportPDF(builderType, p, title, subtitle, false);
            } else {
                await exportExcel(builderType, p, title, subtitle, false);
            }
            setBuilderOpen(false);
        } finally {
            setBuilderGenerating(false);
        }
    }, [builderType, builderPeriod, builderCustomFrom, builderCustomTo, builderDepartment, builderFormat, getBuilderParams, exportPDF, exportExcel]);

    const handleBuilderEmail = useCallback(() => {
        if (builderType == null) return;
        const p = getBuilderParams();
        const title = REPORT_TITLES[builderType];
        const { label: periodLabel } = getPeriodDatesFromPreset(builderPeriod, builderCustomFrom, builderCustomTo);
        const subtitle = builderDepartment !== 'All Departments' ? builderDepartment : periodLabel;
        setShareContext({ reportType: builderType, title, subtitle, params: p });
        setShareToEmail('');
        setShareFormat(builderFormat);
        setBuilderOpen(false);
        setShareModalOpen(true);
    }, [builderType, builderPeriod, builderCustomFrom, builderCustomTo, builderDepartment, builderFormat, getBuilderParams]);

    const handleCardExport = (reportType: ReportType, format: ExportFormat) => {
        const title = REPORT_TITLES[reportType];
        const { label: periodLabel } = getPeriodDatesFromPreset(periodPreset, dateFrom, dateTo);
        const subtitle = departmentFilter !== 'All Departments' ? departmentFilter : periodLabel;
        if (format === 'PDF') {
            exportPDF(reportType, params, title, subtitle);
        } else {
            exportExcel(reportType, params, title, subtitle);
        }
    };

    const openShareModal = (reportType: ReportType) => {
        const title = REPORT_TITLES[reportType];
        const { label: periodLabel } = getPeriodDatesFromPreset(periodPreset, dateFrom, dateTo);
        const subtitle = departmentFilter !== 'All Departments' ? departmentFilter : periodLabel;
        setShareContext({ reportType, title, subtitle, params });
        setShareToEmail('');
        setShareFormat('PDF');
        setShareModalOpen(true);
    };

    const openShareModalFromItem = (item: ReportHistoryItem) => {
        setShareContext({ reportType: item.reportType, title: item.title, subtitle: item.subtitle, params: item.params });
        setShareToEmail('');
        setShareFormat('PDF');
        setShareModalOpen(true);
    };

    const generateReportBase64 = useCallback(async (
        reportType: ReportType,
        params: { from?: string; to?: string; department?: string },
        title: string,
        subtitle: string,
        format: ExportFormat
    ): Promise<{ fileBase64: string; fileName: string }> => {
        const apiType = REPORT_API_TYPE[reportType];
        const res = await fetchReport(apiType, params);
        const raw = (res.data || []) as any[];
        const safeName = title.replace(/\s+/g, '_');

        if (format === 'Excel') {
            let rows: any[];
            if (reportType === 'executive' || reportType === 'department') {
                rows = raw.map((r: any) => ({
                    Department: r.department,
                    'Total Activities': Number(r.total_activities ?? 0),
                    Completed: Number(r.completed ?? 0),
                    'In Progress': Number(r.in_progress ?? 0),
                    Delayed: Number(r.delayed_cnt ?? 0),
                    'Avg Progress (%)': Number(r.avg_progress ?? 0),
                    Score: getScore(Number(r.avg_progress ?? 0)),
                }));
            } else if (reportType === 'staff') {
                rows = raw.map((r: any) => ({
                    'Staff Name': r.name,
                    Department: r.department ?? '—',
                    Assigned: Number(r.assigned ?? 0),
                    Completed: Number(r.completed ?? 0),
                    'Completion Rate (%)': Number(r.rate ?? 0),
                    Evaluation: getEvaluation(Number(r.rate ?? 0)),
                }));
            } else {
                rows = raw.map((r: any) => ({
                    Title: r.title,
                    Department: r.department,
                    Deadline: r.deadline,
                    'Days Overdue': r.days_overdue,
                    'Progress (%)': r.progress,
                    Status: r.status,
                }));
            }
            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Report');
            const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            return { fileBase64: base64, fileName: `${safeName}.xlsx` };
        }

        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(14);
        doc.text(title, 14, 15);
        doc.setFontSize(9);
        doc.text(subtitle || `Generated: ${new Date().toLocaleString()}`, 14, 22);

        if (reportType === 'executive' || reportType === 'department') {
            const body = raw.map((r: any) => [
                r.department,
                Number(r.total_activities ?? 0),
                Number(r.completed ?? 0),
                Number(r.in_progress ?? 0),
                Number(r.delayed_cnt ?? 0),
                `${Number(r.avg_progress ?? 0)}%`,
                getScore(Number(r.avg_progress ?? 0)),
            ]);
            autoTable(doc, {
                startY: 28,
                head: [['Department', 'Total', 'Completed', 'In Progress', 'Delayed', 'Avg Progress', 'Score']],
                body,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [30, 92, 164] },
            });
        } else if (reportType === 'staff') {
            const body = raw.map((r: any) => [
                r.name,
                r.department ?? '—',
                Number(r.assigned ?? 0),
                Number(r.completed ?? 0),
                `${Number(r.rate ?? 0)}%`,
                getEvaluation(Number(r.rate ?? 0)),
            ]);
            autoTable(doc, {
                startY: 28,
                head: [['Staff Name', 'Department', 'Assigned', 'Completed', 'Rate', 'Evaluation']],
                body,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [30, 92, 164] },
            });
        } else {
            const body = raw.map((r: any) => [
                (r.title || '').slice(0, 40),
                r.department,
                r.deadline,
                r.days_overdue,
                `${r.progress ?? 0}%`,
                r.status,
            ]);
            autoTable(doc, {
                startY: 28,
                head: [['Title', 'Department', 'Deadline', 'Days Overdue', 'Progress', 'Status']],
                body,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [30, 92, 164] },
            });
        }
        const dataUri = doc.output('datauristring');
        const fileBase64 = dataUri.split(',')[1] || '';
        return { fileBase64, fileName: `${safeName}.pdf` };
    }, [fetchReport]);

    const handleSendEmail = useCallback(async () => {
        if (!shareContext || !shareToEmail.trim()) {
            showToast('Please enter recipient email address.', 'error');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(shareToEmail.trim())) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }
        setShareSending(true);
        try {
            const { fileBase64, fileName } = await generateReportBase64(
                shareContext.reportType,
                shareContext.params,
                shareContext.title,
                shareContext.subtitle,
                shareFormat
            );
            await axios.post('/api/reports/email', {
                to: shareToEmail.trim(),
                subject: `Report: ${shareContext.title}`,
                reportTitle: shareContext.title,
                format: shareFormat,
                fileBase64,
                fileName,
            });
            showToast('Report sent by email successfully.');
            setShareModalOpen(false);
            setShareContext(null);
        } catch (e: any) {
            const msg = e?.response?.data?.message || 'Failed to send email.';
            showToast(msg, 'error');
        } finally {
            setShareSending(false);
        }
    }, [shareContext, shareToEmail, shareFormat, generateReportBase64, showToast]);

    const handleRedownload = async (item: ReportHistoryItem) => {
        try {
            if (item.format === 'PDF') {
                await exportPDF(item.reportType, item.params, item.title, item.subtitle, true);
            } else {
                await exportExcel(item.reportType, item.params, item.title, item.subtitle, true);
            }
        } catch {
            showToast('Failed to re-download report.', 'error');
        }
    };

    const clearHistory = () => {
        persistHistory([]);
        showToast('History cleared.');
    };

    const formatGeneratedAt = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div id="page-reports" className="page-section active-page">
            {/* Header + primary CTA */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h5 className="mb-1 d-flex align-items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>summarize</span>
                        Reports &amp; exports
                    </h5>
                    <p className="text-muted small mb-0">Generate and share institutional, department, staff and risk reports. Use filters below or open the report builder.</p>
                </div>
                <button type="button" className="btn btn-primary fw-bold d-flex align-items-center gap-2" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }} onClick={() => openBuilder()}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                    Create report
                </button>
            </div>

            {/* Filter bar */}
            <div className="table-card mb-4 p-3">
                <div className="row g-3 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label small fw-bold mb-1">Period</label>
                        <select className="form-select form-control-sm" value={periodPreset} onChange={e => setPeriodPreset(e.target.value as PeriodPreset)}>
                            {PERIOD_PRESET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                    {periodPreset === 'custom' && (
                        <>
                            <div className="col-md-2">
                                <label className="form-label small fw-bold mb-1">From</label>
                                <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label small fw-bold mb-1">To</label>
                                <input type="date" className="form-control form-control-sm" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                            </div>
                        </>
                    )}
                    <div className="col-md-3">
                        <label className="form-label small fw-bold mb-1">Department</label>
                        <select className="form-select form-control-sm" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)}>
                            <option>All Departments</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Report type cards as shortcuts */}
            <div className="row g-3 mb-4">
                {(['executive', 'department', 'staff', 'risk'] as ReportType[]).map(type => (
                    <div key={type} className="col-12 col-sm-6 col-xl-3">
                        <div className="report-card h-100" style={{ borderTopColor: type === 'executive' ? 'var(--mubs-blue)' : type === 'department' ? '#10b981' : type === 'staff' ? 'var(--mubs-yellow)' : 'var(--mubs-red)' }}>
                            <div className="report-card-icon" style={{ background: type === 'executive' ? '#eff6ff' : type === 'department' ? '#ecfdf5' : type === 'staff' ? '#fffbeb' : '#fff1f2' }}>
                                <span className="material-symbols-outlined" style={{ color: type === 'executive' ? 'var(--mubs-blue)' : type === 'department' ? '#059669' : type === 'staff' ? '#b45309' : 'var(--mubs-red)', fontSize: '26px' }}>
                                    {type === 'executive' ? 'summarize' : type === 'department' ? 'corporate_fare' : type === 'staff' ? 'person_search' : 'crisis_alert'}
                                </span>
                            </div>
                            <h6>{REPORT_TITLES[type]}</h6>
                            <p className="small mb-2">{REPORT_DESCRIPTIONS[type]}</p>
                            <div className="d-flex gap-2 flex-wrap">
                                <button className="btn btn-sm btn-outline-primary flex-fill" disabled={!!loading} onClick={() => openBuilder({ type })}>
                                    Build report
                                </button>
                                <button className="btn btn-sm btn-outline-success py-1" disabled={!!loading} onClick={() => handleCardExport(type, 'PDF')} title="Download PDF">
                                    {isCardLoading(type) ? <span className="spinner-border spinner-border-sm" /> : <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>picture_as_pdf</span>}
                                </button>
                                <button className="btn btn-sm btn-outline-success py-1" disabled={!!loading} onClick={() => handleCardExport(type, 'Excel')} title="Download Excel">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>table_chart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Suggested reports */}
            <div className="table-card mb-4 p-3">
                <h6 className="mb-3 d-flex align-items-center gap-2" style={{ fontWeight: 700 }}>
                    <span className="material-symbols-outlined" style={{ color: '#6366f1', fontSize: '20px' }}>lightbulb</span>
                    Suggested reports
                </h6>
                <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openBuilder({ type: 'executive', period: 'this_quarter' })}>
                        Executive Summary — This quarter
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => openBuilder({ type: 'risk', period: 'this_month' })}>
                        Risk report — This month
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-success" onClick={() => openBuilder({ type: 'department', period: 'last_quarter' })}>
                        Department performance — Last quarter
                    </button>
                </div>
            </div>

            {/* Recent reports */}
            <div className="table-card">
                <div className="table-card-header">
                    <h5><span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>history</span>Recent reports</h5>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearHistory}>Clear history</button>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead><tr><th>Report</th><th>Scope</th><th>Generated</th><th>Format</th><th>Actions</th></tr></thead>
                        <tbody>
                            {reportHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-5 text-muted">
                                        No reports generated yet. Click &quot;Create report&quot; or use a report card above.
                                    </td>
                                </tr>
                            ) : reportHistory.map(item => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{item.title}</div>
                                        <div className="text-muted" style={{ fontSize: '.72rem' }}>{item.subtitle}</div>
                                    </td>
                                    <td style={{ fontSize: '.8rem' }}>{item.scopeLabel ?? '—'}</td>
                                    <td style={{ fontSize: '.83rem' }}>{formatGeneratedAt(item.generatedAt)}</td>
                                    <td><span className={`badge ${item.format === 'PDF' ? 'bg-danger' : 'bg-success'}`}>{item.format}</span></td>
                                    <td>
                                        <div className="d-flex gap-1">
                                            <button type="button" className="btn btn-sm btn-outline-success py-0 px-2" title="Download" onClick={() => handleRedownload(item)}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>download</span>
                                            </button>
                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" title="Share" onClick={() => openShareModalFromItem(item)}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>share</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="table-card-footer">
                    <span className="footer-label">{reportHistory.length} report{reportHistory.length !== 1 ? 's' : ''} in history</span>
                    {reportHistory.length > 0 && (
                        <button type="button" className="btn btn-sm btn-primary fw-bold" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }} onClick={() => handleRedownload(reportHistory[0])}>
                            <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>download</span>Download latest
                        </button>
                    )}
                </div>
            </div>

            {/* Report builder modal */}
            {builderOpen && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>tune</span>
                                    Create report {builderStep === 1 ? '— Choose type' : builderStep === 2 ? '— Period & scope' : '— Format & generate'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setBuilderOpen(false)} aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                {builderStep === 1 && (
                                    <div className="row g-3">
                                        {(['executive', 'department', 'staff', 'risk'] as ReportType[]).map(type => (
                                            <div key={type} className="col-6">
                                                <button
                                                    type="button"
                                                    className={`btn w-100 p-3 text-start border rounded-3 ${builderType === type ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary'}`}
                                                    onClick={() => { setBuilderType(type); setBuilderStep(2); }}
                                                >
                                                    <span className="material-symbols-outlined me-2" style={{ verticalAlign: 'middle' }}>
                                                        {type === 'executive' ? 'summarize' : type === 'department' ? 'corporate_fare' : type === 'staff' ? 'person_search' : 'crisis_alert'}
                                                    </span>
                                                    <strong>{REPORT_TITLES[type]}</strong>
                                                    <div className="small text-muted mt-1">{REPORT_DESCRIPTIONS[type]}</div>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {builderStep === 2 && builderType != null && (
                                    <div className="d-flex flex-column gap-3">
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Period</label>
                                                <select className="form-select" value={builderPeriod} onChange={e => setBuilderPeriod(e.target.value as PeriodPreset)}>
                                                    {PERIOD_PRESET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                                </select>
                                            </div>
                                            {builderPeriod === 'custom' && (
                                                <>
                                                    <div className="col-md-3">
                                                        <label className="form-label small fw-bold">From</label>
                                                        <input type="date" className="form-control" value={builderCustomFrom} onChange={e => setBuilderCustomFrom(e.target.value)} />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label className="form-label small fw-bold">To</label>
                                                        <input type="date" className="form-control" value={builderCustomTo} onChange={e => setBuilderCustomTo(e.target.value)} />
                                                    </div>
                                                </>
                                            )}
                                            <div className="col-md-6">
                                                <label className="form-label small fw-bold">Department</label>
                                                <select className="form-select" value={builderDepartment} onChange={e => setBuilderDepartment(e.target.value)}>
                                                    <option>All Departments</option>
                                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {builderStep === 3 && builderType != null && (
                                    <div className="d-flex flex-column gap-3">
                                        <p className="mb-0 text-muted small">
                                            <strong>{REPORT_TITLES[builderType]}</strong> — {getPeriodDatesFromPreset(builderPeriod, builderCustomFrom, builderCustomTo).label} · {builderDepartment !== 'All Departments' ? builderDepartment : 'All'}
                                        </p>
                                        <div>
                                            <label className="form-label small fw-bold">Format</label>
                                            <div className="d-flex gap-2">
                                                <button type="button" className={`btn ${builderFormat === 'PDF' ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => setBuilderFormat('PDF')}>PDF</button>
                                                <button type="button" className={`btn ${builderFormat === 'Excel' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setBuilderFormat('Excel')}>Excel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                {builderStep === 1 && (
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setBuilderOpen(false)}>Cancel</button>
                                )}
                                {builderStep === 2 && (
                                    <>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setBuilderStep(1)}>Back</button>
                                        <button type="button" className="btn btn-primary" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }} onClick={() => setBuilderStep(3)}>Next</button>
                                    </>
                                )}
                                {builderStep === 3 && (
                                    <>
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setBuilderStep(2)}>Back</button>
                                        <button type="button" className="btn btn-outline-primary" onClick={handleBuilderEmail}>Email report</button>
                                        <button type="button" className="btn btn-primary fw-bold" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }} disabled={builderGenerating} onClick={handleBuilderGenerate}>
                                            {builderGenerating ? <><span className="spinner-border spinner-border-sm me-1" />Generating…</> : <><span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>download</span>Generate &amp; download</>}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Share by email modal */}
            {shareModalOpen && shareContext && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title d-flex align-items-center gap-2">
                                    <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>mail</span>
                                    Email report
                                </h5>
                                <button type="button" className="btn-close" onClick={() => { setShareModalOpen(false); setShareContext(null); }} aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <p className="text-muted small mb-3">Send this report as an attachment (PDF or Excel) to the recipient.</p>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Report</label>
                                    <div className="form-control form-control-sm bg-light" style={{ fontSize: '.9rem' }}>
                                        {shareContext?.title}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-bold small">Recipient email</label>
                                    <input
                                        type="email"
                                        className="form-control form-control-sm"
                                        placeholder="e.g. recipient@example.com"
                                        value={shareToEmail}
                                        onChange={e => setShareToEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-0">
                                    <label className="form-label fw-bold small">Format</label>
                                    <select className="form-select form-select-sm" value={shareFormat} onChange={e => setShareFormat(e.target.value as ExportFormat)}>
                                        <option value="PDF">PDF</option>
                                        <option value="Excel">Excel</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => { setShareModalOpen(false); setShareContext(null); }}>Cancel</button>
                                <button type="button" className="btn btn-primary fw-bold" style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }} disabled={shareSending} onClick={handleSendEmail}>
                                    {shareSending ? <><span className="spinner-border spinner-border-sm me-1" />Sending…</> : <><span className="material-symbols-outlined me-1" style={{ fontSize: '18px' }}>send</span>Send email</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
                    <div className={`toast show align-items-center text-white border-0 ${toast.type === 'error' ? 'bg-danger' : 'bg-primary'}`} role="alert">
                        <div className="d-flex">
                            <div className="toast-body">{toast.message}</div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(null)} aria-label="Close" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
