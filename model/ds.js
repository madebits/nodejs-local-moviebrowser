var fsPath = require('path'),
    filesCollector = require('./filesCollector'),
    query = require('./query'),
    configuration = require('./configuration'),
    nstore = require('nstore'),
    crypto = require('crypto'),
    exec = require('child_process').exec;


function fileToMovieName(path) {
    var year = null;
    var name = fsPath.basename(path, fsPath.extname(path)).toLowerCase();
    var parts = name.split(/[^A-Za-z0-9]/).filter(function(x) {
        return !!x;
    });

    for(var i = 0; i < parts.length; i++) {
        if(parts[i].match(/^\d{4}$/)) {
            year = parts[i];
            parts = parts.slice(0, i);
            break;
        }
    }

    name = parts.join(' ');
    configuration.stringBlackList.forEach(function(x) {
        name = name.replace(x, '');
    });

    parts = name.split(' ').filter(function(x) {
        return !!x;
    });

    configuration.tokenBlackList.forEach(function(x) {
        var idx = parts.indexOf(x);
        if (idx > -1) {
            parts.splice(idx, 1);
        }
    });

    if(!year && parts[parts.length - 1].match(/^\d{4}$/)) {
        year = parts.pop();
    }

    name = parts.join(' ');
    return { name: name, year: year };
}

function hash(filePath) {
    var secret = '10cb5fb02a0e11e48c210800200c9a66';
    var hasher = crypto.createHash('sha1');
    hasher.update(filePath + secret);
    return hasher.digest('hex');
}

function toMovies(files, onlyHash) {
    if(!files) return null;
    files.sort();
    return files.map(function(x) {
        return {
          path: x,
          hash: hash(x),
          fileName: onlyHash ? null : fsPath.basename(x),
          queryData: onlyHash ? null: fileToMovieName(x)
        };
    });
}

function resolveMovie(store, movie, cb) {
    __.waterfall([
        function(__cb) {
            var storeData = { store: store };
            store.get(movie.path, function(err, data, key) {
                storeData.movie = err ? null: data;
                storeData.cached = !!storeData.movie;
                __cb(null, storeData);
            });
        },
        function(storeData, __cb) {
            if(storeData.movie) {
                process.nextTick(function () {
                    __cb(null, storeData);
                });
            }
            else {
                query.movie(movie, function(err, movieData) {
                    storeData.movie = movieData;
                    __cb(err, storeData);
                });
            }
        },
        function(storeData, __cb) {
            if(!storeData.cached) {
                storeData.store.save(storeData.movie.path, storeData.movie, function(err) {
                    if(err) console.error("nstore:save" + err);
                    __cb(null, storeData.movie);
                });
            }
            else {
                process.nextTick(function () {
                    __cb(null, storeData.movie);
                });
            }
        }
    ], cb);
}

function resolveMovies(movies, cb) {
    __.waterfall([
        function(__cb) {
            nstore.new(configuration.storePath, function(err, store) {
                __cb(null, store);
            });
        },
        function(store, __cb) {
            __.mapLimit(movies, 5, function (movie, __cb) {
                if(store) {
                    resolveMovie(store, movie, __cb);
                } else {
                    query.movie(movie, __cb);
                }
            }, __cb);
        }], cb);
}

function processFolders(dirsArray, cb) {
    if(!dirsArray) {
        dirsArray = configuration.dirs;
    }
    __.waterfall([
        function(__cb) {
            filesCollector(dirsArray, __cb);
        },
        function(files, __cb) {
            process.nextTick(function () {
                __cb(null, toMovies(files));
            });
        },
        function(movies, __cb) {
            resolveMovies(movies, __cb)
        },
        function(movies, __cb) {
            query.config(function(err, config) {
               __cb(err, { config: config, movies: movies });
            });
        }
    ], cb);
}

function runFileByHash(fileHash, dirsArray, cb) {
    if(!fileHash) {
        process.nextTick(function () {
            cb(new Error('not found'), null, null);
        });
        return;
    }
    if (!dirsArray) {
        dirsArray = configuration.dirs;
    }
    __.waterfall([
        function (__cb) {
            filesCollector(dirsArray, __cb);
        },
        function (files, __cb) {
            process.nextTick(function () {
                __cb(null, toMovies(files, true));
            });
        }
    ], function (err, movies) {
        var found = false;
        movies.forEach(function(movie) {
            if(movie.hash == fileHash) {
                found = true;
                var cmd = configuration.command + ' "' + movie.path + '"';
                exec(cmd, function(err, stdout, stderr){
                    cb(err, stdout, stderr);
                });
                return false;
            }
            return true;
        });
        if(!found) {
            process.nextTick(function () {
                cb(new Error('not found'), null, null);
            });
        }
    });
}

function launchBrowser(port) {
    var cmd = configuration.command + ' "http://127.0.0.1:' + port + '"';
    exec(cmd, function(err, stdout, stderr){
        if(err) console.error(err);
    });
}

module.exports = { processFolders: processFolders, runFileByHash: runFileByHash, launchBrowser: launchBrowser };
module.testExports = { fileToMovieName: fileToMovieName };