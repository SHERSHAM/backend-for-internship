import React, { useState } from 'react';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './styles/global.css';

function AppRoutes() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('login');

  if (loading) return (
    <div className="loading-page">
      <div className="spinner" />
    </div>
  );

  if (!user) {
    return page === 'login'
      ? <Login onSwitch={() => setPage('register')} />
      : <Register onSwitch={() => setPage('login')} />;
  }

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
