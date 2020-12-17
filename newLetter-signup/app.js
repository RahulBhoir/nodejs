// api key
// 293f5c82e14b5c2fe08ebf005897d1eb-us7
// list id 
// 05fea25d3f
const express = require('express');
const bodyParser = require('body-parser');
// const request = require('request');
const https = require('https');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// process.env.PORT --> dynamic port on heroku
app.listen(process.env.PORT || 3000,function(){
    console.log('the server is running');
});


app.get('/', function(req,res){
    res.sendFile(__dirname+'/signup.html');
    // res.send('hello world');
});

app.post('/',function(req,res){
    var firstName = req.body.firstName;
    var lastName = req.body.lasttName;
    var email = req.body.email;
    var data = {
        members:[
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : firstName,
                    LNAME : lastName,
                }
            }
        ]
    };
    console.log(data.members[0].merge_fields.LNAME);

    var jsonData = JSON.stringify(data);

    const url = 'https://us7.api.mailchimp.com/3.0/lists/05fea25d3f';
    const options = {
        method : "POST",
        auth : 'rahul:293f5c82e14b5c2fe08ebf005897d1eb-us7'
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }else{
            res.sendFile(__dirname+'/failure.html');
        }
        response.on('data',function(data){
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post('/failure',function(req,res){
    res.redirect('/');
});