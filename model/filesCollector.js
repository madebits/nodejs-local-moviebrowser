var fsPath = require('path'),
    walk = require('walk'),
    configuration = require('./configuration');

function dirFiles(dir, cb) {
    var files = [];
    var walker = walk.walk(dir, { followLinks: false });
    walker.on('file', function(root, stat, next) {
        if(!stat.error) {
            var ext = fsPath.extname(stat.name);
            if(ext) {
                ext = ext.toLocaleLowerCase();
                if(configuration.fileSuffixes.indexOf(ext.substr(1)) >= 0) {
                    files.push(fsPath.join(root, stat.name));
                }
            }
        }
        next();
    });
    walker.on('end', function() {
        cb(null, files);
    });
}

function listFiles(dirsArray, cb) {
    dirsArray = dirsArray.filter(function (dir, idx, __this) {
        return __this.indexOf(dir) == idx;
    });
    __.concat(dirsArray, dirFiles, cb);
}

module.exports = listFiles;