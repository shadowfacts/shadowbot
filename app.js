// Modules
var config = require('./config'),
    commandHandler = require('./command/CommandHandler.js'),
    irc = require('irc'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    request = require('request');


// Setup
var bot = new irc.Client('irc.esper.net', 'shadowbot', {
    channels: ['#shadowfacts', '#frozennova']
});
commandHandler.bot = bot;
exports.bot = bot;

// Listen for join events
bot.addListener('join', function(channel, who) {
    for (user in config.toOp[channel]) {
        if (who == config.toOp[channel][user]) {
            bot.send('MODE', channel, '+o', who);
        }
    }
    // for (user in config.toVoice[channel]) {
    //     if (who == config.toVoice[channel][user]) {
    //         bot.send('MODE', channel, '+v', who);
    //     }
    // }
});

// Commands
bot.addListener('message', function(from, to, text, message) {
    if (text.charAt(0) == '!') {
        if (to.charAt(0) == '#') {
            var args = text.substr(1).split(' ');
            var command = args.shift();
            commandHandler.handle(to, from, command, args);
        }
    }
});

// People
bot.addListener('names', function(channel, nicks) {
    commandHandler.people[channel] = nicks;
});
bot.addListener('part', function(channel, nick, reason, message) {
    bot.send('NAMES', channel);
});
bot.addListener('nick', function(oldNick, newNick, channels, message) {
    for (i in config.channels) {
        var j = channels.indexOf(config.channels[i]);
        if (j != -1) {
            bot.send('NAMES', config.channels[i]);
        }
    }
});
bot.addListener('+mode', function(channel, by, mode, argument, message) {
    bot.send('NAMES', channel);
});
bot.addListener('-mode', function(channel, by, mode, argument, message) {
    bot.send('NAMES', channel);
});

// Webhooks
var app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

// Individual Hooks
// EnFusion
app.post('/enfusion', function(req, res) {
    var hook = req.body;
    if (req.get('X-Github-Event') == 'push') {
        var temp = hook['ref'].split('/')
        var branch = temp[temp.length - 1];
        for (i in hook['commits']) {
            var commit = hook['commits'][i];

            var formData = { url: commit['url'] };

            request.post({ url: 'http://git.io', formData: formData }, function(err, res, body) {
                var url = res.headers['location']
                console.log(url);
                console.log(res.headers);

                var msg = '[EnFusion/' + branch + '] ' + commit['author']['name'] + ': ' + commit['message'] + ' ' + url;
                bot.say('#shadowfacts', msg);
            });
        }
    }

    res.end();
});

app.listen(2015);
console.log('Webhook server started on port 2015.');
