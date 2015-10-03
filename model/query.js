var mdb = require('./mdb'),
    Distance = require('levenshtein');

function queryForMovie(movie, cb) {
    var query = {query: movie.queryData.name, page: '1' };
    if(movie.queryData.year) {
        query.year = movie.queryData.year;
    }
    __.waterfall([
        function(__cb) {
            mdb.searchMovie(query, function(err, data) {
                if (err) cb(err, movie);
                if (data && data.results) {
                    var movieData = matchMovie(data.results, movie.queryData);
                    if (movieData) {
                        movie.hasData = true;
                        movie.id = movieData.id;
                        movie.title = movieData.title;
                        movie.posterPath = movieData.poster_path;
                        movie.vote = movieData.vote_average;
                        movie.voteCount = movieData.vote_count;
                        movie.releaseDate = movieData.release_date;
                        if(movie.releaseDate) movie.year = movie.releaseDate.substr(0, 4);
                    }
                    else {
                        movie.title = movie.queryData.name;
                        movie.year = movie.queryData.year;
                        movie.overview = 'Not found!';
                        if(!movie.year) movie.year = '????'
                    }
                }
                __cb(null, movie);
            });
        },
        function(movie, __cb) {
            if(movie.hasData) {
                mdb.movieInfo({id: movie.id}, function(err, res) {
                    if(!err && res){
                        movie.overview = res.overview;
                        movie.runTime = res.runtime;
                    }
                    __cb(null, movie);
                });
            }
            else {
                process.nextTick(function () {
                    __cb(null, movie);
                });
            }
        }
    ], cb);
}

function matchMovie(foundMovies, queryData) {
    if(!foundMovies) return null;

    var nameMatchIdx = -1;
    var nameMatchDistance = Number.MAX_VALUE;

    foundMovies.forEach(function(movie, i) {
        var ld = new Distance(movie.title.toLowerCase(), queryData.name);
        if((nameMatchIdx < 0) || (ld.distance < nameMatchDistance)) {
            nameMatchDistance = ld;
            nameMatchIdx = i;
        }
    });

    return (nameMatchIdx < 0) ? null : foundMovies[nameMatchIdx];
}

function getConfig(cb) {
    mdb.configuration(function(err, data) {
        var res = {};
        if(!err) {
            var idx = data.images.poster_sizes.indexOf('w92'); //w154
            if(idx < 0) idx = 0;
            res.url = data.images.secure_base_url + data.images.poster_sizes[idx];
        }
        cb(err, res);
    });
}

module.exports = { movie: queryForMovie, config: getConfig };