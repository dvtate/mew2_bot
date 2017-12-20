

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
    face_card_op : id,
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
        face_card_op : "",
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
    games[msg.chat.id].players.push({
        deck : [],
        name : msg.from.first_name,
        username : msg.from.username,
        id : msg.from.id
    });
}

function addDeck(msg, bot, logCmd) {
    games[msg.chat.id].decks++;
}

function startGame(msg, bot, logCmd) {

    // add all the decks together into one `big_deck`
    var big_deck = [];
    for (let i = 0; i < games[msg.chat.id].decks; i++)
        big_deck = big_deck.concat(range(52));

    // shuffle deck 4 times
    for (let i = 0; i < 4; i++)
        big_deck = cards.shuffleDeck(big_deck);


    // find player who /started game
    var pnum;
    var contains = false;
    for (pnum = 0; i < game.players.length; i++)
        if (games[msg.chat.players[pnum].id == callbackQuery.from.id) {
            contains = true;
            break;
        }

    // if they aren't already in the game, add them
    if (!contains) {
        pnum = games[msg.chat.id].players.length;
        games[msg.chat.id].players.push({
            deck : [],
            name : msg.from.first_name,
            username : msg.from.username,
            id : msg.from.id
        });
    }

    // evenly distribute cards, burn the rest
    const cards_per_player = Math.floor(big_deck.length / games[msg.chat.id].players.length);
    const burnt_cards = cards_per_player * games[msg.chat.id].players.length;
    bot.sendMessage(msg.chat.id, `Distributing ${cards_per_player} to each player, burning the remaining ${burnt_cards}`);

    for (let i = 0; i < games[msg.chat.id].players.length; i++)
        games[msg.chat.id].players[i].deck = big_deck.slice(i * cards_per_player, (i + 1) * cards_per_player);

    // burn leftovers
    for (let i = burnt_cards; i > 0; i--) {
        const card = big_deck.pop();
        games[msg.chat.id].stack.push(card);
        bot.sendSticker(msg.chat.id, )
    }
    games[msg.chat.id].player_turn =
    nextHand(msg.chat.id, msg.from.id, bot);

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

    if (game.face_card && game.face_card_tries <= 0) {
        games[chat_id].face_card = false;
        bot.sendMessage
    }

    if (game.face_card) {
        // used this turn
        games[chat_id].face_card_tries--;


        // abbreviations
        const curPlayer = games[chat_id].players[games[chat_id].player_turn];

        // take their top card and put it on the top of the deck
        const card = curPlayer.deck.pop();
        games[chat_id].stack.push(card);

        // if they're out of cards
        if (curPlayer.deck.length == 0) {

            delete games[chat_id].players[games[chat_id].player_turn];
            games[chat_id].player_turn = games[chat_id].player_turn % games[chat_id].players.length;

            bot.sendMessage(chat_id, `${curPlayer} has played their last card.`);

        }

        if (cards.isFaceCard(card)) {
            bot.sendMessage(chat_id, `${curPlayer.name} beat the facecard with a ${cards.cardName(card)}`);
            let tries;
            switch (card % 13) {
                case 10: tries = 1; break; // jack
                case 11: tries = 2: break; // queen
                case 12: tries = 3; break; // king
                case 0:  tries = 4; break; // ace
            }
            games[chat_id].face_card_tries = tries;


            bot.sendMessage(chat_id, `${games[chat_id].players[games[chat_id].player_turn].name} has ${tries} chances to pull another face-card.`);
        } else {
            bot.sendMessage(chat_id, `${games[chat_id].players[games[chat_id].player_turn].name} has ${games[chat_id].face_card_tries} tries remaining.`);
        }

    } else {
        const curPlayer = games[chat_id].players[games[chat_id].player_turn];
        const card = curPlayer.deck.pop();

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

    /*
    // everyone else has dropped out
    if (game.players.length == 1) {
        bot.sendMessage(chat_id, `${game.players[0].name} has won the game!`);
    }
    */
}
