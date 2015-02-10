// Modules
var config = require('../../config');

// Stuff
exports.bot;
exports.handle = handle;
exports.people = [];

// Commands
exports.commands = {
    shadowbot: require('./shadowbot'),
    raw: require('./raw'),
    me: require('./me'),
    yt: require('./yt'),
    github: require('./github')
}


function handle(channel, sender, command, args) {
    cmd = getCommand(command);
    if (cmd != null) {
        if (config.globals.indexOf(sender) != -1 || validMode(channel, sender, cmd)) {
            cmd.run(channel, sender, args);
        }
    }
}

function getCommand(command) {
    if (command == 'shadowbot') {
        return exports.commands.shadowbot;
    } else if (command == 'raw') {
        return exports.commands.raw;
    } else if (command == 'me') {
        return exports.commands.me;
    } else if (command == 'yt') {
        return exports.commands.yt;
    } else if (command == 'github') {
        return exports.commands.github;
    } else if (command == 'gh') {
        return exports.commands.github;
    } else {
        return null;
    }
}

function validMode(channel, sender, command) {
    var mode = exports.people[channel][sender];

    if (command.mode == '@') {
        return mode == '@';
    } else if (command.mode == '+') {
        return mode == '+' || mode == '@';
    } else {
        return true;
    }
}
