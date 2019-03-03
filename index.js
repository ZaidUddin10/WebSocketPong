const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/public');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var users = new Users();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {rooms: users.getRoomList()});
});

app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
});
setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);