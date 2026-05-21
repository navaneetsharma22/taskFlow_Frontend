import useAuth from './useAuth';

/**
 * Role hierarchy for TaskFlow multi-tenant SaaS.
 * Higher index = more permissions.
 */
const ROLE_HIERARCHY = [
  'employee',
  'tester',
  'developer',
  'backend_lead',
  'frontend_lead',
  'project_manager',
  'organization_admin',
  'super_admin',
];

/**
 * Canonical permission matrix mapping roles to allowed actions.
 */
const PERMISSION_MAP = {
  super_admin: [
    'create_organization', 'suspend_organization', 'delete_organization',
    'manage_subscription', 'manage_branding', 'manage_ai_access',
    'view_all_analytics', 'manage_all_users', 'manage_all_projects',
    'manage_all_tasks', 'manage_automation', 'manage_settings',
    'view_super_admin',
  ],
  organization_admin: [
    'manage_workspace', 'manage_users', 'manage_projects',
    'manage_all_tasks', 'manage_automation', 'manage_settings',
    'view_analytics', 'manage_branding',
  ],
  project_manager: [
    'manage_projects', 'manage_all_tasks', 'view_analytics',
    'assign_tasks', 'manage_automation',
  ],
  frontend_lead: [
    'manage_tasks', 'view_analytics', 'assign_tasks',
  ],
  backend_lead: [
    'manage_tasks', 'view_analytics', 'assign_tasks',
  ],
  developer: [
    'manage_tasks', 'view_analytics',
  ],
  tester: [
    'manage_tasks', 'view_analytics',
  ],
  employee: [
    'view_tasks', 'view_analytics',
  ],
};

/**
 * usePermissions - Returns permission checking utilities based on the current user's role.
 */
const usePermissions = () => {
  const { role } = useAuth();

  // Normalize role for lookup (backend uses snake_case, frontend may use mixed)
  const normalizedRole = role
    ? role.toLowerCase().replace(/\s+/g, '_')
    : 'employee';

  /**
   * Check if current user has a specific permission.
   */
  const hasPermission = (permission) => {
    const perms = PERMISSION_MAP[normalizedRole] || [];
    return perms.includes(permission);
  };

  /**
   * Check if current user has at least the given role level.
   */
  const hasRole = (requiredRole) => {
    const userLevel = ROLE_HIERARCHY.indexOf(normalizedRole);
    const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
    if (userLevel === -1 || requiredLevel === -1) return false;
    return userLevel >= requiredLevel;
  };

  /**
   * Check if current user's role is exactly one of the allowed roles.
   */
  const isOneOf = (allowedRoles = []) => {
    return allowedRoles
      .map((r) => r.toLowerCase().replace(/\s+/g, '_'))
      .includes(normalizedRole);
  };

  const isSuperAdmin = normalizedRole === 'super_admin';
  const isOrgAdmin = normalizedRole === 'organization_admin' || isSuperAdmin;
  const isManager = hasRole('project_manager');

  return {
    role: normalizedRole,
    hasPermission,
    hasRole,
    isOneOf,
    isSuperAdmin,
    isOrgAdmin,
    isManager,
    ROLE_HIERARCHY,
  };
};

export default usePermissions;
