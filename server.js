'use strict';

const express = require('express');

const server = express();

const PORT = 3001;

const cors = require("cors");
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
server.use(cors(corsOpts));

const weather = require("./data/weather");
const Forecast = require('./Forecast');

server.get('/weather', (request, response) =>  {
    let lat = request.query.lat;
    let lon = request.query.lon;
    let searchQuery = request.query.searchQuery;
    let res = weather.find(city => lat.startsWith(city.lat + '') && lon.startsWith(city.lon + '') && searchQuery.toLowerCase().includes(city.city_name.toLowerCase()));
    if (res === undefined || res === null || res.length === 0)
      response.send('Error: no city found!');
    else {
        let data = [];
        res.data.forEach(cityData => {
            data.push(new Forecast(cityData.weather.description, cityData.valid_date));
        });
        response.send(data);
    }
    
});

server.get('/test', (request, response) =>  {
    response.send('Your server is working');
});

server.listen(PORT, () =>  {
    console.log(`Listening on PORT ${PORT}`);
});