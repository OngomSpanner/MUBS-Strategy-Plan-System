"use client";

import { useState, Suspense } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LogoutModal from './Modals/LogoutModal';
import { usePathname, useSearchParams } from 'next/navigation';

function LayoutContent({ children, sidebarOpen, setSidebarOpen }: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getPageKey = () => {
    // When under /admin or /principal, prefer the pg query parameter
    if (pathname.startsWith('/admin') || pathname.startsWith('/principal')) {
      return searchParams.get('pg') || (pathname.startsWith('/principal') ? 'executive' : 'dashboard');
    }
    // For other routes, derive from the path segment
    const trimmed = pathname.substring(1);
    return trimmed || 'dashboard';
  };

  const getPageTitle = () => {
    const key = getPageKey();
    const pageTitles: { [key: string]: string } = {
      'dashboard': 'Dashboard Overview',
      'strategic': 'Strategic Activities',
      'committee': 'Committee Reports',
      'tracking': 'Budget Tracking',
      'users': 'User Management',
      'reports': 'Reports & Analytics',

      // Principal specific
      'executive': 'Executive Overview',
      'compliance': 'Performance & Compliance',

      // HOD specific
      'activities': 'Assigned Activities',

      // Both HOD and Staff specific shared keys
      'tasks': 'Task Management',
      'staff': 'Staff Roster & HR',
      'submissions': 'Submissions Tracking',
      'evaluations': 'Staff Evaluations',

      // Staff specific
      'deadlines': 'My Deadlines',
      'notifications': 'Notifications Inbox',
      'submit': 'Submit Task Update',
      'feedback': 'Performance Feedback',
    };
    return pageTitles[key] || 'Dashboard';
  };

  return (
    <>
      <Topbar
        pageTitle={getPageTitle()}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="content-area">
        {children}
      </div>
    </>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="app-shell">
      <Suspense fallback={<div className="p-4 flex-fill d-flex align-items-center justify-content-center"><div className="spinner-border text-primary" role="status"></div></div>}>
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          onLogoutClick={() => setShowLogout(true)}
        />
        <div className="main-area">
          <LayoutContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            {children}
          </LayoutContent>
        </div>
      </Suspense>

      <LogoutModal show={showLogout} onHide={() => setShowLogout(false)} />
    </div>
  );
}