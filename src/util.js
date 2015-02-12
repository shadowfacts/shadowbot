// Modules
var app = require('./app'),
    config = require('../config'),
    commandHandler = require('./command/CommandHandler'),
    request = require('request'),
    async = require('async');


// Takes a URL, returns a git.io shorted URL
exports.shortenGitIO = function(url) {
    // var hasResponded = false;
    var url;
    request.post({ url: 'http://git.io', formData: { url: url } }, function(err, res, body) {
        // return res.headers['location'];
        // hasResponded = true;
        url = res.headers['location'];
    });
    return url;
    // while (true);
    // async.series([
    //     function() {
    //         request.post({ url: 'http://git.io', formData: { url: url } }, function(err, res, body) )
    //     }
    // ]);
}

// AutoOp/AutoVoice
exports.autoPermissions = function(channel, who) {
    var hasOpped;
    if (config.autoOpEnabled) {
        for (user in config.toOp[channel]) {
            if (who == config.toOp[channel][user]) {
                bot.send('MODE', channel, '+o', who);
                hasOpped = true;
            }
        }
    }
    if (!hasOpped && config.autoVoiceEnabled) {
        // TODO: Fix me
        for (user in config.toVoice[channel]) {
            if (who == config.toVoice[channel][user]) {
                bot.send('MODE', channel, '+v', who);
            }
        }
    }
}


// YouTube
var youtubeRegexp = /^(https?\:\/\/)?((www\.)?youtube\.com)\/.+$/;
var youtubeShortRegexp = /^(https?\:\/\/)?(youtu\.be)\/.+$/;
exports.tryYouTube = function(from, to, text) {
    if (config.youtubeRegex[to]) {
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
    } else {
        return false;
    }
}

// GitHub
var githubRegexpHTTP = /^https?\:\/\/github\.com\/.+$/;
var githubRegexpNoHTTP = /^github\.com\/.+$/;
exports.tryGitHub = function(from, to, text) {
    // var success;
    //
    //
    // if (text.match(githubRegexpHTTP) || text.match(githubRegexpNoHTTP)) {
    //     success = true;
    //
    //     var temp = text.split('/');
    //     temp.shift();
    //     if (text.match(githubRegexpHTTP)) {
    //         temp.shift();
    //     }
    //
    //     commandHandler.handle(to, from, 'github', temp);
    // }
    //
    // return success;
}
