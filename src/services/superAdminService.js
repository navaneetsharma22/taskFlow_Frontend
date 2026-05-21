import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const superAdminAPI = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the SuperAdmin token
superAdminAPI.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('tf_superadmin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authorization failures
superAdminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('[SuperAdmin API] Unauthorized or Forbidden. Redirecting to login.');
      // Only redirect if we are not already on the superadmin login page
      if (!window.location.pathname.includes('/superadmin/login') && window.location.pathname.includes('/superadmin')) {
        sessionStorage.removeItem('tf_superadmin_token');
        sessionStorage.removeItem('tf_superadmin_user');
        window.location.href = '/superadmin/login';
      }
    }
    return Promise.reject(error);
  }
);

const superAdminService = {
  login: async (email, password) => {
    const response = await superAdminAPI.post('/superadmin/login', { email, password });
    if (response.data?.accessToken) {
      sessionStorage.setItem('tf_superadmin_token', response.data.accessToken);
      sessionStorage.setItem('tf_superadmin_user', JSON.stringify(response.data.superAdmin));
    }
    return response.data;
  },

  logout: async () => {
    try {
      const refreshToken = sessionStorage.getItem('tf_superadmin_token'); // Or handle rotation
      await superAdminAPI.post('/superadmin/logout', { refreshToken });
    } catch (e) {
      console.warn('[SuperAdmin API] Logout API call failed, clearing local session anyway.', e);
    } finally {
      sessionStorage.removeItem('tf_superadmin_token');
      sessionStorage.removeItem('tf_superadmin_user');
    }
  },

  getOrganizations: async () => {
    const response = await superAdminAPI.get('/superadmin/organizations');
    return response.data;
  },

  createOrganization: async (name) => {
    const response = await superAdminAPI.post('/superadmin/create-organization', { name });
    return response.data;
  },

  updateOrganizationStatus: async (id, status) => {
    const response = await superAdminAPI.patch(`/superadmin/organization/${id}/status`, { status });
    return response.data;
  },

  deleteOrganization: async (id) => {
    const response = await superAdminAPI.delete(`/superadmin/organization/${id}`);
    return response.data;
  },

  isAuthenticated: () => {
    return !!sessionStorage.getItem('tf_superadmin_token');
  },

  getCurrentAdmin: () => {
    try {
      const admin = sessionStorage.getItem('tf_superadmin_user');
      return admin ? JSON.parse(admin) : null;
    } catch (e) {
      return null;
    }
  }
};

export default superAdminService;
