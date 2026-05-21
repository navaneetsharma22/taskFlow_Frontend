import API from './api';

/**
 * Authentication service module.
 * Encapsulates all auth-related API calls.
 */
const authService = {
  /**
   * Login with email and password.
   * Backend returns: { token, refreshToken, user }
   */
  login: (email, password) => {
    return API.post('/auth/login', { email, password });
  },

  /**
   * Register a new account / create organization.
   */
  register: (data) => {
    return API.post('/auth/register', data);
  },

  /**
   * Join an existing organization with an invite code.
   */
  joinOrganization: (data) => {
    return API.post('/auth/join-organization', data);
  },

  /**
   * Refresh the JWT token using httpOnly cookie.
   */
  refreshToken: () => {
    return API.post('/auth/refresh-token', {}, { withCredentials: true });
  },

  /**
   * Logout — invalidates refresh token on backend.
   */
  logout: () => {
    return API.post('/auth/logout', {}, { withCredentials: true });
  },

  /**
   * Get current user profile.
   */
  getProfile: () => {
    return API.get('/auth/me');
  },

  /**
   * Update user profile fields.
   */
  updateProfile: (data) => {
    return API.put('/auth/profile', data);
  },

  /**
   * Change user password.
   */
  changePassword: (currentPassword, newPassword) => {
    return API.put('/auth/change-password', { currentPassword, newPassword });
  },
};

export default authService;
