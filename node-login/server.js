var express = require('express');
var app = express();
var options = {transport: ['websocket']};
var  io  = require('socket.io')(options).listen(app.listen(process.env.PORT || 3000));


app.get('/', function(req, res){
     res.sendfile('index.html');
    });

 app.use(express.static(__dirname + '/'));

var users=[];
var idsnicks={};
io.on('connection', function (socket) {

  socket.on('login', function  (nick) {
    users.push(nick);
    socket.nick=nick;
    idsnicks[nick]=socket.id;
    io.emit('userlist', {hello: users});
  })

  socket.on('send', function  (data) {
    if (io.sockets.connected[idsnicks[data.usr]]!==undefined) {
    io.sockets.connected[idsnicks[data.usr]].emit('sendmsg', {msg:data.msg, usr:socket.nick});
   }
  })

  socket.on('startchat', function  (data) {
  if (io.sockets.connected[idsnicks[data]]!==undefined) {
    io.sockets.connected[idsnicks[data]].emit('openchat', socket.nick);
  }
  })

  socket.on('disconnect', function () {
      console.log('disc');
     users.splice( users.indexOf(socket.nick), 1 );
     delete idsnicks[socket.nick];
    io.emit('discon', {usr:socket.nick, list:users});


      });

  });
