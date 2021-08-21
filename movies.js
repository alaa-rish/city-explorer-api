import axios from 'axios';
import dotenv from 'dotenv';
import Movie from './Movie.js';

dotenv.config();

const MOVIE_API_KEY=process.env.MOVIE_API_KEY;

let memoryCache = {};

export default function getMovies (request, response) {
    if (memoryCache[request.query.searchQuery] !== undefined && memoryCache[request.query.searchQuery] !== null) {
        response.send(memoryCache[request.query.searchQuery]);
    } else {
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
        memoryCache[request.query.searchQuery] = arr;
        response.send(arr);
    }).catch(err =>  {
      response.status(500);  
      response.send('Error: no movie found!');
    });
  }
}