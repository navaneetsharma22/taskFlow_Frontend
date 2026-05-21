import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert } from 'lucide-react';

/**
 * RoleGuard - Protects routes based on user role.
 * If user's role is not in the allowedRoles array, redirects to /dashboard
 * or renders an unauthorized state.
 * 
 * Usage:
 *   <RoleGuard allowedRoles={['super_admin']}>
 *     <SuperAdmin />
 *   </RoleGuard>
 */
const RoleGuard = ({ children, allowedRoles = [], fallback = 'redirect' }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Normalize the user's role for comparison
  const userRole = (user?.role || 'employee').toLowerCase().replace(/\s+/g, '_');
  const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().replace(/\s+/g, '_'));

  // super_admin always has access to everything
  if (userRole === 'super_admin' || normalizedAllowed.includes(userRole)) {
    return children;
  }

  // Unauthorized — show inline block or redirect
  if (fallback === 'redirect') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none animate-fade-in">
      <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100/10 mb-4">
        <ShieldAlert className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-150 tracking-tight">
        Access Restricted
      </h3>
      <p className="text-[10.5px] text-slate-450 mt-2 max-w-[320px] leading-relaxed">
        Your current role <span className="font-bold text-slate-600 dark:text-slate-300">({userRole})</span> does 
        not have permission to access this resource. Contact your organization administrator.
      </p>
    </div>
  );
};

export default RoleGuard;
