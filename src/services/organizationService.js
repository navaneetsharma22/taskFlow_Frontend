import API from './api';

/**
 * Organization service module.
 * Encapsulates all organization/tenant management API calls.
 */
const organizationService = {
  /** Get all organizations (Super Admin only) */
  getAll: () => API.get('/organizations'),

  /** Get single organization by ID */
  getById: (orgId) => API.get(`/organizations/${orgId}`),

  /** Create a new organization (Super Admin only) */
  create: (data) => API.post('/organizations', data),

  /** Update organization details */
  update: (orgId, data) => API.put(`/organizations/${orgId}`, data),

  /** Suspend an organization */
  suspend: (orgId) => API.patch(`/organizations/${orgId}/suspend`),

  /** Activate a suspended organization */
  activate: (orgId) => API.patch(`/organizations/${orgId}/activate`),

  /** Delete an organization (Super Admin only) */
  delete: (orgId) => API.delete(`/organizations/${orgId}`),

  /** Update subscription tier */
  updateSubscription: (orgId, tier) => API.patch(`/organizations/${orgId}/subscription`, { tier }),

  /** Get organization members */
  getMembers: (orgId) => API.get(`/organizations/${orgId}/members`),

  /** Invite a new member */
  inviteMember: (orgId, data) => API.post(`/organizations/${orgId}/invite`, data),

  /** Remove a member */
  removeMember: (orgId, userId) => API.delete(`/organizations/${orgId}/members/${userId}`),
};

export default organizationService;
