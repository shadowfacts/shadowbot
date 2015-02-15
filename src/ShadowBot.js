"use strict";
// Modules
var CommandHandler = require('./command/CommandHandler'),
    irc = require('irc');

// The bot
exports.Bot = class ShadowBot {

    constructor(config) {
        // Load the config
        this.config = config;

        // The command handler
        this.commandHandler = new CommandHandler.Handler(config);

        // Create the IRC client
        this.client = new irc.Client(config.server, config.nickname, {
            channels: config.channels
        });

        // Various Listeners
        this.client.addListener('join', function(channel, who) {
            this.join(channel, who);
        });

        this.client.addListener('message', function(from, to, text, message) {
            message(from, to, text, message);
        })

    }

    /*
    * Starts the bot
    */
    start() {

    }

    // Event Handlers
    /*
    * Fired when someone joins a channel the bot is in
    *
    * @param channel The channel that has been joined
    * @param who The nickname of the person who joined
    */
    join(channel, who) {

    }

    // Fired when the bot receives a message, either in a channel or in a PM
    /*
    * Fired when the bot receives a message, either in a channel or in a PM
    *
    * @param from The nickname of the person who sent the message
    * @param to The channel/person the message was sent to
    * @param text The text of the message
    * @param message The raw IRC message object
    */
    message(from, to, text, message) {
        if (to.charAt(0) == '#') { // Sent in a channel
            if (text.charAt(0) == '!') { // Is a command

            }
        } else { // Private message

        }
    }


}
