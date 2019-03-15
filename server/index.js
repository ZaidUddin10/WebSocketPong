/* Constant Variable*/
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.set('view engine', 'ejs'); //Use ejs engine

app.get('/', (req, res) => {
    res.render('index', {rooms: users.getRoomList()});
});

app.use(express.static(publicPath)); //Use public dir using the publicpath variable

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

var players = {};

io.on('connection', (socket) => {

  socket.on('join', (params, cb) => {

    if (!isRealString(params.name) || !isRealString(params.room)) {
        return cb('Name and Room Name are required');
    }
    params.room = params.room.trim();
    params.name = params.name.trim();

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    console.log('Not Holy Stuff');

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    //socket.broadcast.to(params.room).emit('newMessassge', generateMessage('Admin', `${params.name} has joined!`));

    cb(); 
  });

  socket.on('foo', function(data){
    console.log(data);
  });

  socket.on('what', function(){});

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        console.log('disconnected to the server!');
    }
  });

  setInterval(function() {
    socket.emit('state', players);
  }, 1000 / 60);

});

