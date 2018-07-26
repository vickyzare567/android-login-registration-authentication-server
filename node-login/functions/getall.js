const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var data="";
var records;


MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("node-login");
        dbo.collection("users").find({},{'name' : true, 'email':true, 'mobile':true}).toArray(function(err, result) {
        if (err) throw err;
            records=JSON.stringify(result);
            db.close();
		});
});

app.get('/', (req, res) => {
   
	console.log(records);
	res.send(records);
});


app.listen(7769, () => {
    console.log("Server is listening on port 7769");
});
