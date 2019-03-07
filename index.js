/* Constant Variable*/
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {Users} = require('./utils/users');
const {isRealString} = require('./utils/validation');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/public');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var users = new Users();

app.set('view engine', 'ejs'); //Use ejs engine

app.get('/', (req, res) => {
    res.render('index', {rooms: users.getRoomList()});
});

app.use('/static', express.static(__dirname + '/static')); //Use static dir
app.use(express.static(publicPath)); //Use public dir using the publicpath variable

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

var players = {};

io.on('connection', function(socket) {

  socket.on('join', (params, cb) => {

    if (!isRealString(params.name) || !isRealString(params.room)) {
        return cb('Name and Room Name are required');
    }
    params.room = params.room.trim();
    params.name = params.name.trim();

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    console.log('Not Holy Fuck');

    //io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.to(params.room).emit('new player');
    //socket.broadcast.to(params.room).emit('newMessassge', generateMessage('Admin', `${params.name} has joined!`));

    cb(); 
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);