'use strict';

const express    = require('express');        
const app        = express();                
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	     = process.env.PORT || 8080;
const fileUpload = require('express-fileupload');
const imageapp   = express();
const imageport  = process.env.PORT || 7769;

app.use(bodyParser.json());
app.use(logger('dev'));

imageapp.use(fileUpload());

require('./routes')(router);
app.use('/api/v1', router);

app.listen(port);

console.log(`App Runs on ${port}`);

imageapp.post('/imageupload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  let samplefilename = req.files.my_profile_pic.name;
   // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/root/.UserImages/'+samplefilename'.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});


imageapp.listen(imageport);

console.log("The Image Upload Server Running On : "+imageport);
