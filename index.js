"use strict";

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TG_KEY;
const bot = new TelegramBot(TOKEN, { polling: true });


const request = require("request");
const fs = require("fs");
const time = require("time");

const ers = require("./ers.js");


// Function to simplify logging
async function logCmd(msg, logMessage) {
	const timestamp = require("node-datetime").create().format("[Y-m-d@H:M:S]");
	const entry = `${timestamp}: ${msg.from.first_name} ${msg.from.last_name} (@${msg.from.username}) ${logMessage}`;
	fs.appendFile(`${process.env.HOME}/.mew2/useage.log`, entry + '\n', (err) => {
		if (err)
			throw err;
		console.log(entry);
	});
}


// catch a random pokemon
bot.onText(/^\/pokemon(?:@mew2_bot)?(?:$|\s)/, msg => {
    require("./pokemon.js").catchPokemon(msg, bot, logCmd);
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

// ers test
bot.onText(/^\/test/, (msg) => {
    bot.sendSticker(msg.chat.id, "CAADAQAD5gAD5HbMCODNi4Sm65JcAg", {
        reply_to_message_id : msg.message_id,
		reply_markup: {
            inline_keyboard : [
                [ { text: "slap", callback_data: "slap" } ],
                [ { text: "next", callback_data: "next" } ],
				[ { text: "ff", callback_data: "ff" } ]
            ]
        }
    });
});

bot.onText(/^\/card(?:@mew2_bot)? (.+)(?:$|\s)/, (msg, match) => {
    bot.sendSticker(msg.chat.id, require("./cards.js").card_file_id[Number(match[1])], {
        reply_to_message_id : msg.message_id
    });
});



bot.on("callback_query", function(callbackQuery) {
    const data = callbackQuery.data;
    const msg = callbackQuery.message;
    const usr = callbackQuery.from;
    if (!msg) {
        console.log("ERROR: callback_query: msg undefined");
        return;
    }

	const opts = {
		chat_id: msg.chat.id,
		message_id: msg.message_id
	};

    if (data == "slap") {
        ers.slap(callbackQuery, bot);
    } else if (data == "next") {
        ers.nextHand(callbackQuery, bot);
    } else if (data == "ff") {
		bot.answerCallbackQuery(callbackQuery.id, {
			text: "hi there"
		});
	}
});


bot.onText(/^\/ers(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.newGame(msg, bot);
});
bot.onText(/^\/join_ERS(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.addMember(msg, bot);
});
bot.onText(/^\/add_deck(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.addDeck(msg, bot);
});
bot.onText(/^\/start_ERS(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.startGame(msg, bot);
});
bot.onText(/^\/end_ERS(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.endGame(msg, bot);
});
bot.onText(/^\/count_cards_ERS(?:@mew2_bot)?(?:$|\s)/, (msg) => {
    ers.countCards(msg, bot);
});

/** TODO:
* POKEMON:
*  [x] /pokemon - catch another pokemon
*  [x] /inventory - list pokemon
*  [ ] /xp - show how much xp the user has to play with
*  [ ] /train - use xp on a certain pokemon
*  [ ] /battle - battle other players
*  [ ] /release - convert pokemon into xp
*  [?] /pokedex - pokemon user has had/encountered at one point in time
*
* More: stuff ill probably add to this bot but might add to another
* [ ] ERS game with inline keyboard for slapping
* [ ] OP.GG lookup
*/
