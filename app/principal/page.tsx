import React from 'react';
import Layout from '@/components/Layout';
import ExecutiveOverview from '@/app/principal/views/ExecutiveOverview';
import StrategicSummary from '@/app/principal/views/StrategicSummary';
import PerformanceAnalytics from '@/app/principal/views/PerformanceAnalytics';
import PrincipalReports from '@/app/principal/views/PrincipalReports';

interface PrincipalPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PrincipalDashboard({ searchParams }: PrincipalPageProps) {
    const params = await searchParams;
    const pg = params?.pg || 'executive';

    const renderContent = () => {
        switch (pg) {
            case 'strategic':
                return <StrategicSummary />;
            case 'analytics':
                return <PerformanceAnalytics />;
            case 'reports':
                return <PrincipalReports />;
            case 'executive':
            default:
                return <ExecutiveOverview />;
        }
    };

    return (
        <Layout>
            {renderContent()}
        </Layout>
    );
}

// Triggering HMR to clear Next.js cached Module Not Found error
