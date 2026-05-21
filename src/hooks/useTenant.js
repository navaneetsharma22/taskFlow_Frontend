import { useSelector, useDispatch } from 'react-redux';
import { updateOrganization } from '../redux/slices/authSlice';

/**
 * useTenant - Centralized tenant/organization context accessor.
 * Provides organization data, switching capabilities, and tenant isolation utilities.
 */
const useTenant = () => {
  const dispatch = useDispatch();
  const organization = useSelector((state) => state.auth.organization);
  const user = useSelector((state) => state.auth.user);

  const organizationId = organization?.id || null;
  const organizationCode = organization?.code || null;
  const organizationName = organization?.name || null;
  const isOrgActive = organization?.status !== 'Suspended';

  /**
   * Switch the active tenant context.
   * In production, this would re-authenticate and fetch tenant-scoped data.
   */
  const switchTenant = (org) => {
    dispatch(updateOrganization(org));
  };

  /**
   * Returns headers object with tenant context for API calls.
   */
  const getTenantHeaders = () => {
    return {
      'x-organization-id': organizationId || '',
      'x-organization-code': organizationCode || '',
    };
  };

  return {
    organization,
    organizationId,
    organizationCode,
    organizationName,
    isOrgActive,
    switchTenant,
    getTenantHeaders,
  };
};

export default useTenant;
