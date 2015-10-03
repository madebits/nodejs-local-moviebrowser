var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('app');
});

router.get('/view', function(req, res) {
    var partial = req.query.name;
    if(!partial || partial[0] === '.' || partial[0] === '/') {
        throw new Error('bad partial');
    }
    res.render('partials/' + partial);
});

module.exports = router;
