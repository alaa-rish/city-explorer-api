import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import getWeather from './weather.js';
import getMovies from './movies.js';
import getResturants from './yelp.js';

dotenv.config();

const server = express();

const PORT = process.env.PORT;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

const MOVIE_API_KEY=process.env.MOVIE_API_KEY;

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

server.get('/weather', getWeather);

server.get('/movies', getMovies);

server.get('/yelp', getResturants);

server.get('/test', (request, response) =>  {
    response.send('Your server is working');
});

server.listen(PORT, () =>  {
    console.log(`Listening on PORT ${PORT}`);
});