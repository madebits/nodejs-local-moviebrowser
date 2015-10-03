var gl = require('../globals'),
    assert = require('assert'),
    proxyquire =  require('proxyquire').noCallThru(),
    requireFrom = require('require-from'),
    sinon = require('sinon'),
    configuration = require('../model/configuration'),
    fs = require('fs'),
    util = require('util'),
    dsTest = requireFrom('testExports', '../model/ds');

describe(':: configuration', function() {

    it(':: has dirs', function() {
        assert.ok(configuration.hasOwnProperty('dirs'), 'not present');
        assert.ok(util.isArray(configuration.dirs), 'not an array');
        assert.ok(configuration.dirs.length > 0, 'empty');
    });

    it(':: has valid dirs', function(done) {
        //configuration.dirs.push('/sdgdsgsdg');
        var count = 0;
        configuration.dirs.forEach(function(dir) {
            fs.stat(dir, function(err, stats) {
                if(err) done(err);
                assert.ok(stats.isDirectory(), 'not a dir ' + dir);
                if(++count == configuration.dirs.length) {
                    done();
                }
            });
        });
    });

});

describe(':: db', function() {
    it(':: parse file name', function() {
        assert.ok(dsTest.fileToMovieName != null, 'fileToMovieName');
        var res = dsTest.fileToMovieName('Frozen.2013..Full HD.mp4');
        assert.equal(res.name, 'frozen');
        assert.equal(res.year, '2013');
    });
});

describe(':: filesCollection', function() {
    var fc = null;

    beforeEach(function() {
        fc = proxyquire('../model/filesCollector', { walk: {
            walk: function() {
                return {
                    on: function(event, cb) {
                        switch (event) {
                            case 'end':
                                cb();
                                break;
                        }
                    }
                };
            }
        } });
    });

    it(':: callback called', function() {
        var callback = sinon.spy();
        fc(['foo'], callback);
        assert.ok(callback.called);
    });
});