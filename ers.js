

const request = require("request");
const fs = require("fs");
const time = require("time");
const cards = require("./cards");

var games = {};

/*
game = {
    players : [ { player obj }, , ...],
    player_turn : index in `players`,
    slapped : bool,
    face_card : false,
    face_card_tries : null,
    stack : [ cards currently in play ],
    decks : number of decks in play,
    rules :  {
        double : true,
        sandwich : true,
        top_bottom : false,
        tens : false,
        jokers : false,
        four_in_row : false,
        marriages : false,
        burn : 1
    }
}

player = {
    deck : [ card nums ],
    name : "",
    username : "",
    id : user_id,
}
*/


function endGame(chat_id, msg, bot) {

    // sort players by deck size
    const players = games[chat_id].players;
    players.sort((a, b) => {
        return a.deck.length - b.deck.length;
    });

    // format stats
    var stats = "";
    for (let i = 0; i < players.length; i++)
        stats += `${i}: ${players[i].name} (@${players[i].username}) - ${players[i].deck.length}\n`;

    // delete game
    delete games[chat_id];

    // send stats to players
    bot.sendMessage(chat_id, `Ended game:\n${stats}`, {
        reply_to_message_id : msg.message_id
    });
}

function newGame(msg, bot) {

    games[msg.chat.id] = {
        players : [],
        player_turn : 0,
        slapped : false,
        face_card : false,
        face_card_tries : null,
        stack : [],
        decks : 1,
        rules :  {
            double : true,
            sandwich : true,
            top_bottom : false,

            // todo
            tens : false,
            jokers : false,
            four_in_row : false,
            marriages : false,
            burn : 1
        }
    };
    var creator = {
        deck : [],
        name : msg.from.first_name,
        username : msg.from.username,
        id : msg.from.id
    }
    games[msg.chat.id].players.push(player);
    bot.sendMessage(msg.chat.id, `ERS game created. Use the following commands:\n
        /join_ERS - join the game
        /add_deck - add additional decks of cards (start with one)
        /rules_ERS - adjust the slaping rules of the game (defaults are fine)
        /start_ERS - start the game, after this point, people can only join by slapping in
        `
    , { reply_to_message_id : msg.message_id });
}

function addMember(msg, bot, logCmd) {
    var creator = {
        deck : [],
        name : msg.from.first_name,
        username : msg.from.username,
        id : msg.from.id
    }
}

function startGame(msg, bot, logCmd) {

}

function slap(callbackQuery, bot, logCmd) {
    const msg = callbackQuery.message;
    const chat_id = msg.chat.id;

    // there is an active game
    if (games[chat_id]) {
        const game = games[chat_id];

        if (game.slapped == false) {
            game.slapped = true;

            if (stack.length > 2) {
                if (game.rules.double &&
                    stack[stack.length - 1] == stack[stack.length - 2])
                {
                    // get user number / see if they're in the game already
                    var i;
                    var contains = false;
                    for (i = 0; i < game.players.length; i++)
                        if (players[i].id == callbackQuery.from.id) {
                            contains = true;
                            break;
                        }

                    // someone just slapped in
                    if (!contains) {
                        games[chat_id].players.push({
                            deck : [],
                            name : msg.from.first_name,
                            username : msg.from.username,
                            id : msg.from.id
                        });
                        bot.sendMessage(chat_id,
                                        `${callbackQuery.from.first_name} slapped in on a double, grabbing ${stack.length} cards`,
                                        { reply_to_message_id : msg.message_id });
                    } else {
                        bot.sendMessage(chat_id,
                                        `${callbackQuery.from.first_name} slapped a double, grabbing ${stack.length} cards`,
                                        { reply_to_message_id : msg.message_id });
                    }

                    // give the player the stack
                    games[chat_id].players[i].deck = games[chat_id].stack.concat(players[i].deck);
                    games[chat_id].stack = [];

                    // if u pick up cards u go next ("redistribution of wealth")
                    games[chat_id].player_turn = i;

                    // reset
                    games[chat_id].face_card = false;
                    games[chat_id].slapped = false;


                    nextHand(chat_id, game.players[i].id, bot);

                }
                else if (game.rules.sandwich &&
                         stack[stack.length - 1] == stack[stack.length - 3])
                {
                    // get user number / see if they're in the game already
                    var i;
                    var contains = false;
                    for (i = 0; i < game.players.length; i++)
                        if (players[i].id == callbackQuery.from.id) {
                            contains = true;
                            break;
                        }

                    // someone just slapped in
                    if (!contains) {
                        games[chat_id].players.push({
                            deck : [],
                            name : msg.from.first_name,
                            username : msg.from.username,
                            id : msg.from.id
                        });
                        bot.sendMessage(chat_id,
                                        `${callbackQuery.from.first_name} slapped in on a sandwich, grabbing ${stack.length} cards`,
                                        { reply_to_message_id : msg.message_id });
                    } else {
                        bot.sendMessage(chat_id,
                                        `${callbackQuery.from.first_name} slapped a sandwich, grabbing ${stack.length} cards`,
                                        { reply_to_message_id : msg.message_id });
                    }

                    // prevent more slaps
                    bot.editMessageReplyMarkup({}, { message_id : msg.message_id });


                    // give the player the stack
                    games[chat_id].players[i].deck = games[chat_id].stack.concat(players[i].deck);
                    games[chat_id].stack = [];

                    // if u pick up cards u go next ("redistribution of wealth")
                    games[chat_id].player_turn = i;

                    // reset
                    games[chat_id].face_card = false;
                    games[chat_id].slapped = false;


                    nextHand(chat_id, game.players[i].id, bot);

                }
                else if (game.rules.top_bottom &&
                         stack[stack.length - 1] == stack[0])
                {

                }

                else {
                    // get user number / see if they're in the game already
                    var i;
                    var contains = false;
                    for (i = 0; i < game.players.length; i++)
                        if (players[i].id == callbackQuery.from.id) {
                            contains = true;
                            break;
                        }

                    // someone just slapped in
                    if (!contains) {
                        bot.answerCallbackQuery(callbackQuery.id, { text : "wrong!" });

                    } else {
                        bot.answerCallbackQuery(callbackQuery.id, { text : "wrong! now u have to burn a card." });

                        const card = games[chat_id].players[i].deck.pop();

                        if (games[chat_id].players[i].deck == 0) {
                            bot.sendMessage(chat_id,
                                            `${callbackQuery.from.first_name} was forced to burn their last card (${cards.cardName(card)})`,
                                            { reply_to_message_id : msg.message_id });

                            // remove them from the game
                            delete games[chat_id].players[i];
                            // might change who goes next
                            games[chat_id].player_turn = ( games[chat_id].player_turn - games[chat_id].player_turn > i ? 1 : 0) % games[chat_id].players.length;

                        } else {
                            bot.sendMessage(chat_id,
                                            `${callbackQuery.from.first_name} burned a card (${cards.cardName(card)})`,
                                            { reply_to_message_id : msg.message_id });
                        }

                        // put burnt card onto bottom of stack
                        games[chat_id].stack = [ card ].concat(games[chat_id].stack);


                    }
                }
            }
            // make 'em burn it
            else {

            }

        } else {

        }

    } else { // game has ended
        bot.answerCallbackQuery(callbackQuery.id, {
            text : "your slap was invalid :/"
        })
    }
}

function nextHand(chat_id, usr_id, bot) {
    const game = games[chat_id];

    if (game.face_card) {
        game.face_card_tries--;

        const game = games[chat_id];
        const curPlayer = games[chat_id].players[games[chat_id].player_turn];
        const card = curPlayer.deck.pop();

        games[chat_id].stack.push(card);

        if (cards.isFaceCard(card)) {
            let tries;
            switch (card % 13) {
                case 10: tries = 1; break; // jack
                case 11: tries = 2: break; // queen
                case 12: tries = 3; break; // king
                case 0:  tries = 4; break; // ace
            }
            bot.sendMessage(chat_id, `${game.players[game.player_turn].first_name} has ${tries} chances to pull another face-card.`);
        } else {
            bot.sendMessage(chat_id, `${game.players[game.player_turn].first_name} has '`);
        }

    } else {
        const curPlayer = games[chat_id].players[games[chat_id].player_turn];
        const card = curPlayer.deck.pop();
        const game = games[chat_id];

        games[chat_id].stack.push(card);

        if (curPlayer.deck.length == 0)
            bot.sendMessage(chat_id, `${curPlayer.name} has played their last card, but they can still slap in.`);

        if (curPlayer.deck.length == 0) {
            delete games[chat_id].players[games[chat_id].player_turn];
            games[chat_id].player_turn = games[chat_id].player_turn % games[chat_id].players.length;
        } else {
            games[chat_id].player_turn = (games[chat_id].player_turn + 1) % games[chat_id].players.length;
        }


        if (cards.isFaceCard(card)) {
            let tries;
            switch (card % 13) {
                case 10: tries = 1; break; // jack
                case 11: tries = 2: break; // queen
                case 12: tries = 3; break; // king
                case 0:  tries = 4; break; // ace
            }
            bot.sendMessage(chat_id, `${game.players[game.player_turn].first_name} has ${tries} chances to pull another face-card.`);
        } else {
            bot.sendMessage(chat_id, `It's ${game.players[game.player_turn].first_name}'s turn now.'`);
        }
        // show card
        bot.sendSticker(msg.chat.id, cards.card_file_id[card], {
            reply_to_message_id : msg.message_id,
    		reply_markup: {
                inline_keyboard : [
                    [ { text: "slap", callback_data: "slap" } ],
                    [ { text: `next (${game.players[game.player_turn]})`, callback_data: "next" } ]
                ]
            }
        });

        if (curPlayer.deck.length == 0) {
            delete games[chat_id].players[games[chat_id].player_turn];
            games[chat_id].player_turn = games[chat_id].player_turn % games[chat_id].players.length;
        } else {
            games[chat_id].player_turn = (games[chat_id].player_turn + 1) % games[chat_id].players.length;
        }

    }
}
