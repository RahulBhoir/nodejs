const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var newItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.listen(3000,function(){
    console.log('server is running...');
});

app.get('/',function(req,res){
    var today = new Date();; 
    var options = {
        day:'numeric',
        weekday: 'short',
        month: 'long'
    };
    var day = today.toLocaleString('en-IN',options);
    var dict = {
        day:day,
        newItems:newItems,
    };
    res.render('list',dict);
});

app.post('/',function(req,res){
    newItems.push(req.body.addItem);
    res.redirect('/');
});