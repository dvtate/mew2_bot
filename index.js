"use strict";

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TG_KEY;
const bot = new TelegramBot(TOKEN, { polling: true });


const request = require("request");
const fs = require("fs");
const time = require("time");


var pokemon = require("pokemon");

bot.onText(/\/pokemon(?:@mew2_bot)?(?:$|\s)/, msg => {

    var cdtimer = time.time();
    try {
        cdtimer = time.time() -
                    Number(readFileSync(
                        `${process.env.HOME}/.mew2/${msg.from.id}/catch.cd`, "utf8"));
    } catch (e) { }

    if (cdtimer > 10000) {
        const pkmn = pokemon.random();

        bot.sendMessage(msg.chat.id, `You caught a wild ${pkmn}`, {
            reply_to_message_id : msg.message_id
        });

        fs.mkdirSync(`${process.env.HOME}/.mew2/${msg.from.id}`);
        var list = 0;
        try {
            list = fs.readFileSync(`${process.env.HOME}/.mew2/${msg.from.id}/list`, "utf8");
        } catch (e) {};
        fs.writeFileSync(`${process.env.HOME}/.mew2/${msg.from.id}/list`, list + '\n' + pkmn);
        fs.writeFileSync(`${process.env.HOME}/.mew2/${msg.from.id}/catch.cd`, String(time.time());

    } else {

    }
});

bot.onText(/\/ping(?:@mew2_bot)?(?:$|\s)/, msg => {
    bot.sendMessage(msg.chat.id, "pong", {
        reply_to_message_id : msg.message_id
    });
});
