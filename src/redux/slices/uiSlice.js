import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: true, // Start in Dark Mode for that gorgeous premium visual impact
  activeView: 'kanban', // 'kanban' | 'list'
  createProjectModalOpen: false,
  createTaskModalOpen: false,
  aiAssistantOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setCreateProjectModalOpen: (state, action) => {
      state.createProjectModalOpen = action.payload;
    },
    setCreateTaskModalOpen: (state, action) => {
      state.createTaskModalOpen = action.payload;
    },
    toggleAiAssistant: (state) => {
      state.aiAssistantOpen = !state.aiAssistantOpen;
    },
    setAiAssistantOpen: (state, action) => {
      state.aiAssistantOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleDarkMode,
  setDarkMode,
  setActiveView,
  setCreateProjectModalOpen,
  setCreateTaskModalOpen,
  toggleAiAssistant,
  setAiAssistantOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
