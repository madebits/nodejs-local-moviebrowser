.pragma library

var URL_ROOT = "http://127.0.0.1:3000";

function init(appendItemCb) {
    var doc = new XMLHttpRequest();
    doc.onreadystatechange = function() {
        if (doc.readyState === XMLHttpRequest.DONE) {
            var a = doc.responseText;
            var d = JSON.parse(a);
            for(var i = 0; i < d.movies.length; i++) {
                var m = d.movies[i];
                if(m.poster[0] === "/") m.poster = URL_ROOT + m.poster;
                appendItemCb(m);
            }
        }
    }
    doc.open("GET", URL_ROOT + "/?json=1");
    doc.send();
}

function open(url) {
    var doc = new XMLHttpRequest();
    doc.open("GET", URL_ROOT + url);
    doc.send();
}
