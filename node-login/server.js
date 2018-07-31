var express = require('express');
var app = express();
var options = {transport: ['websocket']};
var  io  = require('socket.io')(options).listen(app.listen(process.env.PORT || 3000));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var data="";
var firerecords;


app.use(express.static(__dirname + '/public'));

var users=[];
var idsnicks={};
io.on('connection', function (socket) {

  socket.on('login', function  (nick) {
    users.push(nick);
    socket.nick=nick;
    console.log(socket.nick);
    idsnicks[nick]=socket.id;
    io.emit('userlist', {hello: users});
  })

  socket.on('send', function  (data) {
    console.log(data);
    if (io.sockets.connected[idsnicks[data.usr]]!==undefined) {
    io.sockets.connected[idsnicks[data.usr]].emit('sendmsg', {msg:data.msg, usr:socket.nick});
   }else{
    
	console.log(" User Not Online.. ");
	var fid= getFirebaseId(idsnicks[data.usr]);	
	console.log(fid);
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

function getFirebaseId(email){
	MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("node-login");
        dbo.collection("firebases").find({email : email},{'fid' : true, 'did':true, 'email':true}).toArray(function(err, result) {
        if (err) throw err;
            firerecords=JSON.stringify(result);
	    console.log(firerecords);
            db.close();
		});
	});
	return firerecords;
}
