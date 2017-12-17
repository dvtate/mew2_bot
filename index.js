"use strict";

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TG_KEY;
const bot = new TelegramBot(TOKEN, { polling: true });


const request = require("request");
const fs = require("fs");
const time = require("time");


var pokemon = require("pokemon");
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();


// Function to simplify logging
function logCmd(msg, logMessage) {
	const timestamp = require("node-datetime").create().format("[Y-m-d@H:M:S]");
	const entry = `${timestamp}: ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) ${logMessage}`;
	fs.appendFile(`${process.env.HOME}/.mew2/useage.log`, entry + '\n', (err) => {
		if (err)
			throw err;
		console.log(entry);
	});
}

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 60 / 60);
    const mins = Math.floor(seconds / 60 % 60);
    const secs = seconds % 60;
    return `${hrs} hours, ${mins} minutes, and ${secs} seconds`;
}

async function makePokemon(id) {
    var ret = {};
    ret.species = pokemon.getName(id);
    ret.speciesNum = id;
    ret.moves = {


    };
}

// catch a random pokemon
bot.onText(/^\/pokemon(?:@mew2_bot)?(?:$|\s)/, msg => {

    // cooldown timer to prevent user from spamming
    var cdtimer = time.time();

    try { // cdtimer = cur time - time of last /pokemon
        cdtimer -= Number(fs.readFileSync(`${process.env.HOME}/.mew2/${msg.from.id}/catch.cd`, "utf8"));
    } catch (e) { // no cdtimer file
        cdtimer = time.time();
        try { // if user doesnt have a directory, make them one
            fs.mkdirSync(`${process.env.HOME}/.mew2/${msg.from.id}`);
        } catch (x) {}
    }

    // if it's been more than 10000 secs since last /pokemon
    if (cdtimer > 10000) {
        const pkmn = pokemon.random();
        var pkobj = {};

        // send pokemon sprite gif
        let img = request(`http://www.pokestadium.com/sprites/xy/${pkmn.toLowerCase()}.gif`);
        bot.sendDocument(msg.chat.id, img, {
            caption : `You caught a wild ${pkmn}`,
            reply_to_message_id : msg.message_id
        });

        fs.appendFile(`${process.env.HOME}/.mew2/${msg.from.id}/list`, pkmn + '\n', () => {});
        fs.writeFile(`${process.env.HOME}/.mew2/${msg.from.id}/catch.cd`, String(time.time()), () => {});

    } else {

        bot.sendMessage(msg.chat.id, `You have to wait ${formatTime(10000 - cdtimer)} seconds until you can catch another pokemon.`, {
            reply_to_message_id : msg.message_id
        });

    }
});

// what do i have?
bot.onText(/^\/inventory(?:@mew2_bot)?(?:$|\s)/, msg => {
    const inventory = fs.readFileSync(`${process.env.HOME}/.mew2/${msg.from.id}/list`);
    bot.sendMessage(msg.chat.id, inventory, { reply_to_message_id : msg.message_id });
});



// connection testing
bot.onText(/^\/ping(?:@mew2_bot)?(?:$|\s)/, msg => {
    bot.sendMessage(msg.chat.id, "pong", {
        reply_to_message_id : msg.message_id
    });
});



/** TODO:
* [x] /pokemon - catch another pokemon
* [x] /inventory - list pokemon
* [ ] /train - use xp on a certain pokemon
* [ ] /battle - battle other players
* [ ] /release - convert pokemon into xp
* [?]  /pokedex - pokemon user has had at one point in time
*/
