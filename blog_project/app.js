const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var blogList = [];

const app = express();
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(3000,function(){
    console.log('server is running...');
});

app.get('/',function(req,res){
    res.render('home',{blogList:blogList});
});

app.get('/create',function(req,res){
    res.render('create_post');
});

app.post('/',function(req,res){
    let title = req.body.blogTitle;
    let description = req.body.blogDescription
    blogList.push([title, description]);
    res.redirect('/');
});

app.get('/about',function(req, res){
    res.render('about');
});

app.get('/contact',function(req, res){
    res.render('contact');
});

app.get('/post/:postId',function(req, res){
    let id = req.params.postId;
    res.render('post',{post:blogList[id]});
});