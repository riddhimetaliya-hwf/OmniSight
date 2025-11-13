
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import RBACManager from './RBACManager';

const Admin: React.FC = () => {
  return (
    <Layout title="Admin" subtitle="System Configuration">
      <Routes>
        <Route path="/" element={<RBACManager />} />
      </Routes>
    </Layout>
  );
};

export default Admin;
