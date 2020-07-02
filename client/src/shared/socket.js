import io from 'socket.io-client';
const socket = io("http://localhost:3001");

export const subscribe = (id) => {
  socket.emit('subscribe', id);
}

export const messageReceived = (onMessageReceived) => {
  socket.on('NEW_MESSAGE', onMessageReceived);
}


export const sendMessage = (message) => {
  socket.emit('NEW_MESSAGE', message)
}