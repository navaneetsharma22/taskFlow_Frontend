import API from './api';

/**
 * Project service module.
 * Encapsulates all project-related API calls.
 */
const projectService = {
  /** Get all projects for current organization */
  getAll: () => API.get('/projects'),

  /** Get single project by ID */
  getById: (projectId) => API.get(`/projects/${projectId}`),

  /** Create a new project */
  create: (data) => API.post('/projects', data),

  /** Update project details */
  update: (projectId, data) => API.put(`/projects/${projectId}`, data),

  /** Delete a project */
  delete: (projectId) => API.delete(`/projects/${projectId}`),

  /** Get project members */
  getMembers: (projectId) => API.get(`/projects/${projectId}/members`),

  /** Add member to project */
  addMember: (projectId, userId) => API.post(`/projects/${projectId}/members`, { userId }),

  /** Remove member from project */
  removeMember: (projectId, userId) => API.delete(`/projects/${projectId}/members/${userId}`),
};

export default projectService;
