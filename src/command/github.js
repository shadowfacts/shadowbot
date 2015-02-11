// Modules
var app = require('../app'),
    request = require('request');

exports.mode = "";
exports.run = run;

function run(channel, sender, badArgs) {
    var args = badArgs[0].split('/');
    if (args.length == 1) { // User
        handleUser(channel, sender, args[0]);
    } else if (args.length == 2 && args[1].indexOf('#') == -1) { // Repository
        handleRepo(channel, sender, args[0], args[1]);
    } else if (args.length == 2 && args[1].indexOf('#') != -1) { // Single Issue or PR
        // if (args[2] == 'issues') { // Single Issue
        //     handleIssue(channel, sender, args[0], args[1], args[3]);
        // } else if (args[2] == 'pulls') { // Single PR
        //     handlePR(channel, sender, args[0], args[1], args[3]);
        // }
        handleIssueOrPR(channel, sender, args[0], args[1].split('#')[0], args[1].split('#')[1])
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
                url: json.html_url,
                login: json.login,
                name: json.name || json.login,
                company: json.company || '(none)',
                website: json.blog || '(none)',
                location: json.location || '(none)',
                email: json.email || '(none)',
                publicRepos: json.public_repos,
                followers: json.followers,
                following: json.following
            };

            var msg1 = 'Username: ' + data.login + ', Name: ' + data.name + ', Company: ' + data.company;
            var msg2 = 'Website: ' + data.website + ', Location: ' + data.location + ', email: ' + data.email;
            var msg3 = 'Public Repos: ' + data.publicRepos + ', Followers: ' + data.followers + ', Following: ' + json.following;

            app.bot.say(channel, msg1);
            app.bot.say(channel, msg2);
            app.bot.say(channel, msg3);

        } else if (res.statusCode == '404') {
            app.bot.say(channel, 'The user you are looking for does not exist.');
        } else {
            app.bot.say(channel, 'There was an error accessing the GitHub API.');
        }
    });
}

function handleRepo(channel, sender, user, repo) {
    var options = {
        url: 'https://api.github.com/repos/' + user + '/' + repo,
        headers: {
            'User-Agent': 'shadowfacts'
        }
    };
    request(options, function(err, res, body) {
        if (res.statusCode == 200) {
            var json = JSON.parse(body);

            var data = {
                url: json.html_url,
                owner: json.owner.login,
                name: json.name,
                private: json.private,
                description: json.description || '(none)',
                fork: json.fork,
                homepage: json.homepage || '(none)',
                stargazers: json.stargazers_count,
                watchers: json.watchers_count,
                lang: json.language,
                issues: json.open_issues_count,
            };

            var msg1 = 'Owner: ' + data.owner + ', Repo Name: ' + data.name + ', Private: ' + data.private;
            var msg2 = 'Description: ' + data.description;
            var msg3 = 'Is a Fork: ' + data.fork + ', Homepage: ' + data.homepage;
            var msg4 = 'Stargazers: ' + data.stargazers + ', Watchers: ' + data.watchers + ', Language: ' + data.lang + ', # Open Issues: ' + data.issues;

            app.bot.say(channel, data.url);
            app.bot.say(channel, msg1);
            app.bot.say(channel, msg2);
            app.bot.say(channel, msg3);
            app.bot.say(channel, msg4);

        } else if (res.statusCode == '404') {
            app.bot.say('The repository you are looking for does not exist.');
        } else {
            app.bot.say('There was an error accessing the GitHub API.');
        }
    });

}

function handleIssueOrPR(channel, sender, user, repo, id) {
    console.log('0');
    var options = {
        url: 'https://api.github.com/repos/' + user + '/' + repo + '/pulls/' + id,
        headers: {
            'User-Agent': 'shadowfacts'
        }
    };
    console.log(options.url);

    request(options, function(err, res, body) {
        if (res.statusCode == 200) { // Pull request
            var json = JSON.parse(body);

            if (json.html_url.indexOf('pull') != -1) {
                handlePR(channel, sender, json);
                return;
            }

        } else { // Issue or actual 404
            console.log('3');
            var options2 = {
                url: 'https://api.github.com/repos/' + user + '/' + repo + '/issues/' + id,
                headers: {
                    'User-Agent': 'shadowfacts'
                }
            };
            console.log(options2.url);
            request(options2, function(err, res, body) {
                console.log('4')
                if (res.statusCode == 200) { // Issue
                    console.log('5');
                    handleIssue(channel, sender, JSON.parse(body));
                    return;
                } else if (res.statusCode == 404) { // Issue/PR doesn't exist
                    console.log('6');
                    app.bot.say(channel, 'The issue/pr you are looking for does not exist.');
                } else {
                    app.bot.say(channel, 'There was an error accessing the GitHub API.');
                    console.log('1');
                    return;
                }
            });
            return;
        }
        app.bot.say(channel, 'There was an error accessing the GitHub API.');
        console.log('2');
    });
    return;
}

function handleIssue(channel, sender, json) {
    // var json = JSON.parse(body);
    var data = {
        url: json.html_url,
        number: json.number,
        title: json.title,
        creator: json.user.login,
        state: json.state,
        locked: json.locked,
        assignee: json.assignee || '(nobody)',
        closedBy: json.closed_by
    };

    var msg1 = '#' + data.number + ': ' + data.title;
    var msg2 = 'Created by: ' + data.creator + ', State: ' + data.state + ', Locked: ' + data.locked;
    var msg3;

    if (data.state == 'closed') {
        msg3 = 'Assigned to: ' + data.assignee + ', Closed by: ' + data.closedBy;
    } else {
        msg3 = 'Assigned to: ' + data.assignee;
    }

    app.bot.say(channel, data.url);
    app.bot.say(channel, msg1);
    app.bot.say(channel, msg2);
    app.bot.say(channel, msg3);
}

function handlePR(channel, sender, json) {
    var data = {
        url: json.html_url,
        number: json.number,
        state: json.state,
        locked: json.locked,
        title: json.title,
        creator: json.user.login,
        closedAt: json.closed_at,
        mergedAt: json.merged_at,
        merged: json.merged,
        commits: json.commits
    };

    var msg1 = '#' + data.number + ': ' + data.title;
    var msg2 = 'Created by: ' + data.creator + ', State: ' + (data.merged ? "merged" : json.state) + ', Locked: ' + data.locked;
    var date = data.closedAt || '(none)';
    if (date == null || date.typeof == 'undefined') {
        date = '(none)';
    }

    var msg3 = '# Commits: ' + data.commits + ', Closed/Merged at: ' + date;

    app.bot.say(channel, data.url);
    app.bot.say(channel, msg1);
    app.bot.say(channel, msg2);
    app.bot.say(channel, msg3);
}
