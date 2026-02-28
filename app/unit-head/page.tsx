import React from 'react';
import Layout from '@/components/Layout';
import UnitHeadDashboard from './views/UnitHeadDashboard';
import UnitStrategicActivities from './views/UnitStrategicActivities';
import UnitTasks from './views/UnitTasks';
import UnitStaff from './views/UnitStaff';
import UnitSubmissions from './views/UnitSubmissions';
import UnitEvaluations from './views/UnitEvaluations';

interface UnitHeadPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UnitHeadPage({ searchParams }: UnitHeadPageProps) {
    const params = await searchParams;
    const pg = params?.pg || 'dashboard';

    const renderContent = () => {
        switch (pg) {
            case 'activities':
                return <UnitStrategicActivities />;
            case 'tasks':
                return <UnitTasks />;
            case 'staff':
                return <UnitStaff />;
            case 'submissions':
                return <UnitSubmissions />;
            case 'evaluations':
                return <UnitEvaluations />;
            case 'dashboard':
            default:
                return <UnitHeadDashboard />;
        }
    };

    return (
        <Layout>
            {renderContent()}
        </Layout>
    );
}
