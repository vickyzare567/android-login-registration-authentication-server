var express = require('express');
var app = express();
var options = {transport: ['websocket']};
var  io  = require('socket.io')(options).listen(app.listen(3000, () => console.log('app listening on port 3000!')));

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var data="";
var firerecords;
var online_status_flag;
const saveMessage = require('./functions/saveMessage');


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
	setOnlineStatus((nick), function(resultof){
	});  
    	users.push(nick);
    	socket.nick=nick;
    	console.log(socket.nick);
    	idsnicks[nick]=socket.id;
    	io.emit('userlist', {hello: users});
  })

  socket.on('send', function  (usrdata) {
    console.log(usrdata);
    if (io.sockets.connected[idsnicks[usrdata.to_usr]]!==undefined) {
    	io.sockets.connected[idsnicks[usrdata.to_usr]].emit('sendmsg', {msg:usrdata.msg, from_usr:usrdata.from_usr});
	getFirebaseId((usrdata.to_usr),function(idtoken){
		var registrationToken = idtoken[0].firebase_id;
		console.log(" fid is : "+ registrationToken);
		// See documentation on defining a message payload.
		var message={  
			webpush : {
				notification: {
   			 	title: "Gossips",
   			 	body: usrdata.from_usr+ " : "+usrdata.msg,
			 	click_action : "OPEN_ACTIVITY_1"
    			 }
			},
     			data: {
    			score: usrdata.from_usr,
    			time: usrdata.msg
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
    }else{
	console.log((usrdata.from_usr) + " User Not Online.. " + (usrdata.to_usr));
	
	saveMessage.save(usrdata.from_usr,usrdata.to_usr,usrdata.msg)
	.then(result => {
		console.log(" "+result);
	})
	.catch(err => console.log(" "+ err));
	   
	getFirebaseId((usrdata.to_usr),function(idtoken){
		var registrationToken = idtoken[0].firebase_id;
		console.log(" fid is : "+ registrationToken);
		// See documentation on defining a message payload.
		var message={  
			webpush : {
				notification: {
   			 	title: "Gossips",
   			 	body: usrdata.from_usr+ " : "+usrdata.msg,
			 	click_action : "OPEN_ACTIVITY_1"
    			 }
			},
     			data: {
    			score: usrdata.from_usr,
    			time: usrdata.msg
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

socket.on('sendImage', function  (imageData) {
    console.log(imageData.from_user);
    if (io.sockets.connected[idsnicks[imageData.to_usr]]!==undefined) {
		 	//var img = new Image();
			//img.src = 'data:image/jpeg;base64,' + imageData.buffer;
			//ctx.drawImage(img, 0, 0);
			 console.log("Emmiting now ... ");
			io.sockets.connected[idsnicks[imageData.to_usr]].emit('ImageMessage', { image: true, from_user: imageData.from_user, to_user: imageData.to_user, buffer: imageData.bufffer });
    }else{
	
	}
  })
	
  socket.on('disconnect', function () {
	console.log("User gone Offline : "+ socket.nick);
     	setOfflineStatus((socket.nick), function(resultof){
	});
     	users.splice( users.indexOf(socket.nick), 1 );
     	delete idsnicks[socket.nick];
    	io.emit('discon', {usr:socket.nick, list:users});

      	});

  });

function getFirebaseId(email,callback){
	MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("node-login");	
        dbo.collection("users").find({email:email},{'firebase_id' : true,'email':true}).toArray(function(err, result) {
        if (err){ throw err; console.log(err); }
            firerecords=result;
        	callback(firerecords);
	     	db.close();
	});
    });
}

function setOnlineStatus(email,callback){
		
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  		var dbo = db.db("node-login");
  		var myquery = { email : email };
  		var newvalues = { $set: {online_status:"ONLINE" } };
  		dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
    			if (err) throw err;
			online_status_flag = res;
    			console.log("Status Updated Successfully");
			callback(online_status_flag);
    			db.close();
  		});
	});	
}

function setOfflineStatus(email,callback){
		
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  		var dbo = db.db("node-login");
  		var myquery = { email : email };
  		var newvalues = { $set: {online_status:"OFFLINE" } };
  		dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
    			if (err) throw err;
			online_status_flag = res;
    			console.log("Status Updated Successfully");
			callback(online_status_flag);
    			db.close();
  		});
	});	
}


