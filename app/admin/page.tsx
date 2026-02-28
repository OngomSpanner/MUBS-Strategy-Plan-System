import React from 'react';
import Dashboard from '@/app/page';
import StrategicPage from '@/app/strategic/page';
import CommitteePage from '@/app/committee/page';
import TrackingPage from '@/app/tracking/page';
import UsersPage from '@/app/users/page';
import ReportsPage from '@/app/reports/page';

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminDashboard({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const pg = params?.pg || 'dashboard';

  switch (pg) {
    case 'strategic':
      return <StrategicPage />;
    case 'committee':
      return <CommitteePage />;
    case 'tracking':
      return <TrackingPage />;
    case 'users':
      return <UsersPage />;
    case 'reports':
      return <ReportsPage />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
}
