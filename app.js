const express = require('express');
const path = require('path');
const https = require('https');

const bodyParser = require('body-parser');

const app  = express();

app.use(bodyParser.urlencoded({extended:true}));

const port = 3000;

app.post("/", function(req,res){

    const cityName = req.body.name;

    const src = "https://api.openweathermap.org/data/2.5/weather?";
    const apiKey = "16cf97192fca85d62e3d91d1ec8d0002";
    const unit = "metric";

    const url = src + `q=${cityName}&units=${unit}&appid=${apiKey}`;
    
    https.get(url, function(response){

        let data = '';

        // A chunk of data has been received.
        response.on('data', function(chunk) {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', function() {
            const weatherData = JSON.parse(data);
            if (weatherData.main && weatherData.main.temp) {
                const temperature = weatherData.main.temp;
                res.send(`Temperature in ${cityName} : ${temperature}°C`);
            } else {
                res.send("Error: Could not get temperature.");
            }
        });
    });
});

app.get("/", function(req, res){
    const url = path.join(__dirname , 'index.html');
    res.sendFile(url);
});

app.listen(port , function(){
    console.log(`${port} : Listening...`);
});
