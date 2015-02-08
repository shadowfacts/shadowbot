// Modules
var app = require('../app');

exports.mode = "+";
exports.run = run;

function run(channel, sender, args) {
    app.bot.say(channel, args.join(' '));
}
