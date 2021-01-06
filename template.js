const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


const app = express();
app.use('view engine', 'ejs')
app.use(express.static('public'));
mongoose.connect('mongodb://localhost:27107/dbName',{useNewUrlParser:true});



app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000,function(){
    console.log('server is running...');
});
