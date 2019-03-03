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

app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

io.on('connection', (socket) => {
    //console.log('client connected');
    console.log('New User')
    
}); 