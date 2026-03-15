import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import '@/i18n';
import { Toaster } from '@/components/ui/toaster';
import { AdminProvider } from '@/context/AdminContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Avoid hiding #root until JS runs: on slow mobile (Lighthouse throttle) the page stayed
// blank and the mobile audit failed. Content is visible as soon as React renders.
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <HelmetProvider>
        <Router>
          <AdminProvider>
            <App />
          </AdminProvider>
        </Router>
      </HelmetProvider>
      <Toaster />
    </React.StrictMode>
  );
}