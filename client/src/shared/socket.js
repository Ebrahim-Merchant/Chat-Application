import io from 'socket.io-client';
const socket = io();

export const subscribe = (id) => {
  socket.emit('subscribe', id);
}

export const messageReceived = (onMessageReceived) => {
  socket.on('NEW_MESSAGE', onMessageReceived);
}


export const sendMessage = (message) => {
  socket.emit('NEW_MESSAGE', message)
}