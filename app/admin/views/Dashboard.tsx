"use client";

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import CreateUserModal from '@/components/Modals/CreateUserModal';
import CreateActivityModal from '@/components/Modals/CreateActivityModal';
import axios from 'axios';

interface DashboardStats {
  totalActivities: number;
  overallProgress: number;
  totalUsers: number;
  activeUsers: number;
  completedActivities: number;
  onTrackActivities: number;
  pendingProposals: number;
  delayedActivities: number;
}

interface DepartmentPerformance {
  name: string;
  progress: number;
}

interface RecentActivity {
  icon: string;
  bgColor: string;
  iconColor: string;
  description: string;
  timestamp: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalActivities: 0,
    overallProgress: 0,
    totalUsers: 0,
    activeUsers: 0,
    completedActivities: 0,
    onTrackActivities: 0,
    pendingProposals: 0,
    delayedActivities: 0
  });
  const [departmentPerformance, setUnitPerformance] = useState<DepartmentPerformance[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data.stats);
      setUnitPerformance(response.data.departmentPerformance);
      setRecentActivities(response.data.recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Layout>
      {/* Hero banner */}
      <div className="p-4 mb-4 rounded-3" style={{ background: 'linear-gradient(135deg, #1e40af 0%, var(--mubs-navy) 100%)', border: '1px solid rgba(147, 197, 253, 0.2)' }}>
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="material-symbols-outlined" style={{ color: '#93c5fd', fontSize: '28px' }}>admin_panel_settings</span>
              <div>
                <div className="fw-black text-white" style={{ fontSize: '1.1rem' }}>Admin Dashboard</div>
                <div style={{ fontSize: '.75rem', color: '#bfdbfe' }}>System overview and management</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="assignment"
            label="Total Activities"
            value={stats.totalActivities}
            badge={`${stats.completedActivities} Completed`}
            badgeIcon="task_alt"
            color="blue"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="analytics"
            label="Overall Progress"
            value={`${stats.overallProgress}%`}
            badge={`${stats.onTrackActivities} On Track`}
            badgeIcon="trending_up"
            color="yellow"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="group"
            label="System Users"
            value={stats.totalUsers}
            badge={`${stats.activeUsers} Active`}
            badgeIcon="check_circle"
            color="green"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="schedule"
            label="Delayed Activities"
            value={stats.delayedActivities}
            badge={
              stats.totalActivities > 0
                ? `${Math.round((stats.delayedActivities / stats.totalActivities) * 100)}% of total`
                : '0% of total'
            }
            badgeIcon="trending_down"
            color="red"
          />
        </div>
      </div>

      <div className="row g-4">
        {/* Quick Actions */}
        <div className="col-12 col-md-4">
          <div className="table-card p-0 h-100">
            <div className="table-card-header">
              <h5>
                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>
                  bolt
                </span>
                Quick Actions
              </h5>
            </div>
            <div className="p-3 d-flex flex-column gap-2">
              <button
                className="btn btn-outline-primary fw-bold text-start d-flex align-items-center gap-2"
                onClick={() => setShowCreateUserModal(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>
                  person_add
                </span>
                Create New User
              </button>
              <button
                className="btn btn-outline-primary fw-bold text-start d-flex align-items-center gap-2"
                onClick={() => setShowCreateActivityModal(true)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-blue)' }}>
                  add_task
                </span>
                Add Strategic Activity
              </button>
              <a
                href="/admin?pg=committee"
                className="btn btn-outline-warning fw-bold text-start d-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b45309' }}>
                  rate_review
                </span>
                Review Proposals
                {stats.pendingProposals > 0 && (
                  <span className="badge bg-warning text-dark ms-auto">{stats.pendingProposals}</span>
                )}
              </a>
              <a
                href="/admin?pg=tracking"
                className="btn btn-outline-danger fw-bold text-start d-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--mubs-red)' }}>
                  warning
                </span>
                View Delayed Activities
                <span className="badge bg-danger ms-auto">{stats.delayedActivities}</span>
              </a>
              <a
                href="/admin?pg=reports"
                className="btn btn-outline-success fw-bold text-start d-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#059669' }}>
                  file_download
                </span>
                Export Reports
              </a>
            </div>
          </div>
        </div>

        {/* Department Performance */}
        <div className="col-12 col-md-8">
          <div className="table-card p-0">
            <div className="table-card-header">
              <h5>
                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>
                  corporate_fare
                </span>
                Department Performance Overview
              </h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => { window.location.href = '/admin?pg=reports'; }}>
                Full Report
              </button>
            </div>
            <div className="p-4">
              {departmentPerformance.map((department, index) => (
                <div className="department-bar-row" key={index}>
                  <span className="department-bar-label">{department.name}</span>
                  <div className="department-bar-track">
                    <div
                      className="department-bar-fill"
                      style={{
                        width: `${department.progress}%`,
                        background: department.progress >= 70 ? '#005696' :
                          department.progress >= 50 ? '#ffcd00' : '#e31837'
                      }}
                    />
                  </div>
                  <span className="department-bar-pct">{department.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="col-12">
          <div className="table-card p-0">
            <div className="table-card-header">
              <h5>
                <span className="material-symbols-outlined me-2" style={{ color: 'var(--mubs-blue)' }}>
                  history
                </span>
                Recent System Activity
              </h5>
            </div>
            <div className="p-4">
              {recentActivities.map((activity, index) => (
                <div className="timeline-item" key={index}>
                  <div className="timeline-dot" style={{ background: activity.bgColor }}>
                    <span className="material-symbols-outlined" style={{ color: activity.iconColor }}>
                      {activity.icon}
                    </span>
                  </div>
                  <div className="fw-bold text-dark" style={{ fontSize: '.88rem' }}>
                    {activity.description}
                  </div>
                  <div className="text-muted" style={{ fontSize: '.75rem' }}>
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CreateUserModal
        show={showCreateUserModal}
        onHide={() => setShowCreateUserModal(false)}
        onUserCreated={fetchDashboardData}
      />
      <CreateActivityModal
        show={showCreateActivityModal}
        onHide={() => setShowCreateActivityModal(false)}
        onActivityCreated={fetchDashboardData}
        mode="create"
      />
    </Layout>
  );
}