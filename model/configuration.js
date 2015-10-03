// change these as needed
// change also api key in mdb.js
module.exports = {
    //dirs: [ process.env.HOME + '/test1'],
    dirs: ['/media/extern/media/films', '/media/extern/media/tv'], // folders to scan for movies (recursive)
    fileSuffixes: ['avi', 'mpg', 'mpeg', 'mp4', 'wmv'], // files to consider in dirs (use lowercase)
    storePath: process.env.HOME + '/test1/.cache', // cache file, delete to refresh, folder must exist
    command: 'xdg-open', // works on linux, change for other platforms
    stringBlackList: ['full hd'], // heuristics to clean file names (use lowercase)
    tokenBlackList: ['720p', '720i', '1080p', '1080i',
        'dvdrip', 'bdrip',
        'pdtv', 'original', 'hdtv', 'hd', 'sd',
        'vo', 'vost', 'vc',
        'xvid', 'azfilma', 'mistreci', 'eng',
        'bluray', 'dts', 'x264']
};
