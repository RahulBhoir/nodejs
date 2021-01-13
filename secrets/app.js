// add this at the top of app.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

///////////////////////////////////////authentication using passport///////////////////////////
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const { hash } = require('bcrypt');
const { authenticate } = require('passport');
const findOrCreate = require('mongoose-findorcreate');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));

app.use(session({
    secret: 'ourn little secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/userDB',{useNewUrlParser : true});
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    secret: String
});

// this is use to salt and hash our users password
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// process.env.VARIABLE_NAME  to access the env variable
// userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('user',userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

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
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    // login() method comes from passport
    req.login(user,function(err){
        if(!err){
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }else{
            console.log(err);
        }
    });
});

app.get('/logout',function(req, res){
    req.logout();
    res.redirect('/');
});

//////////////////////////////////////////Register the user/////////////////////////////////////////////////

app.route('/register')

.get(function(req,res){
    res.render('register');
})

.post(function(req,res){
    username = req.body.username;
    password = req.body.password;
    
    // register() is from passportLocalMongoose
    User.register({username: username}, password, function(err, user){
        if(!err){
            // (req, res, function(){}) this callback is only triggered when authentication is successfull 
            //  and a cookie is set successfully
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }
        else{
            console.log(err);
            res.redirect('/register');
        }
    });
});

/////////////////////////////////////////////////SECRETS page//////////////////////////////////////////
app.get('/secrets',function(req,res){
    if(req.isAuthenticated()){
        User.find({secret:{$ne:null}},function(err,foundUsers){
            if(foundUsers){
                res.render('secrets',{foundSecrets:foundUsers});
            }
        });
    }
    else{
        res.redirect('/login');
    }
});

//////////////////////////////////////////////login with google/////////////////////////////////////////////
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets', 
passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
// Successful authentication, redirect home.
res.redirect('/secrets');
});


//////////////////////////////////////////////login with facebook/////////////////////////////////////////////
app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


/////////////////////////////////////////////////Secret submit route//////////////////////////////////////////
app.route('/submit')

.get(function(req, res){
    if(req.isAuthenticated()){
        res.render('submit');
    }
    else{
        res.redirect('/login');
    }
})

.post(function(req, res){
    const submittedSecret = req.body.secret;
    console.log(submittedSecret)
    console.log(req.user.id);
    User.findById(req.user.id, function(err, foundUser){
        if(!err){
            console.log(foundUser);
            if(foundUser){
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect('/secrets')
                });
            }
            else{
                console.log(err);
            }
        }
    });
});