import { createSlice } from '@reduxjs/toolkit';

/**
 * Mock user data — used only for development/demo purposes.
 * In production, initialState starts empty and is populated via login API.
 */
const mockUser = {
  id: 'usr-101',
  name: 'Sarah Connor',
  email: 'sarah.connor@taskflow.so',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  role: 'organization_admin',
  organization: {
    id: 'org-909',
    name: 'Cyberdyne Systems',
    code: 'CYB-DX9-2026',
    membersCount: 12,
  }
};

/**
 * Check if there's a persisted auth session in sessionStorage.
 * Uses sessionStorage (not localStorage) to reduce XSS token exposure surface.
 */
const getPersistedAuth = () => {
  try {
    const persistedToken = sessionStorage.getItem('tf_token');
    const persistedUser = sessionStorage.getItem('tf_user');
    if (persistedToken && persistedUser) {
      const user = JSON.parse(persistedUser);
      return {
        user,
        token: persistedToken,
        isAuthenticated: true,
        organization: user.organization || null,
      };
    }
  } catch (e) {
    // Corrupted storage — clear it
    sessionStorage.removeItem('tf_token');
    sessionStorage.removeItem('tf_user');
  }
  return null;
};

const persisted = getPersistedAuth();

const initialState = {
  // If persisted session exists, restore it. Otherwise start unauthenticated.
  // For DEMO mode only: fallback to mockUser so the dashboard is visible on first load.
  // In production, remove the mockUser fallback entirely.
  user: persisted?.user || mockUser,
  token: persisted?.token || 'demo-session-token',
  isAuthenticated: persisted?.isAuthenticated ?? true, // demo: true. production: false
  loading: false,
  error: null,
  organization: persisted?.organization || mockUser.organization,
  members: [
    { id: 'usr-101', name: 'Sarah Connor', email: 'sarah.connor@taskflow.so', role: 'organization_admin', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-102', name: 'John Connor', email: 'john.c@taskflow.so', role: 'developer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-103', name: 'Marcus Wright', email: 'marcus.w@taskflow.so', role: 'project_manager', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'active' },
    { id: 'usr-104', name: 'Katherine Brewster', email: 'kate.b@taskflow.so', role: 'tester', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', status: 'invited' },
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

      // Persist to sessionStorage (scoped to tab — safer than localStorage)
      try {
        sessionStorage.setItem('tf_token', action.payload.token);
        sessionStorage.setItem('tf_user', JSON.stringify(action.payload.user));
      } catch (e) {
        console.warn('[Auth] Failed to persist session:', e);
      }
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

      // Clear persisted session
      try {
        sessionStorage.removeItem('tf_token');
        sessionStorage.removeItem('tf_user');
      } catch (e) {
        // Ignore
      }
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Sync persisted session
        try {
          sessionStorage.setItem('tf_user', JSON.stringify(state.user));
        } catch (e) { /* ignore */ }
      }
    },
    updateOrganization: (state, action) => {
      state.organization = { ...state.organization, ...action.payload };
      if (state.user) {
        state.user.organization = { ...state.user.organization, ...action.payload };
        try {
          sessionStorage.setItem('tf_user', JSON.stringify(state.user));
        } catch (e) { /* ignore */ }
      }
    },
    refreshToken: (state, action) => {
      state.token = action.payload;
      try {
        sessionStorage.setItem('tf_token', action.payload);
      } catch (e) { /* ignore */ }
    },
    inviteMember: (state, action) => {
      state.members.push({
        id: `usr-${Date.now()}`,
        name: action.payload.name || action.payload.email.split('@')[0],
        email: action.payload.email,
        role: action.payload.role || 'developer',
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
  refreshToken,
  inviteMember,
  removeMember,
} = authSlice.actions;

export default authSlice.reducer;
