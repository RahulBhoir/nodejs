const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000);


app.get('/', function(req,res){
    res.sendFile(__dirname+'/signup.html');
    // res.send('hello world');
});

app.post('/',function(req,res){
    var firstName = req.body.firstName;
    var lastName = req.body.firstName;
    var email = req.body.email;
});