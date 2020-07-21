const SOCKET_EVENTS = {
  NEW_MESSAGE: 'NEW_MESSAGE',
  USER_CONNECTS: 'USER_CONNECTS',
  USER_DISCONNECTS: 'USER_DISCONNECTS',
  TYPING: 'TYPING',
  STOP_TYPING: 'STOP_TYPING'
};

export default class ChatSocket {

  constructor(socket) {
    this.socket = socket;
  }

  connect() {
    this.socket.on('connection', (socket) => {
      var addedUser = false;
      socket.on(SOCKET_EVENTS.NEW_MESSAGE, (data) => {
        // we tell the client to execute 'new message'
        socket.broadcast.to(data.conversationId).emit(SOCKET_EVENTS.NEW_MESSAGE, data);
      });
    
      socket.on('subscribe', function(conversation_id) { 
        socket.join(conversation_id); 
    })
    
      // when the client emits 'add user', this listens and executes
      socket.on('add user', (username) => {
        if (addedUser) return;
    
        // we store the username in the socket session for this client
        socket.username = username;
        addedUser = true;
        socket.emit('login', {
          numUsers: numUsers
        });
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('user joined', {
          username: socket.username,
          numUsers: numUsers
        });
      });
    
      // when the client emits 'typing', we broadcast it to others
      socket.on(SOCKET_EVENTS.TYPING, () => {
        socket.broadcast.emit('typing', {
          username: socket.username
        });
      });
    
      // when the client emits 'stop typing', we broadcast it to others
      socket.on(SOCKET_EVENTS.STOP_TYPING, () => {
        socket.broadcast.emit('stop typing', {
          username: socket.username
        });
      });
    
      // when the user disconnects.. perform this
      socket.on(SOCKET_EVENTS.USER_DISCONNECTS, () => {
        if (addedUser) {
          --numUsers;
    
          // echo globally that this client has left
          socket.broadcast.emit('user left', {
            username: socket.username,
            numUsers: numUsers
          });
        }
      });
    });
  }
  
}
