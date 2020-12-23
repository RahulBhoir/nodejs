const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
const app = express();

var newItems = [];
var workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(3000,function(){
    console.log('server is running...');
});

app.get('/',function(req,res){
    day = date.getDay();
    let dict = {
        listTitle:day,
        newItems:newItems,
    };
    res.render('list',dict);
});

app.post('/',function(req,res){
    let item = req.body.addItem;
    let listName = req.body.list;
    if(listName === 'Work List'){
        workItems.push(item);
        res.redirect('/work');
    }
    else{
        newItems.push(item);
        res.redirect('/');
    }
});

app.get('/work',function(req,res){
    let dictWork = {
        listTitle:'Work List',
        newItems:workItems}
    res.render('list',dictWork);
});

app.get('/about',function(req,res){
    res.render('about');
});