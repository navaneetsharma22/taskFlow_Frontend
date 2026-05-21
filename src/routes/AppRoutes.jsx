import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RoleGuard from '../components/common/RoleGuard';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Skeleton from '../components/common/Skeleton';

// Layouts — eagerly loaded (always needed)
import DashboardLayout from '../layouts/DashboardLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages — lazily loaded for code-splitting
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const Projects = lazy(() => import('../pages/projects/Projects'));
const Tasks = lazy(() => import('../pages/tasks/Tasks'));
const Analytics = lazy(() => import('../pages/analytics/Analytics'));
const Organization = lazy(() => import('../pages/organization/Organization'));
const Settings = lazy(() => import('../pages/settings/Settings'));
const Profile = lazy(() => import('../pages/profile/Profile'));
const DesignSystem = lazy(() => import('../pages/settings/DesignSystem'));
const Automation = lazy(() => import('../pages/automation/Automation'));
const SuperAdmin = lazy(() => import('../pages/dashboard/SuperAdmin'));
const AiAssistantPage = lazy(() => import('../pages/ai/AiAssistantPage'));
const Notifications = lazy(() => import('../pages/notifications/Notifications'));

/**
 * SuspenseFallback — Loading state shown while lazy chunks load.
 * Uses our Skeleton component instead of a blank screen.
 */
const SuspenseFallback = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
    <Skeleton variant="text" className="w-48 h-5" />
    <Skeleton variant="text" className="w-80 h-3" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton variant="card" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
      <Skeleton variant="card" />
    </div>
    <Skeleton variant="card" className="h-64" />
  </div>
);

const AppRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          
          {/* Authenticated Workspace Pages */}
          <Route 
            element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />}
          >
            {/* Pages accessible by ALL authenticated roles */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Pages requiring at least developer role */}
            <Route path="/projects" element={
              <RoleGuard allowedRoles={['developer', 'tester', 'frontend_lead', 'backend_lead', 'project_manager', 'organization_admin']} fallback="inline">
                <Projects />
              </RoleGuard>
            } />
            <Route path="/analytics" element={
              <RoleGuard allowedRoles={['developer', 'tester', 'frontend_lead', 'backend_lead', 'project_manager', 'organization_admin']} fallback="inline">
                <Analytics />
              </RoleGuard>
            } />

            {/* Pages requiring organization_admin or higher */}
            <Route path="/organization" element={
              <RoleGuard allowedRoles={['organization_admin']} fallback="inline">
                <Organization />
              </RoleGuard>
            } />
            <Route path="/settings" element={
              <RoleGuard allowedRoles={['organization_admin']} fallback="inline">
                <Settings />
              </RoleGuard>
            } />
            <Route path="/automation" element={
              <RoleGuard allowedRoles={['project_manager', 'organization_admin']} fallback="inline">
                <Automation />
              </RoleGuard>
            } />
            <Route path="/ai" element={
              <RoleGuard allowedRoles={['developer', 'frontend_lead', 'backend_lead', 'project_manager', 'organization_admin']} fallback="inline">
                <AiAssistantPage />
              </RoleGuard>
            } />

            {/* Super Admin ONLY */}
            <Route path="/super-admin" element={
              <RoleGuard allowedRoles={['super_admin']} fallback="inline">
                <SuperAdmin />
              </RoleGuard>
            } />

            {/* Dev tool — only in development */}
            <Route path="/design-system" element={<DesignSystem />} />
            
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
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
