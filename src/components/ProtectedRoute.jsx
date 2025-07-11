import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAdmin } from '@/context/AdminContext.jsx';

    const ProtectedRoute = ({ children }) => {
      const { isAdmin, loading } = useAdmin();
      const location = useLocation();

      if (loading) {
         return (
          <div className="flex justify-center items-center h-screen bg-background">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      }

      if (!isAdmin) {
        return <Navigate to="/admin-login" state={{ from: location }} replace />;
      }

      return children;
    };

    export default ProtectedRoute;