"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import * as XLSX from 'xlsx';

interface UnitSummary {
  unit: string;
  total: number;
  completed: number;
  inProgress: number;
  delayed: number;
  progress: number;
  score: string;
}

interface StaffEvaluation {
  name: string;
  unit: string;
  assigned: number;
  completed: number;
  rate: number;
  evaluation: string;
}

const getScore = (progress: number) =>
  progress >= 80 ? 'Excellent' : progress >= 65 ? 'Good' : progress >= 50 ? 'Fair' : 'Poor';

const getEvaluation = (rate: number) =>
  rate >= 80 ? 'Excellent' : rate >= 60 ? 'Good' : rate >= 40 ? 'Fair' : 'Poor';

export default function ReportsPage() {
  const [unitSummaries, setUnitSummaries] = useState<UnitSummary[]>([]);
  const [staffEvaluations, setStaffEvaluations] = useState<StaffEvaluation[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [summaryUnitFilter, setSummaryUnitFilter] = useState('All Units');
  const [selectedUnit, setSelectedUnit] = useState('All Units');

  // Pagination — Activity Summary
  const [unitPage, setUnitPage] = useState(1);
  const UNIT_PAGE_SIZE = 5;

  // Pagination — Staff Evaluations
  const [staffPage, setStaffPage] = useState(1);
  const STAFF_PAGE_SIZE = 5;

  useEffect(() => { setUnitPage(1); }, [summaryUnitFilter]);
  useEffect(() => { setStaffPage(1); }, [selectedUnit]);

  useEffect(() => {
    axios.get('/api/reports?type=activity-summary')
      .then(({ data }) => {
        const rows: UnitSummary[] = (data.data as any[]).map(r => ({
          unit: r.unit,
          total: Number(r.total_activities),
          completed: Number(r.completed),
          inProgress: Number(r.in_progress),
          delayed: Number(r.delayed_cnt),
          progress: Number(r.avg_progress),
          score: getScore(Number(r.avg_progress))
        }));
        setUnitSummaries(rows);
      })
      .catch(err => console.error('activity-summary error', err))
      .finally(() => setLoadingUnits(false));
  }, []);

  useEffect(() => {
    axios.get('/api/reports?type=staff-evaluation')
      .then(({ data }) => {
        const rows: StaffEvaluation[] = (data.data as any[]).map(r => ({
          name: r.name,
          unit: r.unit ?? '—',
          assigned: Number(r.assigned),
          completed: Number(r.completed),
          rate: Number(r.rate ?? 0),
          evaluation: getEvaluation(Number(r.rate ?? 0))
        }));
        setStaffEvaluations(rows);
      })
      .catch(err => console.error('staff-evaluation error', err))
      .finally(() => setLoadingStaff(false));
  }, []);

  const getScoreBadge = (score: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      'Excellent': { bg: '#dcfce7', color: '#15803d' },
      'Good': { bg: '#fef9c3', color: '#a16207' },
      'Fair': { bg: '#fde8d8', color: '#c2410c' },
      'Poor': { bg: '#fee2e2', color: '#b91c1c' }
    };
    return styles[score] || { bg: '#f1f5f9', color: '#475569' };
  };

  // ── Export helpers ─────────────────────────────────────────────
  const exportExcel = (dataset: 'units' | 'staff', filename: string) => {
    const rows = dataset === 'units'
      ? filteredUnitSummaries.map(u => ({
        Unit: u.unit, Total: u.total, Completed: u.completed,
        'In Progress': u.inProgress, Delayed: u.delayed,
        'Avg Progress (%)': u.progress, Score: u.score
      }))
      : filteredStaff.map(s => ({
        'Staff Name': s.name, Unit: s.unit, Assigned: s.assigned,
        Completed: s.completed, 'Completion Rate (%)': s.rate, Evaluation: s.evaluation
      }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportPDF = async (dataset: 'units' | 'staff', filename: string) => {
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text(filename, 14, 15);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    if (dataset === 'units') {
      autoTable(doc, {
        startY: 28,
        head: [['Unit', 'Total', 'Completed', 'In Progress', 'Delayed', 'Avg Progress', 'Score']],
        body: filteredUnitSummaries.map(u => [u.unit, u.total, u.completed, u.inProgress, u.delayed, `${u.progress}%`, u.score]),
        foot: [['TOTAL / AVG', totals.total, totals.completed, totals.inProgress, totals.delayed, `${avgProgress}%`, '']],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 92, 164] },
        footStyles: { fillColor: [240, 245, 255], textColor: [30, 92, 164], fontStyle: 'bold' }
      });
    } else {
      autoTable(doc, {
        startY: 28,
        head: [['Staff Name', 'Unit', 'Assigned', 'Completed', 'Rate', 'Evaluation']],
        body: filteredStaff.map(s => [s.name, s.unit, s.assigned, s.completed, `${s.rate}%`, s.evaluation]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 92, 164] }
      });
    }
    doc.save(`${filename}.pdf`);
  };

  // Filtered Unit Summaries
  const filteredUnitSummaries = summaryUnitFilter === 'All Units'
    ? unitSummaries
    : unitSummaries.filter(u => u.unit === summaryUnitFilter);

  // Computed totals row
  const totals = filteredUnitSummaries.reduce(
    (acc, u) => ({
      total: acc.total + u.total,
      completed: acc.completed + u.completed,
      inProgress: acc.inProgress + u.inProgress,
      delayed: acc.delayed + u.delayed,
    }),
    { total: 0, completed: 0, inProgress: 0, delayed: 0 }
  );
  const avgProgress = filteredUnitSummaries.length
    ? Math.round(filteredUnitSummaries.reduce((s, u) => s + u.progress, 0) / filteredUnitSummaries.length)
    : 0;

  // Paginated unit summaries
  const totalUnitPages = Math.max(1, Math.ceil(filteredUnitSummaries.length / UNIT_PAGE_SIZE));
  const paginatedUnits = filteredUnitSummaries.slice((unitPage - 1) * UNIT_PAGE_SIZE, unitPage * UNIT_PAGE_SIZE);

  // Filtered + paginated staff evaluations
  const filteredStaff = selectedUnit === 'All Units'
    ? staffEvaluations
    : staffEvaluations.filter(s => s.unit === selectedUnit);
  const totalStaffPages = Math.max(1, Math.ceil(filteredStaff.length / STAFF_PAGE_SIZE));
  const paginatedStaff = filteredStaff.slice((staffPage - 1) * STAFF_PAGE_SIZE, staffPage * STAFF_PAGE_SIZE);

  // Unique units for staff filter
  const uniqueStaffUnits = Array.from(new Set(staffEvaluations.map(s => s.unit))).filter(Boolean);

  const reportCards: { title: string; description: string; icon: string; color: string; dataset: 'units' | 'staff' }[] = [
    { title: 'Activity Progress Summary', description: 'Overview of all activities by status & unit', icon: 'bar_chart', color: 'var(--mubs-blue)', dataset: 'units' },
    { title: 'Unit Performance Snapshots', description: 'Per-unit activity completion rates', icon: 'corporate_fare', color: '#10b981', dataset: 'units' },
    { title: 'Staff Evaluation Summaries', description: 'Individual & departmental evaluation scores', icon: 'person_search', color: '#b45309', dataset: 'staff' },
    { title: 'Delayed Activities Report', description: 'All overdue items with escalation log', icon: 'report', color: 'var(--mubs-red)', dataset: 'units' }
  ];

  const Paginator = ({ page, total, onPrev, onNext, onPage }: { page: number; total: number; onPrev: () => void; onNext: () => void; onPage: (p: number) => void }) => (
    <div className="d-flex gap-1">
      <button className="page-btn" disabled={page === 1} onClick={onPrev}>‹</button>
      {Array.from({ length: total }, (_, i) => i + 1).map(pg => (
        <button key={pg} className={`page-btn ${pg === page ? 'active' : ''}`} onClick={() => onPage(pg)}>{pg}</button>
      ))}
      <button className="page-btn" disabled={page === total} onClick={onNext}>›</button>
    </div>
  );

  return (
    <Layout>
      {/* Report Cards */}
      <div className="row g-4 mb-4">
        {reportCards.map((card, index) => (
          <div className="col-12 col-md-6 col-xl-3" key={index}>
            <div className="stat-card" style={{ borderLeftColor: card.color, cursor: 'pointer' }}>
              <div className="stat-icon mb-3" style={{ background: '#eff6ff' }}>
                <span className="material-symbols-outlined" style={{ color: card.color }}>{card.icon}</span>
              </div>
              <div className="stat-label">Report Type</div>
              <div className="fw-bold text-dark" style={{ fontSize: '1rem', marginTop: '4px' }}>{card.title}</div>
              <div className="text-muted mt-1" style={{ fontSize: '.75rem' }}>{card.description}</div>
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-xs py-1 px-2 btn-outline-primary fw-bold"
                  style={{ fontSize: '.75rem' }}
                  onClick={() => exportPDF(card.dataset, card.title)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>picture_as_pdf</span> PDF
                </button>
                <button
                  className="btn btn-xs py-1 px-2 btn-outline-success fw-bold"
                  style={{ fontSize: '.75rem' }}
                  onClick={() => exportExcel(card.dataset, card.title)}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>table_chart</span> Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Progress Summary */}
      <div className="table-card mb-4">
        <div className="table-card-header">
          <h5>
            <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>summarize</span>
            Activity Progress Summary
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: '160px' }}
              value={summaryUnitFilter}
              onChange={e => setSummaryUnitFilter(e.target.value)}
            >
              <option>All Units</option>
              {unitSummaries.map(u => (
                <option key={u.unit} value={u.unit}>{u.unit}</option>
              ))}
            </select>
            <button className="btn btn-sm btn-success fw-bold" onClick={() => exportExcel('units', 'Activity Progress Summary')}>
              <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>download</span>
              Export All
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Total Activities</th>
                <th>Completed</th>
                <th>In Progress</th>
                <th>Delayed</th>
                <th>Avg. Progress</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {loadingUnits ? (
                <tr><td colSpan={7} className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
              ) : paginatedUnits.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4 text-muted">No data found</td></tr>
              ) : paginatedUnits.map((unit, index) => {
                const scoreStyle = getScoreBadge(unit.score);
                return (
                  <tr key={index}>
                    <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{unit.unit}</td>
                    <td style={{ fontSize: '.83rem' }}>{unit.total}</td>
                    <td><span className="badge bg-success">{unit.completed}</span></td>
                    <td><span className="badge bg-warning text-dark">{unit.inProgress}</span></td>
                    <td><span className={`badge ${unit.delayed === 0 ? 'bg-success' : 'bg-danger'}`}>{unit.delayed}</span></td>
                    <td>
                      <div className="progress-bar-custom" style={{ width: '100px', display: 'inline-block', verticalAlign: 'middle' }}>
                        <div className="progress-bar-fill" style={{ width: `${unit.progress}%`, background: unit.progress >= 70 ? '#10b981' : unit.progress >= 50 ? '#ffcd00' : '#e31837' }} />
                      </div>
                      <span style={{ fontSize: '.75rem', marginLeft: '6px' }}>{unit.progress}%</span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: scoreStyle.bg, color: scoreStyle.color }}>{unit.score}</span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals row — computed from filtered dataset */}
              {!loadingUnits && filteredUnitSummaries.length > 0 && (
                <tr style={{ background: '#f8fafc' }}>
                  <td className="fw-bold" style={{ color: 'var(--mubs-blue)' }}>TOTAL / AVG</td>
                  <td className="fw-bold text-dark">{totals.total}</td>
                  <td><span className="fw-bold text-success">{totals.completed}</span></td>
                  <td><span className="fw-bold" style={{ color: '#b45309' }}>{totals.inProgress}</span></td>
                  <td><span className="fw-bold text-danger">{totals.delayed}</span></td>
                  <td>
                    <div className="progress-bar-custom" style={{ width: '100px', display: 'inline-block', verticalAlign: 'middle' }}>
                      <div className="progress-bar-fill" style={{ width: `${avgProgress}%`, background: 'var(--mubs-blue)' }} />
                    </div>
                    <span style={{ fontSize: '.75rem', marginLeft: '6px', fontWeight: 700 }}>{avgProgress}%</span>
                  </td>
                  <td><span className="status-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Overall</span></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-card-footer">
          <span className="footer-label">
            Showing {filteredUnitSummaries.length === 0 ? 0 : (unitPage - 1) * UNIT_PAGE_SIZE + 1}–{Math.min(unitPage * UNIT_PAGE_SIZE, filteredUnitSummaries.length)} of {filteredUnitSummaries.length} units
          </span>
          <Paginator page={unitPage} total={totalUnitPages} onPrev={() => setUnitPage(p => p - 1)} onNext={() => setUnitPage(p => p + 1)} onPage={setUnitPage} />
        </div>
      </div>

      {/* Staff Evaluations */}
      <div className="table-card">
        <div className="table-card-header">
          <h5>
            <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>person_search</span>
            Staff Evaluation Snapshots
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              style={{ width: '160px' }}
              value={selectedUnit}
              onChange={e => setSelectedUnit(e.target.value)}
            >
              <option>All Units</option>
              {uniqueStaffUnits.map(u => <option key={u}>{u}</option>)}
            </select>
            <button
              className="btn btn-sm btn-primary fw-bold"
              style={{ background: 'var(--mubs-blue)', borderColor: 'var(--mubs-blue)' }}
              onClick={() => exportExcel('staff', 'Staff Evaluations')}
            >
              <span className="material-symbols-outlined me-1" style={{ fontSize: '16px' }}>download</span>
              Export
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Unit</th>
                <th>Activities Assigned</th>
                <th>Completed</th>
                <th>Completion Rate</th>
                <th>Evaluation</th>
              </tr>
            </thead>
            <tbody>
              {loadingStaff ? (
                <tr><td colSpan={6} className="text-center py-4"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></td></tr>
              ) : paginatedStaff.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4 text-muted">No evaluations found</td></tr>
              ) : paginatedStaff.map((staff, index) => {
                const scoreStyle = getScoreBadge(staff.evaluation);
                return (
                  <tr key={index}>
                    <td className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>{staff.name}</td>
                    <td style={{ fontSize: '.83rem' }}>{staff.unit}</td>
                    <td style={{ fontSize: '.83rem' }}>{staff.assigned}</td>
                    <td style={{ fontSize: '.83rem' }}>{staff.completed}</td>
                    <td>
                      <div className="progress-bar-custom" style={{ width: '80px', display: 'inline-block', verticalAlign: 'middle' }}>
                        <div className="progress-bar-fill" style={{ width: `${staff.rate}%`, background: staff.rate >= 70 ? '#10b981' : staff.rate >= 50 ? '#ffcd00' : '#e31837' }} />
                      </div>
                      <span style={{ fontSize: '.75rem', marginLeft: '6px' }}>{staff.rate}%</span>
                    </td>
                    <td>
                      <span className="status-badge" style={{ background: scoreStyle.bg, color: scoreStyle.color }}>{staff.evaluation}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-card-footer">
          <span className="footer-label">
            Showing {filteredStaff.length === 0 ? 0 : (staffPage - 1) * STAFF_PAGE_SIZE + 1}–{Math.min(staffPage * STAFF_PAGE_SIZE, filteredStaff.length)} of {filteredStaff.length} staff
          </span>
          <Paginator page={staffPage} total={totalStaffPages} onPrev={() => setStaffPage(p => p - 1)} onNext={() => setStaffPage(p => p + 1)} onPage={setStaffPage} />
        </div>
      </div>
    </Layout>
  );
}