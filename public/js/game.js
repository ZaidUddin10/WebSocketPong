var socket = io();

function joinGame () {
  var params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    console.log("Holy Stuff");
      if (err) {
          alert(err);
          window.location.href = '/';
      } else {
          console.log('no error!');
      }
  });
}

socket.emit('foo', 'Hello World!');

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.emit('what', function () {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
});

socket.on('disconnect', function () {
  console.log('disconnected to the server!');
});

  var movement = {
    up: false,
    down: false,
    left: false,
    right: false
  }
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = true;
        break;
      case 87: // W
        movement.up = true;
        break;
      case 68: // D
        movement.right = true;
        break;
      case 83: // S
        movement.down = true;
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = false;
        break;
      case 87: // W
        movement.up = false;
        break;
      case 68: // D
        movement.right = false;
        break;
      case 83: // S
        movement.down = false;
        break;
    }
  });

  /* When a user connects, set their x,y coordinates at 300,300. */
  socket.on('new player', function() {
    console.log("Holy Fuck");
    players[socket.id] = {
      x: 300,
      y: 300
    };
  });

  /* */
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

  socket.on('updateUserList', function (users) {
    console.log("Hi!");
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
  });

  setInterval(function() {
    socket.emit('movement', movement);
  }, 1000 / 60);

/*var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  context.clearRect(0, 0, 800, 600);
  context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fill();
  }
});*/