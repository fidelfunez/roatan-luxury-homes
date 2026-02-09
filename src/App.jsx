import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import ScrollToTop from '@/components/ScrollToTop';

// Lazy-load all non-Home routes to shrink initial JS bundle (improves LCP / Performance score)
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Properties = lazy(() => import('@/pages/Properties'));
const PropertyDetail = lazy(() => import('@/pages/PropertyDetail'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const ClientPropertySubmission = lazy(() => import('@/pages/ClientPropertySubmission'));
const PerformanceTest = lazy(() => import('@/pages/PerformanceTest'));
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminSubmissions = lazy(() => import('@/pages/AdminSubmissions'));
const AdminAnalytics = lazy(() => import('@/pages/AdminAnalytics'));
const AdminWebsiteEditor = lazy(() => import('@/pages/AdminWebsiteEditor'));
const AdminProperties = lazy(() => import('@/pages/AdminProperties'));
const AdminBlog = lazy(() => import('@/pages/AdminBlog'));
const AddPropertyPage = lazy(() => import('@/pages/AddPropertyPage'));
const EditPropertyPage = lazy(() => import('@/pages/EditPropertyPage'));
const DatabaseTest = lazy(() => import('@/components/DatabaseTest'));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center" aria-hidden="true">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
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
        <Route path="/privacy-policy" element={
          <Layout>
            <PrivacyPolicy />
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
        <Route 
          path="/admin/database-test" 
          element={
            <AdminLayout>
              <DatabaseTest />
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

        {/* 404 - catch-all */}
        <Route path="*" element={
          <Layout>
            <NotFound />
          </Layout>
        } />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;