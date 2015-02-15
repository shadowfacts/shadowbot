"use strict";

// Modules

// CommandHandler
exports.commands = {
    raw: require('./raw')
};

exports.Handler = class CommandHandler {
    constructor(config) {
        this.config = config;
    }

    /*
    * Called whenever ShadowBot receives a command

    */
    handleCommand(commandString) {

    }

    static getCommandFromString(string) {
        if (string == 'raw' && config.commands.raw == true) {
            return exports.commands.raw;
        }
    }
}
