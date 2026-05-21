import { io } from 'socket.io-client';
import { store } from '../redux/store';

let socket = null;

/**
 * Initiates a WebSocket connection with JWT authentication and organization context.
 * Includes automatic reconnection and error handling.
 */
export const initiateSocketConnection = (token) => {
  if (socket?.connected) return socket;

  // Disconnect any stale socket before creating a new one
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  const state = store.getState();
  const organizationId = state.auth.organization?.id;
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
      organizationId, // Tenant isolation for socket events
    },
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
  });

  // Connection lifecycle handlers
  socket.on('connect', () => {
    console.info('[Socket] Connected to TaskFlow server:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error('[Socket] Connection error:', err.message);
    // If auth error, the token may be expired — don't keep retrying
    if (err.message?.includes('auth') || err.message?.includes('unauthorized')) {
      console.warn('[Socket] Auth failure — stopping reconnection');
      socket.disconnect();
    }
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Disconnected:', reason);
    if (reason === 'io server disconnect') {
      // Server intentionally disconnected — token may be invalid
      console.warn('[Socket] Server-initiated disconnect. Token may be expired.');
    }
  });

  socket.connect();
  return socket;
};

/**
 * Reconnect socket with a fresh token (after token refresh).
 */
export const reconnectSocket = (newToken) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return initiateSocketConnection(newToken);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.info('[Socket] Disconnected and cleaned up.');
  }
};

export const getSocket = () => socket;

// Realtime listeners wrappers
export const subscribeToTaskUpdates = (callback) => {
  if (!socket) return;
  socket.on('task_updated', (data) => {
    callback(data);
  });
};

export const subscribeToNotifications = (callback) => {
  if (!socket) return;
  socket.on('notification_received', (data) => {
    callback(data);
  });
};

export const emitTaskMoving = (taskId, newStatus, projectId) => {
  if (!socket) return;
  const state = store.getState();
  const organizationId = state.auth.organization?.id;
  socket.emit('task_move', { taskId, newStatus, projectId, organizationId });
};
