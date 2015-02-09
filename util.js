// Modules
var app = require('./app'),
    commandHandler = require('./CommandHandler');


// YouTube
var youtubeRegexp = /^(https?\:\/\/)?((www\.)?youtube\.com)\/.+$/;
var youtubeShortRegexp = /^(https?\:\/\/)?(youtu\.be)\/.+$/;
exports.tryYouTube = function(from, to, text) {
    var valid, id;

    if (text.match(youtubeRegexp)) { // youtube.com
        if (text.indexOf('v=') != -1) {
            valid = true;
            var temp = text.split('v=');
            id = temp[temp.length - 1];
        }
    } else if (text.match(youtubeShortRegexp)) { // youtu.be
        if (text.indexOf('/') != -1) {
            valid = true;
            var temp = text.split('/');
            id = temp[temp.length - 1];
        }
    }

    if (valid) {
        commandHandler.handle(to, from, 'yt', [id]);
    }

    return valid;
}
