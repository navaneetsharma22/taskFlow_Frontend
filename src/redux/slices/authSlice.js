import { createSlice } from '@reduxjs/toolkit';

const mockUser = {
  id: 'usr-101',
  name: 'Sarah Connor',
  email: 'sarah.connor@taskflow.so',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'Admin',
  organization: {
    id: 'org-909',
    name: 'Cyberdyne Systems',
    code: 'CYB-DX9-2026',
    membersCount: 12,
  }
};

const initialState = {
  user: mockUser,
  token: 'mock-jwt-token-taskflow-saas-2026',
  isAuthenticated: true, // true by default to wow the user instantly with the premium dashboard
  loading: false,
  error: null,
  organization: mockUser.organization,
  members: [
    { id: 'usr-101', name: 'Sarah Connor', email: 'sarah.connor@taskflow.so', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-102', name: 'John Connor', email: 'john.c@taskflow.so', role: 'Member', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-103', name: 'Marcus Wright', email: 'marcus.w@taskflow.so', role: 'Member', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-104', name: 'Katherine Brewster', email: 'kate.b@taskflow.so', role: 'Viewer', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'invited' },
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.organization = action.payload.user.organization;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.organization = null;
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateOrganization: (state, action) => {
      state.organization = { ...state.organization, ...action.payload };
      if (state.user) {
        state.user.organization = { ...state.user.organization, ...action.payload };
      }
    },
    inviteMember: (state, action) => {
      state.members.push({
        id: `usr-${Date.now()}`,
        name: action.payload.name || action.payload.email.split('@')[0],
        email: action.payload.email,
        role: action.payload.role || 'Member',
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`,
        status: 'invited',
      });
      if (state.organization) {
        state.organization.membersCount += 1;
      }
    },
    removeMember: (state, action) => {
      state.members = state.members.filter(m => m.id !== action.payload);
      if (state.organization) {
        state.organization.membersCount = Math.max(1, state.organization.membersCount - 1);
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  updateOrganization,
  inviteMember,
  removeMember,
} = authSlice.actions;

export default authSlice.reducer;
