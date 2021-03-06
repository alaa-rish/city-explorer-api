import axios from 'axios';
import Forecast from './Forecast.js';
import dotenv from 'dotenv';

dotenv.config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

export default function getWeather(request, response) {
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
}