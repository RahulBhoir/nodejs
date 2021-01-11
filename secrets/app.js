// add this at the top of app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email: String,
    password:String
});


// process.env.VARIABLE_NAME  to access the env variable
// userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('user',userSchema);

app.listen(3000,function(req,res){
    console.log('server started at port 3000');
})

app.get('/', function(req,res){
    res.render('home');
});

//////////////////////////////////////////Login the user/////////////////////////////////////////////////

app.route('/login')

.get(function(req,res){
    res.render('login');
})

.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email:username},function(err,foundUser){
        if(!err){
            if(foundUser){
                if(foundUser.password === md5(password)){
                    res.render('secrets');
                }else{
                    res.send('invalid username or password');
                }
            }
        }else{
            res.render(err);
        }
    });
});

//////////////////////////////////////////Register the user/////////////////////////////////////////////////

app.route('/register')

.get(function(req,res){
    res.render('register');
})

.post(function(req,res){
    const user = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    user.save(function(err){
        if(!err){
            res.render('secrets');
        }else{
            res.send(err);
        }
    });
});
