import { Server, Socket } from "socket.io";

const enum SocketConstants {
  NEW_MESSAGE = 'NEW_MESSAGE',
  USER_CONNECTS = 'subscribe',
  USER_DISCONNECTS = 'USER_DISCONNECTS',
  TYPING = 'TYPING',
  STOP_TYPING = 'STOP_TYPING'
};

interface IChatSocket extends Socket {
  username: string,
  numUsers: number
}

export const chatServer = (socketServer: Server) => {

  return socketServer.on('connection', (socket: IChatSocket) => {
    var addedUser = false;
    socket.on(SocketConstants.NEW_MESSAGE, (data: any) => 
      socket.broadcast.to(data.conversationId).emit(SocketConstants.NEW_MESSAGE, data));

    socket.on(SocketConstants.USER_CONNECTS, (conversation_id) => socket.join(conversation_id))

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (username) => {
      if (addedUser) return;

      // we store the username in the socket session for this client
      socket.username = username;
      socket.numUsers = socket.numUsers ? socket.numUsers : 0;
      addedUser = true;
      socket.emit('login', {
        numUsers: socket.numUsers
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: socket.numUsers
      });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on(SocketConstants.TYPING, () => {
      socket.broadcast.emit('typing', {
        username: socket.username
      });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on(SocketConstants.STOP_TYPING, () => {
      socket.broadcast.emit('stop typing', {
        username: socket.username
      });
    });

    // when the user disconnects.. perform this
    socket.on(SocketConstants.USER_DISCONNECTS, () => {
      if (addedUser) {
        --socket.numUsers;

        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: socket.numUsers
        });
      }
    });
  });
}
