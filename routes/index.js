var express = require('express'),
    router = express.Router(),
    ds = require('../model/ds'),
    queryString = require('querystring');

//var testDs = null;
//module.children.some(function(it){
//    if(it.exports === ds) {
//        testDs = it['testExports'];
//        console.log(testDs);
//    }
//});

router.get('/', function(req, res) {
    ds.processFolders(null, function(err, moviesData){
        if(err || !moviesData || !moviesData.movies) {
            if(!err) err = new Error('Failed to get movies!');
            res.render('error', {
                message: 'Failed to get movies!',
                error: err
            });
            return;
        }
        postProcessMovies(moviesData);
        if(req.query.json) {
            res.json(moviesData);
        }
        else {
            res.render('index', { data: moviesData });
        }
    });
});

function postProcessMovies(data) {
    data.cols = 3;
    data.rows = Math.floor(data.movies.length / data.cols);
    if(data.movies.length % data.cols != 0) data.rows++;
    data.at = function(row, col) {
        return data.movies[row * data.cols + col];
    };
    data.movies.map(function(x, idx){
        x.index = idx;
        x.url = '/launch?' + queryString.stringify({ path: x.hash });
        x.poster = x.posterPath ? data.config.url + x.posterPath : '/images/error.png';
        if(!x.year) x.year = '????';
        if(!x.runTime) x.runTime = '?';
        if(!x.vote) x.vote = '?';
    });
}

router.get('/launch', function(req, res) {
    if(req.connection.remoteAddress != '127.0.0.1') {
        //throw new Error('bad address');
        process.exit(1);
    }
    var fileHash = req.query.path;
    ds.runFileByHash(fileHash, null, function (err) {
        var data = { error: err };
        res.json(data);
    });
});

router.get('/close', function(req, res) {
    console.log('Closed');
    process.exit(1);
    res.json({ done: 'done' });
});

module.exports = router;
