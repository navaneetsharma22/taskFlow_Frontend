import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/projects/Projects';
import Tasks from '../pages/tasks/Tasks';
import Analytics from '../pages/analytics/Analytics';
import Organization from '../pages/organization/Organization';
import Settings from '../pages/settings/Settings';
import Profile from '../pages/profile/Profile';
import DesignSystem from '../pages/settings/DesignSystem';
import Automation from '../pages/automation/Automation';

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      
      {/* Authenticated Workspace Pages */}
      <Route 
        element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/organization" element={<Organization />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/automation" element={<Automation />} />
        
        {/* Default route redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Public Guest Auth Pages */}
      <Route 
        element={!isAuthenticated ? <AuthLayout /> : <Navigate to="/dashboard" replace />}
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />

    </Routes>
  );
};

export default AppRoutes;
