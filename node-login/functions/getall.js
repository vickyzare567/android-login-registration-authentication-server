const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/node-login";
var data;

app.get('/', (req, res) => {
   
              MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("node-login");
              dbo.collection("users").find({}).toArray(function(err, result) {
                if (err) throw err;
                 data=result;
                console.log(result);
                db.close();
              });
            });
      console.log(data);
  res.json({"message":data});
});





app.listen(7769, () => {
    console.log("Server is listening on port 7769");
});
