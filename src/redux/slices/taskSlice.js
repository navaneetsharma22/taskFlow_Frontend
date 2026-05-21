import { createSlice } from '@reduxjs/toolkit';

const mockTasks = [
  // Project 1 Tasks
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Initialize Vite + Tailwind Architecture',
    description: 'Set up folder layouts, CSS base layers, customized themes, and build pipeline configs.',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-05-22',
    assignee: 'usr-101',
    tags: ['Setup', 'Design'],
    subtasks: [
      { id: 'sub-1', title: 'Install Vite & React', completed: true },
      { id: 'sub-2', title: 'Setup Tailwind CSS & PostCSS', completed: true },
      { id: 'sub-3', title: 'Create main layout frames', completed: true }
    ],
    comments: [
      { id: 'com-1', userName: 'John Connor', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', text: 'This looks incredibly clean. Excellent structure!', createdAt: '2026-05-20T14:32:00Z' }
    ],
    history: [
      { id: 'hist-1', user: 'Sarah Connor', action: 'created the task', time: '2026-05-20T10:00:00Z' },
      { id: 'hist-2', user: 'Sarah Connor', action: 'moved task to Done', time: '2026-05-21T09:00:00Z' }
    ]
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Configure Redux Store & Auth Flow',
    description: 'Establish standard actions, client side auth status preservation, and mock auth handlers.',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-05-25',
    assignee: 'usr-101',
    tags: ['Redux', 'Auth'],
    subtasks: [
      { id: 'sub-4', title: 'Create redux state schema', completed: true },
      { id: 'sub-5', title: 'Link store wrapper in Main.jsx', completed: true },
      { id: 'sub-6', title: 'Build token validation interceptor', completed: false }
    ],
    comments: [],
    history: [
      { id: 'hist-3', user: 'Sarah Connor', action: 'assigned task to self', time: '2026-05-20T10:15:00Z' }
    ]
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Implement Interactive Kanban Board',
    description: 'Integrate Framer Motion animations for drag-and-drop cues, card expanding, and fast status transitions.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-06-01',
    assignee: 'usr-102',
    tags: ['UI/UX', 'Animation'],
    subtasks: [
      { id: 'sub-7', title: 'Design board column layouts', completed: true },
      { id: 'sub-8', title: 'Add Framer Motion layouts', completed: false },
      { id: 'sub-9', title: 'Implement click to edit drawer', completed: false }
    ],
    comments: [],
    history: []
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Design Analytics Charts with Recharts',
    description: 'Construct interactive visuals showing task burn-down, velocity rates, and workload allocations.',
    status: 'Todo',
    priority: 'Medium',
    dueDate: '2026-06-05',
    assignee: 'usr-103',
    tags: ['Analytics', 'Charts'],
    subtasks: [],
    comments: [],
    history: []
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    title: 'AI Smart Prioritization Integration',
    description: 'Create UI for the AI Assistant drawer. Let user generate tasks via prompt and auto-evaluate difficulty.',
    status: 'Todo',
    priority: 'Low',
    dueDate: '2026-06-10',
    assignee: 'usr-101',
    tags: ['AI', 'Feature'],
    subtasks: [],
    comments: [],
    history: []
  },

  // Project 2 Tasks (Audits)
  {
    id: 'task-201',
    projectId: 'proj-2',
    title: 'Perform Threat Modeling Assessment',
    description: 'Inspect API endpoints for prompt injection patterns, hardcoded secrets, and tenant context isolation.',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-05-18',
    assignee: 'usr-103',
    tags: ['Security', 'Audit'],
    subtasks: [],
    comments: [],
    history: []
  },
  {
    id: 'task-202',
    projectId: 'proj-2',
    title: 'Implement Tenant Separation Middleware',
    description: 'Review database isolation indices. Ensure every SQL/NoSQL query references strict organization context.',
    status: 'Done',
    priority: 'High',
    dueDate: '2026-05-20',
    assignee: 'usr-101',
    tags: ['Security', 'Backend'],
    subtasks: [],
    comments: [],
    history: []
  }
];

const initialState = {
  list: mockTasks,
  selectedTask: null,
  loading: false,
  error: null,
  filters: {
    status: 'All',
    priority: 'All',
    search: '',
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    fetchTasksStart: (state) => {
      state.loading = true;
    },
    fetchTasksSuccess: (state, action) => {
      state.loading = false;
      state.list = action.payload;
    },
    fetchTasksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    selectTask: (state, action) => {
      state.selectedTask = state.list.find(t => t.id === action.payload) || null;
    },
    clearSelectTask: (state) => {
      state.selectedTask = null;
    },
    addTask: (state, action) => {
      const newTask = {
        id: `task-${Date.now()}`,
        projectId: action.payload.projectId,
        title: action.payload.title,
        description: action.payload.description || '',
        status: action.payload.status || 'Todo',
        priority: action.payload.priority || 'Medium',
        dueDate: action.payload.dueDate || new Date().toISOString().split('T')[0],
        assignee: action.payload.assignee || 'usr-101',
        tags: action.payload.tags || [],
        subtasks: action.payload.subtasks || [],
        comments: [],
        history: [{
          id: `hist-${Date.now()}`,
          user: 'Sarah Connor',
          action: 'created the task',
          time: new Date().toISOString()
        }]
      };
      state.list.push(newTask);
    },
    updateTask: (state, action) => {
      const idx = state.list.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload };
        if (state.selectedTask && state.selectedTask.id === action.payload.id) {
          state.selectedTask = state.list[idx];
        }
      }
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter(t => t.id !== action.payload);
      if (state.selectedTask && state.selectedTask.id === action.payload) {
        state.selectedTask = null;
      }
    },
    moveTask: (state, action) => {
      const { taskId, newStatus } = action.payload;
      const task = state.list.find(t => t.id === taskId);
      if (task) {
        const oldStatus = task.status;
        task.status = newStatus;
        task.history.push({
          id: `hist-${Date.now()}`,
          user: 'Sarah Connor',
          action: `moved task from ${oldStatus} to ${newStatus}`,
          time: new Date().toISOString()
        });
        if (state.selectedTask && state.selectedTask.id === taskId) {
          state.selectedTask = task;
        }
      }
    },
    toggleSubtask: (state, action) => {
      const { taskId, subtaskId } = action.payload;
      const task = state.list.find(t => t.id === taskId);
      if (task) {
        const sub = task.subtasks.find(s => s.id === subtaskId);
        if (sub) {
          sub.completed = !sub.completed;
          if (state.selectedTask && state.selectedTask.id === taskId) {
            state.selectedTask = task;
          }
        }
      }
    },
    addComment: (state, action) => {
      const { taskId, commentText, user } = action.payload;
      const task = state.list.find(t => t.id === taskId);
      if (task) {
        task.comments.push({
          id: `com-${Date.now()}`,
          userName: user.name,
          userAvatar: user.avatar,
          text: commentText,
          createdAt: new Date().toISOString()
        });
        if (state.selectedTask && state.selectedTask.id === taskId) {
          state.selectedTask = task;
        }
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
});

export const {
  fetchTasksStart,
  fetchTasksSuccess,
  fetchTasksFailure,
  selectTask,
  clearSelectTask,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  toggleSubtask,
  addComment,
  setFilters
} = taskSlice.actions;

export default taskSlice.reducer;
