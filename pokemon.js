
const request = require("request");
const fs = require("fs");
const time = require("time");

var pokemon = require("pokemon");
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();



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

module.exports.catchPokemon = (msg, bot, logCmd) => {

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

        logCmd(msg, `caught a /pokemon (${pkmn})`);

    } else {

        bot.sendMessage(msg.chat.id, `You have to wait ${formatTime(10000 - cdtimer)} seconds until you can catch another pokemon.`, {
            reply_to_message_id : msg.message_id
        });
        logCmd(msg, "/pokemon is on cd");
    }

};
