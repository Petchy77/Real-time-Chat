// index.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('User disconnected');
    if (users[socket.id]) {
      io.emit('chat message', { username: 'System', message: `${users[socket.id]} has left the chat` });
      delete users[socket.id];
    }
  });

  socket.on('login', (username) => {
    users[socket.id] = username;
    io.emit('chat message', { username: 'System', message: `${username} has joined the chat` });
  });

  socket.on('chat message', (message) => {
    io.emit('chat message', { username: users[socket.id], message });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
