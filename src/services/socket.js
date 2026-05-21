import { io } from 'socket.io-client';

let socket = null;

export const initiateSocketConnection = (token) => {
  if (socket) return socket;
  
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ['websocket'],
    autoConnect: false,
  });

  socket.connect();
  console.log('Connecting to TaskFlow WebSocket Server...');
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Disconnected TaskFlow WebSocket Server.');
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
  socket.emit('task_move', { taskId, newStatus, projectId });
};
