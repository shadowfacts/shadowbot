// Modules
var config = require('../config'),
    commandHandler = require('./command/CommandHandler'),
    HookManager = require('./hook/HookManager'),
    util = require('./util'),
    irc = require('irc'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    request = require('request'),
    async = require('async');


// Setup
var bot = new irc.Client('irc.esper.net', 'shadowbot', {
    channels: ['#shadowfacts', '#frozennova']
});
commandHandler.bot = bot;
exports.bot = bot;

// Listen for join events
bot.addListener('join', function(channel, who) {
    util.autoPermissions(channel, who);
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

    if (util.tryYouTube(from, to, text)) {
        return;
    } else if (util.tryGitHub(from, to, text)) {
        return;
    }
    // else if (util.tryGist(from, to, text)) {
    //     return;
    // } else if (util.tryBitly(from, to, text)) {
    //     return;
    // } else if (util.tryTinyURL(from, to, text)) {
    //     return;
    // }
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

                var msg = '[EnFusion/' + branch + '] ' + commit['author']['name'] + ': ' + commit['message'] + ' ' + url;
                bot.say('#shadowfacts', msg);
            });

        }
    }

    res.end();
});
// shadowbot
app.post('/shadowbot', function(req, res) {
    var hook = req.body;
    if (req.get('X-Github-Event') == 'push') {
        var temp = hook['ref'].split('/')
        var branch = temp[temp.length - 1];
        for (i in hook['commits']) {
            var commit = hook['commits'][i];

            request.post({ url: 'http://git.io', formData: { url: commit['url'] } }, function(err, res, body) {
                var url = res.headers['location']
            
                var msg = '[EnFusion/' + branch + '] ' + commit['author']['name'] + ': ' + commit['message'] + ' ' + url;
                bot.say('#shadowfacts', msg);
            });
        }
        if (config.updateMsg) bot.say(config.updateMsgReceiver, 'I was pushed to, someone needs to update me.');
    }

    res.end();
});

app.listen(2015);
exports.express.listen(config.webhookPort);
console.log('Webhook server started on port 2015.');
