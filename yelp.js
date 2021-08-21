import axios from 'axios';
import dotenv from 'dotenv';
import Resturant from './resturant.js';

dotenv.config();

const YELP_API_KEY=process.env.YELP_API_KEY;

let memoryCache = {};

export default function getResturants (request, response) {
    if (memoryCache[request.query.searchQuery] !== undefined && memoryCache[request.query.searchQuery] !== null) {
        response.send(memoryCache[request.query.searchQuery]);
    } else {
        axios.get(`https://api.yelp.com/v3/businesses/search?location=${request.query.searchQuery}`, {headers: {Authorization: `Bearer ${YELP_API_KEY}`}}).then(res => {
        if (res.data.error) {
          response.send('Error: no resturant found!');
        } else {
        let arr = [];
        res.data.businesses.forEach(rest => {
          arr.push(new Resturant(
            rest.name,
            rest.image_url,
            rest.price,
            rest.rating,
            rest.url));
        });
        memoryCache[request.query.searchQuery] = arr;
        response.send(arr);
      }
    }).catch(err =>  {
      response.status(500);  
      response.send('Error: no resturant found!');
    });
  }
}