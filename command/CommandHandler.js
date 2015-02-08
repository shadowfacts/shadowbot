// Stuff
exports.bot;
exports.handle = handle;
exports.people = [];

// Commands
exports.commands = {
    raw: require('./raw'),
    me: require('./me'),
    yt: require('./yt')
}


function handle(channel, sender, command, args) {
    cmd = getCommand(command);
    console.log(cmd);
    if (cmd != null) {
        if (validMode(channel, sender, cmd)) {
            cmd.run(channel, sender, args);
        }
    }
}

function getCommand(command) {
    if (command == 'raw') {
        return exports.commands.raw;
    } else if (command == 'me') {
        return exports.commands.me;
    } else if (command == 'yt') {
        return exports.commands.yt;
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
