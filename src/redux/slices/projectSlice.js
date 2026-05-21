import { createSlice } from '@reduxjs/toolkit';

const mockProjects = [
  {
    id: 'proj-1',
    name: 'TaskFlow Core App',
    description: 'Design and implementation of the React + Vite scalable client workspace and Kanban flow.',
    category: 'Development',
    status: 'In Progress',
    progress: 68,
    dueDate: '2026-06-15',
    members: ['usr-101', 'usr-102', 'usr-103'],
    tasksCount: 18,
    completedTasksCount: 12,
    createdAt: '2026-04-01',
    color: '#8b5cf6', // violet
  },
  {
    id: 'proj-2',
    name: 'SaaS Platform Audits',
    description: 'Aggressive security scanning, tenant isolation checks, and RBAC implementation protocols.',
    category: 'Security',
    status: 'Review',
    progress: 92,
    dueDate: '2026-05-30',
    members: ['usr-101', 'usr-103'],
    tasksCount: 12,
    completedTasksCount: 11,
    createdAt: '2026-04-10',
    color: '#3b82f6', // blue
  },
  {
    id: 'proj-3',
    name: 'Automation Engine V2',
    description: 'Constructing the node-based rule builders, workflow triggers, and third-party webhook receivers.',
    category: 'Backend',
    status: 'In Progress',
    progress: 35,
    dueDate: '2026-07-20',
    members: ['usr-102', 'usr-103'],
    tasksCount: 25,
    completedTasksCount: 9,
    createdAt: '2026-05-01',
    color: '#10b981', // green
  },
];

const initialState = {
  list: mockProjects,
  currentProject: mockProjects[0],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    fetchProjectsStart: (state) => {
      state.loading = true;
    },
    fetchProjectsSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchProjectsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentProject: (state, action) => {
      const proj = state.list.find(p => p.id === action.payload);
      if (proj) state.currentProject = proj;
    },
    createProject: (state, action) => {
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
      const newProj = {
        id: `proj-${Date.now()}`,
        name: action.payload.name,
        description: action.payload.description || '',
        category: action.payload.category || 'General',
        status: 'In Progress',
        progress: 0,
        dueDate: action.payload.dueDate || new Date().toISOString().split('T')[0],
        members: action.payload.members || ['usr-101'],
        tasksCount: 0,
        completedTasksCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        color: colors[state.list.length % colors.length],
      };
      state.list.push(newProj);
      state.currentProject = newProj;
    },
    updateProject: (state, action) => {
      const idx = state.list.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload };
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = state.list[idx];
        }
      }
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload);
      if (state.currentProject && state.currentProject.id === action.payload) {
        state.currentProject = state.list[0] || null;
      }
    },
    updateProjectStats: (state, action) => {
      const { projectId, tasksCount, completedTasksCount } = action.payload;
      const proj = state.list.find(p => p.id === projectId);
      if (proj) {
        proj.tasksCount = tasksCount;
        proj.completedTasksCount = completedTasksCount;
        proj.progress = tasksCount > 0 ? Math.round((completedTasksCount / tasksCount) * 100) : 0;
        if (state.currentProject && state.currentProject.id === projectId) {
          state.currentProject = proj;
        }
      }
    }
  },
});

export const {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  setCurrentProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStats,
} = projectSlice.actions;

export default projectSlice.reducer;
