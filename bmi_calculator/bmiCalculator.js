const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000);

app.get('/',function(req,res){
    res.sendFile(__dirname + '/index.html');
})

app.post('/',function(req,res){
    weight = Number(req.body.weight);
    height = Number(req.body.height);

    bmi = Math.floor(weight / (height*height));
    res.send('your bmi is '+ bmi);
})
