shadowbot
==========

My IRC bot, built 100% in Node.js. Active in #shadowfacts on [irc.esper.net][esper], some of the commands are op/voice only, just ask me for a demo.


## Usage
To install shadowbot either [download][zip_dl] the repo as a .zip file or run:
```bash
git clone https://github.com/shadowfacts/shadowbot.git shadowbot
```

Once the repository is downloaded open it up, clone the default hooks.js.example and config.js.example. Remove everything from hook.js (WIP) and fill in the correct values for your instance of it. Next use [npm][npm] to install all of the dependencies:
```bash
npm install
```
Lastly run `app.js` with node to start it:
```bash
node src/app.js
```

## Configuration
`channels`: (array) A list of strings that are channels that the bot should join on startup. **Note:** Channel names must begin with `#`.

`server`: (string) The address of the server that the bot should connect to. e.g. `irc.esper.net` or `irc.freenode.net`.

`nick`: (string) The nickname that the bot will use.

`loginCmd`: (string) A command to send to the the server when the bot logs in. **Note:** Doesn't actually work right now, #13.

`autoOpEnabled`: (boolean) Whether or not to automatically op certain people when they connect. **Note:** Requires the bot to be an operator itself.

`toOp`: (array(s)) See above. **Note:** Currently manually disabled.

`autoVoiceEnabled`: (boolean) Whether or not to automatically voice certain people when the connect. **Note:** Requires the bot to be an operator.

`toVoice`: (array(s)) See above. **Note:** Currently manually disabled.

`ytKey`: (string) The API key to use when accessing the [YouTube v3 API][ytAPI].

`globals`: (array of strings) A list of users that can use all commands in any channel, no matter their status.

`updateMsg`: (boolean) Whether or not to send a private message to someone notifying them that someone has pushed to this repository, and that the bot should be updated. **Note:** Not working properly right now.

`updateMsgReceiver`: (string) The nickname of the person who should receive the update message.

`webhookPort`: (number) The port to run the webhook server on.

`youtubeRegex`: (object (string: boolean)) Whether or not to enable YouTube regular expression matching on a per channel basis.

[esper]: http://esper.net/publicirc.php
[zip_dl]: http://git.io/NZjE
[npm]: https://www.npmjs.com/
[ytAPI]: https://developers.google.com/youtube/v3/
