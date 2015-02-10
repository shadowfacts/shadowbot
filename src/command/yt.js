// Modules
var app = require('../app'),
    config = require('../../config'),
    request = require('request');

exports.mode = "";
exports.run = run;

function run(channel, sender, args) {
    var id = args[0];
    var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + config.ytKey + '&part=snippet';
    request(url, function(error, response, body) {
        try {
            var json = JSON.parse(body);

            var ytChannel = json.items[0].snippet.channelTitle;
            var title = json.items[0].snippet.title;
            var url = 'http://youtu.be/' + id;

            app.bot.say(channel, 'YouTube - ' + ytChannel + ': ' + title + ' - ' + url);
        } catch (ex) {
            app.bot.say(channel, 'Uh oh, that probably wasn\' a valid YouTube URL.');
        }
    });
}
