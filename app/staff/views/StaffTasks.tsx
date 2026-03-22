"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import StatCard from "@/components/StatCard";
import TaskSubmissionModal from "@/components/Staff/TaskSubmissionModal";
import SubmissionDetailModal from "@/components/Staff/SubmissionDetailModal";
import TaskCardQueue from "@/components/Staff/TaskCardQueue";

interface Task {
  id: number;
  title: string;
  description: string;
  startDate?: string;
  dueDate: string;
  status: string;
  type: string;
  daysLeft: number;
  task_type?: 'process' | 'kpi_driver';
  kpi_target_value?: number | null;
}

interface Stats {
  assigned: number;
  overdue: number;
  inProgress: number;
  completed: number;
}

function StaffTasksContent() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats>({
    assigned: 0,
    overdue: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTaskForReport, setSelectedTaskForReport] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<'overdue' | 'next10' | 'future' | 'review' | 'history'>('overdue');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/staff/tasks");
      setTasks(response.data.tasks);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching staff tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const taskId = searchParams.get('taskId');
    if (taskId && tasks.length > 0) {
      const task = tasks.find(t => t.id === parseInt(taskId));
      if (task) {
        handleOpenModal(task);
      }
    }
  }, [searchParams, tasks]);

  const handleOpenModal = (task: Task) => {
    setSelectedTaskForReport(task);
    if (task.status === "Completed" || task.status === "Under Review" || task.status === "Incomplete") {
      setShowViewModal(true);
    } else {
      setShowModal(true);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'review') return t.status === 'Under Review';
    if (activeTab === 'history') return t.status === 'Completed';

    const isAction = t.status !== 'Completed' && t.status !== 'Under Review';
    if (!isAction) return false;

    if (activeTab === 'overdue') return t.daysLeft < 2;
    if (activeTab === 'next10') return t.daysLeft >= 2 && t.daysLeft <= 10;
    if (activeTab === 'future') return t.daysLeft > 10;
    return true;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  const renderTaskRow = (task: Task) => {
    const overdue = task.daysLeft < 0 && task.status !== "Completed";
    const rowBg = overdue ? "#fff5f5" : "transparent";
    return (
      <tr key={task.id} style={{ background: rowBg }}>
        <td className="ps-4">
          <div className="fw-bold text-dark" style={{ fontSize: ".9rem" }}>{task.title}</div>
          {task.description && (
            <div className="text-muted" style={{ fontSize: ".78rem", maxWidth: "380px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {task.description}
            </div>
          )}
        </td>
        <td>
          <span className="badge" style={{ background: "rgba(0,86,150,0.08)", color: "var(--mubs-blue)", fontSize: ".7rem" }}>
            {task.type}
          </span>
        </td>
        <td>
          <span className="status-badge" style={{
            background: task.status === "Completed" ? "#dcfce7" : task.status === "Under Review" ? "#eff6ff" : overdue ? "#fee2e2" : "#f1f5f9",
            color: task.status === "Completed" ? "#15803d" : task.status === "Under Review" ? "var(--mubs-blue)" : overdue ? "#b91c1c" : "#475569",
            fontSize: ".75rem",
          }}>
            {overdue && task.status !== "Completed" ? "Overdue" : task.status}
          </span>
        </td>
        <td>
          <span style={{ fontSize: ".8rem", color: "#64748b" }}>{task.startDate ? new Date(task.startDate).toLocaleDateString() : "N/A"}</span>
        </td>
        <td>
          <span style={{ fontSize: ".8rem", color: "#64748b" }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "TBD"}</span>
        </td>
        <td>
          <span style={{ fontSize: ".8rem", fontWeight: 700, color: overdue ? "#b91c1c" : "#64748b" }}>
            {task.daysLeft < 0 ? `${Math.abs(task.daysLeft)}d late` : `${task.daysLeft}d`}
          </span>
        </td>
        <td className="pe-4 text-end">
          <button onClick={() => handleOpenModal(task)} className="btn btn-sm btn-outline-primary fw-bold d-inline-flex align-items-center gap-1" style={{ borderRadius: "8px", fontSize: ".8rem" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {task.status === "Completed" || task.status === "Under Review" || task.status === "Incomplete" ? "visibility" : "upload_file"}
            </span>
            {task.status === "Completed" || task.status === "Under Review" || task.status === "Incomplete" ? "View Details" : (task.status === "Returned" ? "Resubmit" : "Submit Report")}
          </button>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="content-area w-100">
      {/* Stat Cards (Admin-style) */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="pending"
            label="Under Review"
            value={tasks.filter(t => t.status === 'Under Review').length}
            badge="Awaiting Feed"
            badgeIcon="hourglass_empty"
            color="blue"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="pending_actions"
            label="Next 10 Days"
            value={tasks.filter(t => t.status !== 'Completed' && t.status !== 'Under Review' && t.daysLeft >= 2 && t.daysLeft <= 10).length}
            badge="Upcoming"
            badgeIcon="schedule"
            color="yellow"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="running_with_errors"
            label="Overdue"
            value={tasks.filter(t => t.status !== 'Completed' && t.status !== 'Under Review' && t.daysLeft < 2).length}
            badge="Urgent Action"
            badgeIcon="priority_high"
            color="red"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="check_circle"
            label="Completed"
            value={tasks.filter(t => t.status === 'Completed').length}
            badge="Total History"
            badgeIcon="history"
            color="green"
          />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="table-card p-0 overflow-hidden" style={{ borderRadius: '20px', border: '1px solid #e2e8f0' }}>
        <div className="table-card-header d-flex justify-content-between align-items-center p-4" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
          <h5 className="mb-0 d-flex align-items-center gap-2 fw-bold" style={{ color: 'var(--mubs-navy)' }}>
            <span className="material-symbols-outlined" style={{ color: "var(--mubs-blue)" }}>auto_awesome_mosaic</span>
            All Assigned Tasks
          </h5>
        </div>

        <div className="d-flex px-4 pt-2 bg-white border-bottom gap-4" style={{ overflowX: 'auto' }}>
            {[
              { id: 'overdue', label: '🚨 Overdue', badgeBg: '#fee2e2', badgeColor: '#b91c1c', count: tasks.filter(t => t.status !== 'Completed' && t.status !== 'Under Review' && t.daysLeft < 2).length },
              { id: 'next10', label: '📅 Next 10 Days', badgeBg: '#fef3c7', badgeColor: '#92400e', count: tasks.filter(t => t.status !== 'Completed' && t.status !== 'Under Review' && t.daysLeft >= 2 && t.daysLeft <= 10).length },
              { id: 'review', label: 'Under Review', badgeBg: '#eff6ff', badgeColor: 'var(--mubs-blue)', count: tasks.filter(t => t.status === 'Under Review').length },
              { id: 'history', label: 'History', badgeBg: '#dcfce7', badgeColor: '#15803d', count: tasks.filter(t => t.status === 'Completed').length },
            ].map(tab => (
              <button
                key={tab.id}
                className={`pb-2 px-1 fw-bold border-0 bg-transparent position-relative flex-shrink-0 ${activeTab === tab.id ? 'text-primary' : 'text-muted'}`}
                style={{ fontSize: '0.82rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
                <span className="badge rounded-pill ms-2" style={{ background: tab.badgeBg, color: tab.badgeColor, fontSize: '0.65rem' }}>{tab.count}</span>
                {activeTab === tab.id && <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '3px', borderRadius: '3px 3px 0 0' }}></div>}
              </button>
            ))}

            <button
              className={`pb-2 px-1 fw-bold border-0 bg-transparent position-relative flex-shrink-0 d-flex align-items-center gap-1 ${activeTab === 'future' ? 'text-primary' : 'text-muted'}`}
              style={{ fontSize: '0.82rem', transition: 'all 0.2s', whiteSpace: 'nowrap', opacity: 0.7 }}
              onClick={() => setActiveTab('future')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
              🔜 Future
              {activeTab === 'future' && <div className="position-absolute bottom-0 start-0 w-100 bg-secondary" style={{ height: '3px', borderRadius: '3px 3px 0 0' }}></div>}
            </button>
          </div>

        <div className="table-responsive">
        <table className="table mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Task</th>
                <th>Type</th>

                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Days Left</th>
                <th className="pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'future' ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <div className="position-relative" style={{ minHeight: '280px', overflow: 'hidden' }}>
                      {/* Blurred ghost rows */}
                      <div style={{ filter: 'blur(4px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.5 }}>
                        {tasks.filter(t => t.status !== 'Completed' && t.status !== 'Under Review' && t.daysLeft > 10).slice(0, 4).map(task => renderTaskRow(task))}
                      </div>
                      {/* Lock overlay */}
                      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center" style={{ background: 'rgba(248,250,252,0.75)', backdropFilter: 'blur(2px)' }}>
                        <div className="text-center p-4">
                          <div className="mb-3" style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#64748b' }}>lock</span>
                          </div>
                          <h6 className="fw-black text-dark mb-1">Future Tasks Locked</h6>
                          <p className="text-muted mb-0" style={{ fontSize: '0.82rem', maxWidth: '300px', margin: '0 auto' }}>
                            These tasks will automatically appear in the <strong>Next 10 Days</strong> tab as their deadlines approach. Stay focused on what&apos;s due soon!
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : currentTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    <span
                      className="material-symbols-outlined d-block mb-2"
                      style={{ fontSize: "36px", opacity: 0.3 }}
                    >
                      task_alt
                    </span>
                    No tasks found in this section.
                  </td>
                </tr>
              ) : (
                currentTasks.map(task => renderTaskRow(task))
              )}
            </tbody>
        </table>
        </div>

        {/* Pagination Controls */}
        {filteredTasks.length > 0 && activeTab !== 'future' && (
          <div className="p-4 border-top d-flex justify-content-between align-items-center bg-white" style={{ borderBottomLeftRadius: '20px', borderBottomRightRadius: '20px' }}>
            <div className="text-muted fw-bold" style={{ fontSize: '0.75rem' }}>
              Showing <span className="text-dark">{indexOfFirstItem + 1}</span> to <span className="text-dark">{Math.min(indexOfLastItem, filteredTasks.length)}</span> of <span className="text-dark">{filteredTasks.length}</span> tasks
            </div>
            <div className="pagination-controls d-flex gap-2">
              <button 
                  className="btn btn-sm btn-outline-light border text-dark d-flex align-items-center justify-content-center p-0"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', opacity: currentPage === 1 ? 0.5 : 1 }}
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                      key={page}
                      className={`btn btn-sm fw-bold d-flex align-items-center justify-content-center p-0 ${currentPage === page ? 'btn-primary shadow-sm' : 'btn-outline-light border text-dark'}`}
                      style={{ width: '32px', height: '32px', borderRadius: '8px', fontSize: '0.75rem', transition: 'all 0.2s' }}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                      {page}
                  </button>
              ))}

              <button 
                  className="btn btn-sm btn-outline-light border text-dark d-flex align-items-center justify-content-center p-0"
                  style={{ width: '32px', height: '32px', borderRadius: '8px', opacity: currentPage === totalPages || totalPages === 0 ? 0.5 : 1 }}
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <TaskSubmissionModal
        key={`submit-${selectedTaskForReport?.id}`}
        show={showModal}
        onHide={() => setShowModal(false)}
        task={selectedTaskForReport}
        onSuccess={fetchData}
      />
      <SubmissionDetailModal
        key={`view-task-${selectedTaskForReport?.id}`}
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        taskId={selectedTaskForReport?.id}
        submission={null}
        onRevise={() => {
          setShowViewModal(false);
          setShowModal(true);
        }}
      />
    </div>
  );
}

export default function StaffTasks() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <StaffTasksContent />
    </Suspense>
  );
}
