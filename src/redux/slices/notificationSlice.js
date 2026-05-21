import { createSlice } from '@reduxjs/toolkit';

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'AI Backlog Clean-up Completed',
    description: 'TaskFlow AI successfully categorized 5 untagged tasks in "Automation Engine V2".',
    type: 'ai',
    read: false,
    time: '5 mins ago',
  },
  {
    id: 'notif-2',
    title: 'Security Webhook Triggered',
    description: 'A production deployment audit webhook was triggered successfully by GitHub actions.',
    type: 'system',
    read: false,
    time: '2 hours ago',
  },
  {
    id: 'notif-3',
    title: 'Task Assignment',
    description: 'Sarah Connor assigned you to "Implement Interactive Kanban Board".',
    type: 'user',
    read: true,
    time: '1 day ago',
  },
];

const initialState = {
  list: mockNotifications,
  unreadCount: mockNotifications.filter(n => !n.read).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const newNotif = {
        id: `notif-${Date.now()}`,
        title: action.payload.title,
        description: action.payload.description || '',
        type: action.payload.type || 'system',
        read: false,
        time: 'Just now',
      };
      state.list.unshift(newNotif);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.list.forEach(n => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotification: (state, action) => {
      const notif = state.list.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.list = state.list.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.list = [];
      state.unreadCount = 0;
    }
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
