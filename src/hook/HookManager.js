// Hook Manager
// Modules
var app = require('../app'),
    config = require('../../config'),
    hooks = require('../../hooks');

// Hooks
var hooks = [
    {
        'name': 'enfusion/push',

    }
];

// Register all hooks
exports.registerHooks = function() {
    // console.log(hooks);
    // for (var i = 0; i < hooks.allHooks.length; i++) {
    //     console.log('Hook' + i + ':' + hooks.all[i]);
    //     app.express.get(hooks.allHooks[i].name, hooks.allHooks[i].onGet);
    //     app.express.post(hooks.allHooks[i].name, hooks.allHooks[i].onPost);
    // }
}
