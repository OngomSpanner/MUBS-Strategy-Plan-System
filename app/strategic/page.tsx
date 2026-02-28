"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CreateActivityModal from '@/components/Modals/CreateActivityModal';
import axios from 'axios';

interface Activity {
  id: number;
  title: string;
  pillar: string;
  unit: string;
  unit_id: number;
  target_kpi: string;
  start_date: string;
  end_date: string;
  progress: number;
  status: string;
  timeline: string;
  description: string;
}

export default function StrategicPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'reassign'>('create');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [unitFilter, setUnitFilter] = useState('All Units');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const [stats, setStats] = useState({
    total: 0,
    onTrack: 0,
    inProgress: 0,
    delayed: 0
  });

  const filteredActivities = activities.filter(a => {
    const matchStatus = statusFilter === 'All Statuses' || a.status === statusFilter;
    const matchUnit = unitFilter === 'All Units' || a.unit === unitFilter;
    return matchStatus && matchUnit;
  });

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / PAGE_SIZE));
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const uniqueUnits = Array.from(new Set(activities.map(a => a.unit))).filter(Boolean);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [statusFilter, unitFilter]);

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats({
        total: response.data.stats.totalActivities,
        onTrack: response.data.stats.onTrackActivities,
        inProgress: response.data.stats.inProgressActivities,
        delayed: response.data.stats.delayedActivities
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'reassign', activity?: Activity) => {
    setModalMode(mode);
    setSelectedActivity(activity ?? null);
    setShowCreateModal(true);
  };

  const handleDelete = async (activity: Activity) => {
    if (!confirm(`Delete "${activity.title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/activities/${activity.id}`, { method: 'DELETE' });
      fetchActivities();
      fetchStats();
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      'On Track': { bg: '#dcfce7', color: '#15803d' },
      'In Progress': { bg: '#fef9c3', color: '#a16207' },
      'Delayed': { bg: '#fee2e2', color: '#b91c1c' },
      'Completed': { bg: '#dcfce7', color: '#15803d' },
      'Not Started': { bg: '#f1f5f9', color: '#475569' }
    };
    const style = styles[status] || styles['Not Started'];
    return { backgroundColor: style.bg, color: style.color };
  };

  return (
    <Layout>
      <div className="row g-4 mb-4">
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-blue)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#eff6ff' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-blue)' }}>track_changes</span>
              </div>
              <span className="stat-badge" style={{ background: '#eff6ff', color: 'var(--mubs-blue)' }}>Plan 2024-28</span>
            </div>
            <div className="stat-label">Main Activities</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#ecfdf5' }}>
                <span className="material-symbols-outlined" style={{ color: '#059669' }}>task_alt</span>
              </div>
              <span className="stat-badge" style={{ background: '#ecfdf5', color: '#059669' }}>Completed</span>
            </div>
            <div className="stat-label">On Track</div>
            <div className="stat-value">{stats.onTrack}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-yellow)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#fffbeb' }}>
                <span className="material-symbols-outlined" style={{ color: '#b45309' }}>pending</span>
              </div>
              <span className="stat-badge" style={{ background: '#fffbeb', color: '#b45309' }}>In Progress</span>
            </div>
            <div className="stat-label">In Progress</div>
            <div className="stat-value">{stats.inProgress}</div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="stat-card" style={{ borderLeftColor: 'var(--mubs-red)' }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="stat-icon" style={{ background: '#fff1f2' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--mubs-red)' }}>error</span>
              </div>
              <span className="stat-badge" style={{ background: '#fff1f2', color: 'var(--mubs-red)' }}>Alert</span>
            </div>
            <div className="stat-label">Delayed</div>
            <div className="stat-value">{stats.delayed}</div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h5>
            <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>
              track_changes
            </span>
            Strategic Plan Activities
          </h5>
          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select form-select-sm"
              style={{ width: '130px' }}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>On Track</option>
              <option>In Progress</option>
              <option>Delayed</option>
              <option>Completed</option>
              <option>Not Started</option>
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: '160px' }}
              value={unitFilter}
              onChange={e => setUnitFilter(e.target.value)}
            >
              <option>All Units</option>
              {uniqueUnits.map(unit => (
                <option key={unit}>{unit}</option>
              ))}
            </select>
            <button
              className="btn btn-sm create-btn"
              onClick={() => openModal('create')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
              Add Activity
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Assigned Unit</th>
                <th>Target</th>
                <th>Timeline</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No activities found
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="activity-icon">
                          <span className="material-symbols-outlined">
                            {activity.pillar === 'Infrastructure' ? 'laptop' :
                              activity.pillar === 'Teaching & Learning' ? 'school' :
                                activity.pillar === 'Research & Innovation' ? 'science' : 'assignment'}
                          </span>
                        </div>
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '.85rem' }}>
                            {activity.title}
                          </div>
                          <div className="text-muted" style={{ fontSize: '.72rem' }}>
                            {activity.pillar}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '.83rem' }}>{activity.unit}</td>
                    <td style={{ fontSize: '.83rem' }}>{activity.target_kpi}</td>
                    <td style={{ fontSize: '.83rem' }}>{activity.timeline}</td>
                    <td style={{ minWidth: '100px' }}>
                      <div className="progress-bar-custom">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${activity.progress}%`,
                            background: activity.progress >= 70 ? '#005696' :
                              activity.progress >= 50 ? '#ffcd00' : '#e31837'
                          }}
                        />
                      </div>
                      <div style={{ fontSize: '.72rem', color: '#64748b', marginTop: '3px' }}>
                        {activity.progress}%
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={getStatusBadge(activity.status)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>circle</span>
                        {activity.status}
                      </span>
                    </td>
                    <td>
                      <div className="dropdown">
                        <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow">
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => { e.preventDefault(); openModal('edit', activity); }}
                            >
                              <span className="material-symbols-outlined me-2" style={{ fontSize: '16px' }}>edit</span>
                              Edit
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={(e) => { e.preventDefault(); openModal('reassign', activity); }}
                            >
                              <span className="material-symbols-outlined me-2" style={{ fontSize: '16px' }}>assignment_ind</span>
                              Reassign
                            </a>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <a
                              className="dropdown-item text-danger"
                              href="#"
                              onClick={(e) => { e.preventDefault(); handleDelete(activity); }}
                            >
                              <span className="material-symbols-outlined me-2" style={{ fontSize: '16px' }}>delete</span>
                              Delete
                            </a>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-card-footer">
          <span className="footer-label">
            Showing {filteredActivities.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredActivities.length)} of {filteredActivities.length} activities
          </span>
          <div className="d-flex gap-1">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >{page}</button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >›</button>
          </div>
        </div>
      </div>

      <CreateActivityModal
        show={showCreateModal}
        onHide={() => { setShowCreateModal(false); setSelectedActivity(null); }}
        onActivityCreated={() => { fetchActivities(); fetchStats(); }}
        activity={selectedActivity}
        mode={modalMode}
      />
    </Layout>
  );
}