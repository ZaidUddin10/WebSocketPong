const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {rooms: users.getRoomList()});
});

app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

io.on('connection', (socket) => {
    console.log('New User Connected!');

    /*socket.on('join', (params, cb) => {

        if (!isRealString(params.name) || !isRealString(params.room)) {
            return cb('Name and Room Name are required');
        }
        params.room = params.room.trim();
        params.name = params.name.trim();

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);


        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined!`));

        cb();
    });*/
});