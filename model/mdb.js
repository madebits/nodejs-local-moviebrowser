// replace your-api-key-here with your api key from https://www.themoviedb.org
var movieDb = require('moviedb')(process.env.TMDB_KEY);
module.exports = movieDb;
