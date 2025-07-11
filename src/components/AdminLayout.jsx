import React from 'react';
import AdminNav from '@/components/AdminNav';
import AdminFooter from '@/components/AdminFooter';
import { useAdmin } from '@/context/AdminContext.jsx';
import { Navigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const { isAdmin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <AdminNav />
      <main className="pt-16 flex-grow">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout; 