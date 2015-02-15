"use strict";

// Modules
var ShadowBot = require('./src/ShadowBot.js'),
    fs = require('fs');

// Start
var config = JSON.parse(fs.readFileSync('./config/config.json'));

var bot = new ShadowBot.Bot(config);

bot.start();
