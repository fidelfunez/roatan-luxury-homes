import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Services from '@/pages/Services';
import Properties from '@/pages/Properties';
import Blog from '@/pages/Blog';
import ServiceDetail from '@/pages/ServiceDetail'; 
import PropertyDetail from '@/pages/PropertyDetail';
import AddPropertyPage from '@/pages/AddPropertyPage';
import EditPropertyPage from '@/pages/EditPropertyPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminSubmissions from '@/pages/AdminSubmissions';
import ClientPropertySubmission from '@/pages/ClientPropertySubmission';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminWebsiteEditor from '@/pages/AdminWebsiteEditor';
import PerformanceTest from '@/pages/PerformanceTest';

import AdminProperties from '@/pages/AdminProperties';
import AdminBlog from '@/pages/AdminBlog';
import BlogDetail from '@/pages/BlogDetail';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import ScrollToTop from '@/components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        <Route path="/about" element={
          <Layout>
            <About />
          </Layout>
        } />
        <Route path="/contact" element={
          <Layout>
            <Contact />
          </Layout>
        } />
        <Route path="/services" element={
          <Layout>
            <Services />
          </Layout>
        } />
        <Route path="/services/:slug" element={
          <Layout>
            <ServiceDetail />
          </Layout>
        } />
        <Route path="/properties" element={
          <Layout>
            <Properties />
          </Layout>
        } />
        <Route path="/properties/:propertyId" element={
          <Layout>
            <PropertyDetail />
          </Layout>
        } />
        <Route path="/submit-property" element={
          <Layout>
            <ClientPropertySubmission />
          </Layout>
        } />
        <Route path="/blog" element={
          <Layout>
            <Blog />
          </Layout>
        } />
        <Route path="/blog/:slug" element={
          <Layout>
            <BlogDetail />
          </Layout>
        } />
        <Route path="/performance-test" element={
          <Layout>
            <PerformanceTest />
          </Layout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/properties/add" 
          element={
            <AdminLayout>
              <AddPropertyPage />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/properties/edit/:propertyId" 
          element={
            <AdminLayout>
              <EditPropertyPage />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/submissions" 
          element={
            <AdminLayout>
              <AdminSubmissions />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminLayout>
              <AdminAnalytics />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/website-editor" 
          element={
            <AdminLayout>
              <AdminWebsiteEditor />
            </AdminLayout>
          } 
        />

        <Route 
          path="/admin/properties" 
          element={
            <AdminLayout>
              <AdminProperties />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/blog" 
          element={
            <AdminLayout>
              <AdminBlog />
            </AdminLayout>
          } 
        />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/add-property" element={
          <AdminLayout>
            <AddPropertyPage />
          </AdminLayout>
        } />
        <Route path="/edit-property/:propertyId" element={
          <AdminLayout>
            <EditPropertyPage />
          </AdminLayout>
        } />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        {/* 404 Route - You can add a NotFoundPage component here */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </>
  );
}

export default App;