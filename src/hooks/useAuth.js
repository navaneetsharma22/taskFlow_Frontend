import { useSelector } from 'react-redux';

/**
 * useAuth - Centralized authentication accessor hook.
 * Returns user, token, authentication status, organization, and role.
 */
const useAuth = () => {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const organization = useSelector((state) => state.auth.organization);
  const members = useSelector((state) => state.auth.members);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  return {
    user,
    token,
    isAuthenticated,
    organization,
    members,
    loading,
    error,
    role: user?.role || null,
    organizationId: organization?.id || null,
    organizationCode: organization?.code || null,
  };
};

export default useAuth;
