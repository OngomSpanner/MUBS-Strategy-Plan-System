import React from 'react';
import Layout from '@/components/Layout';

export default function UsersPage() {
    return (
        <Layout>
            <div className="table-card p-4">
                <h4>User & Role Management</h4>
                <p className="text-muted">Manage system users and their roles.</p>
            </div>
        </Layout>
    );
}
