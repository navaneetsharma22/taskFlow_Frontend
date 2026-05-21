import API from './api';

/**
 * Task service module.
 * Encapsulates all task-related API calls.
 */
const taskService = {
  /** Get all tasks for current org, optionally filtered by project */
  getAll: (params = {}) => API.get('/tasks', { params }),

  /** Get single task by ID */
  getById: (taskId) => API.get(`/tasks/${taskId}`),

  /** Create a new task */
  create: (data) => API.post('/tasks', data),

  /** Update task fields */
  update: (taskId, data) => API.put(`/tasks/${taskId}`, data),

  /** Delete a task */
  delete: (taskId) => API.delete(`/tasks/${taskId}`),

  /** Move task to a new status (Kanban) */
  moveStatus: (taskId, newStatus) => API.patch(`/tasks/${taskId}/status`, { status: newStatus }),

  /** Add a comment to a task */
  addComment: (taskId, text) => API.post(`/tasks/${taskId}/comments`, { text }),

  /** Toggle subtask completion */
  toggleSubtask: (taskId, subtaskId) => API.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`),

  /** Assign task to a user */
  assign: (taskId, userId) => API.patch(`/tasks/${taskId}/assign`, { userId }),
};

export default taskService;
