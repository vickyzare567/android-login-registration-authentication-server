var express = require('express');
var app = express();
var options = {transport: ['websocket']};
var  io  = require('socket.io')(options).listen(app.listen(3000, () => console.log('app listening on port 3000!')));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var data="";
var firerecords;

app.use(express.static(__dirname + '/public'));

app.get('/',function(req,res){
       
    res.sendFile('index.html');

});

var users=[];
var idsnicks={};

// connectDb();

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
	console.log(" User Not Online.. " + idsnicks[data.usr]);
	// var fid = getFirebaseId(idsnicks[data.usr]);
	getFirebaseId((idsnicks[data.usr]),function(data){
        var fid = data;
            console.log("data here :- ",fid);
    });
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

function getFirebaseId(email,callback){
	MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("node-login");	
        // console.log('Email :- ',email);
        // ,{'fid' : true,'email':true}
        dbo.collection("firebases").find({email:email},{'fid' : true,'email':true}).toArray(function(err, result) {
        if (err){ throw err; console.log(err); }
            firerecords=JSON.stringify(result);
        callback(firerecords);
	     db.close();
	});
    });
    // console.log('sending return ',firerecords);
	// return firerecords;
}
