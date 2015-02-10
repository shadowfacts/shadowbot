// Modules
var app = require('../app'),
    request = require('request');

exports.mode = "";
exports.run = run;

function run(channel, sender, args) {
    if (args.length == 1) { // User
        handleUser(channel, sender, args[0]);
    } else if (args.length == 2) { // Repository
        handleRepo(channel, sender, args[0], args[1]);
    } else if (args.length == 4) { // Single Issue or PR
        if (args[2] == 'issues') { // Single Issue
            handleIssue(channel, sender, args[0], args[1], args[3]);
        } else if (args[2] == 'pulls') { // Single PR
            handlePR(channel, sender, args[0], args[1], args[3]);
        }
    }
}

function handleUser(channel, sender, user) {
    var options = {
        url: 'https://api.github.com/users/' + user,
        headers: {
            'User-Agent': 'shadowfacts'
        }
    };
    request(options, function(err, res, body) {
        if (res.statusCode == 200) {
            var json = JSON.parse(body);

            var data = {
                login: json.login,
                name: json.name || json.login,
                company: json.company || '(none)',
                website: json.blog || '(none)',
                location: json.location || '(none)',
                email: json.email || '(none)',
                publicRepos: json.public_repos,
                followers: json.followers,
                following: json.following
            }

            var msg1 = 'Username: ' + data.login + ', Name: ' + data.name + ', Company: ' + data.company;
            var msg2 = 'Website: ' + data.website + ', Location: ' + data.location + ', email: ' + data.email;
            var msg3 = 'Public Repos: ' + data.publicRepos + ', Followers: ' + data.followers + ', Following: ' + json.following;

            app.bot.say(channel, 'https://github.com/' + user);
            app.bot.say(channel, msg1);
            app.bot.say(channel, msg2);
            app.bot.say(channel, msg3);
        } else {
            app.bot.say('There was an error accessing the GitHub API, either it is down, or the user you tried to access doesn\'t exist.');
        }
    });
}

function handleRepo(channel, sender, user, repo) {
}

function handleIssue(channel, sender, user, repo, issue) {

}

function handlePR(channel, sender, user, repo, pr) {

}
