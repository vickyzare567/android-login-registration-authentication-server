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

var admin = require("firebase-admin");

var serviceAccount = require("./config/chatapp-3ed5e-firebase-adminsdk-uzpjg-bd25a8276c.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatapp-3ed5e.firebaseio.com"
});


io.on('connection', function (socket) {

  socket.on('login', function  (nick) {
    users.push(nick);
    socket.nick=nick;
    console.log(socket.nick);
    idsnicks[nick]=socket.id;
    io.emit('userlist', {hello: users});
  })

  socket.on('send', function  (usrdata) {
    console.log(usrdata);
    if (io.sockets.connected[idsnicks[usrdata.usr]]!==undefined) {
    io.sockets.connected[idsnicks[usrdata.usr]].emit('sendmsg', {msg:usrdata.msg, usr:socket.nick});
   }else{
	console.log(" User Not Online.. " + (usrdata.usr));
	// var fid = getFirebaseId(idsnicks[data.usr]);
	getFirebaseId((usrdata.usr),function(idtoken){
		
		var registrationToken = idtoken[0].fid;
		
		console.log(" fid is : "+ registrationToken);
		
		// See documentation on defining a message payload.
		var message={       
    			notification: {
   			 title: usrdata.usr+" : "+usrdata.msg,
   			 body: " "
    			 },
     			   data: {
    			score: '850',
    			time: '2:45'
     			},
			token: registrationToken
		};
		// Send a message to the device corresponding to the provided
		// registration token.
		admin.messaging().send(message)
		  .then((response) => {
  		  // Response is a message ID string.
  		  console.log('Successfully sent message:', response);
  		})
  		.catch((error) => {
  		  console.log('Error sending message:', error);
 		 });
	

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
        dbo.collection("user").find({email:email},{'firebase_id' : true,'email':true}).toArray(function(err, result) {
        if (err){ throw err; console.log(err); }
            firerecords=result;
        callback(firerecords);
	     db.close();
	});
    });
    // console.log('sending return ',firerecords);
	// return firerecords;
}
