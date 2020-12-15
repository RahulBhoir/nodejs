const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.listen(3000);


app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html');
});

app.post('/',function(req,res){
    // console.log(req.body.cityName);
    // res.send(req.body.cityName);
    var city = String(req.body.cityName);
    console.log(city);
    const apiKey = 'f01cc09e1a9a0c5b79c28fecc52d5497';
    const unit = 'metric';
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid="+apiKey;
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on('data',function(data){
            var weatherData = JSON.parse(data);
            console.log(weatherData);
            var temp = weatherData.main.temp;
            var description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            console.log(icon);
            var urlIcon = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
            console.log(urlIcon);
            res.write('<h1>the temprature in ' + city + ' is ' + temp + ' degree Celcius</h1>');
            res.write('<p>the weather is currently ' + description + '</p>');
            res.write('<img src=' + urlIcon + '>');
            res.send();
        });
    });
});


// app.post('/',function(req,res){
//     console.log('the server is running');
//     var city = String(req.body.cityName);
//     console.log(city);
//     res.send(req.body.cityName);
//     const apiKey = 'f01cc09e1a9a0c5b79c28fecc52d5497';
//     const unit = 'metric';
//     const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&appid="+apiKey;
//     https.get(url,function(response){
//         console.log(response.statusCode);
//         response.on('data',function(data){
//             var weatherData = JSON.parse(data);
//             console.log(weatherData);
//             var temp = weatherData.main.temp;
//             var description = weatherData.weather[0].description;
//             const icon = weatherData.weather[0].icon;
//             console.log(icon);
//             var urlIcon = 'http://openweathermap.org/img/wn/'+icon+'@2x.png';
//             console.log(urlIcon);
//             res.write('<h1>the temprature in India is ' + temp + ' degree Celcius</h1>');
//             res.write('<p>the weather is currently ' + description + '</p>');
//             res.write('<img src=' + urlIcon + '>');
//             res.send();
//         });
//     });
// });