import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const joinRoom = (chatId) => {
  if (socket) {
    socket.emit('join_chat', chatId);
  }
};

export const sendMessage = (chatId, text) => {
  if (socket) {
    socket.emit('send_message', { chatId, text });
  }
};

export const onNewMessage = (callback) => {
  if (socket) {
    socket.on('new_message', callback);
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.off('new_message');
    socket.disconnect();
    socket = null;
  }
};
