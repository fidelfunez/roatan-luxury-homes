import React from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';
    import { Toaster } from '@/components/ui/toaster';
    import { AdminProvider } from '@/context/AdminContext.jsx';
    import { BrowserRouter as Router } from 'react-router-dom';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Router>
          <AdminProvider>
            <App />
          </AdminProvider>
        </Router>
        <Toaster />
      </React.StrictMode>
    );