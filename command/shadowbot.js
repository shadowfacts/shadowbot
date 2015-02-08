// Modules
var app = require('../app');

exports.mode = "";
exports.run = run;

function run(channel, sender, args) {
    app.bot.say(channel, "Hello, I'm shadowbot, I'm a robot. Look at my source code here: http://git.io/b50u!");
}
