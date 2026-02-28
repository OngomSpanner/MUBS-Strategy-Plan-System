"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Layout from '../../components/Layout';
import StaffDashboard from './views/StaffDashboard';
import StaffTasks from './views/StaffTasks';
import StaffDeadlines from './views/StaffDeadlines';
import StaffNotifications from './views/StaffNotifications';
import StaffSubmitReport from './views/StaffSubmitReport';
import StaffSubmissions from './views/StaffSubmissions';
import StaffFeedback from './views/StaffFeedback';

function StaffContent() {
    const searchParams = useSearchParams();
    const pg = searchParams.get('pg') || 'dashboard';

    switch (pg) {
        case 'dashboard':
            return <StaffDashboard />;
        case 'tasks':
            return <StaffTasks />;
        case 'deadlines':
            return <StaffDeadlines />;
        case 'notifications':
            return <StaffNotifications />;
        case 'submit':
            return <StaffSubmitReport />;
        case 'submissions':
            return <StaffSubmissions />;
        case 'feedback':
            return <StaffFeedback />;
        default:
            return <StaffDashboard />;
    }
}

export default function StaffPage() {
    return (
        <Layout>
            <Suspense fallback={<div className="p-4">Loading Staff Dashboard...</div>}>
                <StaffContent />
            </Suspense>
        </Layout>
    );
}
