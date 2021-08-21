import axios from 'axios';
import express from 'express';
import cors from 'cors';
import Forecast from './Forecast.js';
import dotenv from 'dotenv';
import Movie from './Movie.js';

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

server.get('/movies', (request, response) => {
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=en-US&query=${request.query.searchQuery}`).then(res => {
    let length = 20;
    if (length > res.data.results.length)
      length = res.data.results.length;
      console.log(res.data);
    let arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(new Movie(
        res.data.results[i].title,
        res.data.results[i].overview,
        res.data.results[i].vote_average,
        res.data.results[i].vote_count,
        'https://image.tmdb.org/t/p/original/' + res.data.results[i].poster_path,
        res.data.results[i].popularity,
        res.data.results[i].release_date
        ));
    }
    response.send(arr);
  }).catch(err =>  {
    response.status(500);  
    response.send('Error: no movie found!');
  })
});

server.get('/weather', (request, response) =>  {
    let lat = request.query.lat;
    let lon = request.query.lon;
    axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`).then(res => {
      if (res === undefined || res === null || res.length === 0) {
        response.status(500);  
        response.send('Error: no city found!');
    } else {
        let data = [];
        console.log('>>>>> ' + `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`);
        console.log(res.data);
        res.data.data.forEach(cityData => {
            data.push(new Forecast(cityData.weather.description, cityData.datetime));
        });
        response.send(data);
    }
    }).catch(err =>  {
      response.status(500);  
      response.send('Error: no city found!');
    });
});

server.get('/test', (request, response) =>  {
    response.send('Your server is working');
});

server.listen(PORT, () =>  {
    console.log(`Listening on PORT ${PORT}`);
});