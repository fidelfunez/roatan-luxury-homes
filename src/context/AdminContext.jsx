import React, { createContext, useState, useEffect, useContext } from 'react';

    const AdminContext = createContext();

    export const useAdmin = () => useContext(AdminContext);

    const ADMIN_PASSWORD = 'supersecretpassword';
    const LOCAL_STORAGE_ADMIN_KEY = 'caribbeanLuxRealty_isAdmin';

    export const AdminProvider = ({ children }) => {
      const [isAdmin, setIsAdmin] = useState(false);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        try {
          const storedIsAdmin = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
          if (storedIsAdmin) {
            const parsedValue = JSON.parse(storedIsAdmin);
            // Only set admin if it's explicitly true
            setIsAdmin(parsedValue === true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error reading admin status from localStorage:", error);
          setIsAdmin(false);
        }
        setLoading(false);
      }, []);

      const login = (password) => {
        if (password === ADMIN_PASSWORD) {
          setIsAdmin(true);
          try {
            localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(true));
          } catch (error) {
            console.error("Error saving admin status to localStorage:", error);
          }
          return true;
        }
        return false;
      };

      const logout = () => {
        setIsAdmin(false);
        try {
          localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
        } catch (error) {
          console.error("Error removing admin status from localStorage:", error);
        }
      };

      // Debug function to clear admin state
      const clearAdminState = () => {
        setIsAdmin(false);
        try {
          localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
        } catch (error) {
          console.error("Error clearing admin status from localStorage:", error);
        }
      };

      if (loading) {
        return (
          <div className="flex justify-center items-center h-screen bg-background">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        );
      }

      return (
        <AdminContext.Provider value={{ isAdmin, login, logout, loading, clearAdminState }}>
          {children}
        </AdminContext.Provider>
      );
    };