
module.exports.card_file_id = [
    // clubs
    "CAADAQADwgAD5HbMCIXGScqh2MhIAg", // ace
    "CAADAQAD7AAD5HbMCCTrmHlhT1caAg", // 2
    "CAADAQADuwAD5HbMCH2W5OZeC9HQAg", // 3
    "CAADAQADvAAD5HbMCDTN4CIijd2qAg", // 4
    "CAADAQADvQAD5HbMCG1tOU7ljIwfAg", // 5
    "CAADAQADvgAD5HbMCH8fB3PgrZQVAg", // 6
    "CAADAQADvwAD5HbMCMhdJP00pvQ0Ag", // 7
    "CAADAQADwAAD5HbMCMzNgoqjniqCAg", // 8
    "CAADAQADwQAD5HbMCLyrVcudbOhDAg", // 9
    "CAADAQADugAD5HbMCN96d4D_fLkUAg", // 10
    "CAADAQADwwAD5HbMCEFIw7XgyJ4WAg", // j
    "CAADAQADxQAD5HbMCJjOr7ysjvxCAg", // q
    "CAADAQADxAAD5HbMCI60K3XUg-jeAg", // k
    // diamonds
    "CAADAQADzwAD5HbMCAjyuj7aH3d9Ag",
    "CAADAQADxwAD5HbMCKRs4OrTqE7zAg",
    "CAADAQADyAAD5HbMCC1rz6xP2S7AAg",
    "CAADAQADyQAD5HbMCCbGG0whZbfzAg",
    "CAADAQADygAD5HbMCLwsZF4MCajJAg",
    "CAADAQADywAD5HbMCGhd8nUS8NwyAg",
    "CAADAQADzAAD5HbMCEuwbH-1wsvXAg",
    "CAADAQADzQAD5HbMCOWr_QFwnueeAg",
    "CAADAQADzgAD5HbMCGMKCoeikykuAg",
    "CAADAQADxgAD5HbMCGQdZdpKDCprAg",
    "CAADAQAD6gAD5HbMCJ4ew6VyLPk6Ag",
    "CAADAQAD0QAD5HbMCJdvFsuxxm1VAg",
    "CAADAQAD0AAD5HbMCH5LHwNyjvn3Ag",
    // hearts
    "CAADAQAD2gAD5HbMCLoeEgLe_XhHAg",
    "CAADAQAD0wAD5HbMCNEORf_Qk3mNAg",
    "CAADAQAD1AAD5HbMCEBTQJqM1OS0Ag",
    "CAADAQAD1QAD5HbMCN0r5S7Vzvw9Ag",
    "CAADAQAD1gAD5HbMCFydqApE5I2gAg",
    "CAADAQAD1wAD5HbMCKIAAcrp0RqVBwI",
    "CAADAQAD7QAD5HbMCFSQt47VQD9uAg",
    "CAADAQAD2AAD5HbMCCA4NZEElkw9Ag",
    "CAADAQAD2QAD5HbMCDcDK4V-WsoPAg",
    "CAADAQAD0gAD5HbMCNqOiUvHEuBnAg",
    "CAADAQAD2wAD5HbMCA0MlnkKfXmJAg",
    "CAADAQAD3QAD5HbMCFI6TbxOuszmAg",
    "CAADAQAD3AAD5HbMCKNB18Fw6JkBAg",

    // spades
    "CAADAQAD5gAD5HbMCODNi4Sm65JcAg",
    "CAADAQAD3wAD5HbMCA14S09tM6klAg",
    "CAADAQAD4AAD5HbMCDSEw4QWTNqsAg",
    "CAADAQAD4QAD5HbMCEbbMWfAZ5mGAg",
    "CAADAQAD4gAD5HbMCBfI6qVgKltIAg",
    "CAADAQAD4wAD5HbMCC0IDwKpKiCeAg",
    "CAADAQAD5AAD5HbMCPB5UUr8hTnNAg",
    "CAADAQAD5QAD5HbMCG3CHfyX3dp-Ag",
    "CAADAQAD6wAD5HbMCCscM_iPRXLvAg",
    "CAADAQAD3gAD5HbMCA90sijPRcDjAg",
    "CAADAQAD5wAD5HbMCNFUlZqdX6igAg",
    "CAADAQAD6QAD5HbMCMydH74L6egLAg",
    "CAADAQAD6AAD5HbMCBDlWQjpko99Ag"
];

// index conversions
module.exports.card_file_id_value = {
    ace  : 0, two    : 1, three : 2, four : 3, five : 4,
    six  : 5, seven  : 6, eight : 7, nine : 8, ten  : 9,
    jack : 10, queen : 11, king : 12
};
module.exports.card_file_id_suit = {
    clubs : 0, diamonds : 13, hearts : 26, spades : 39
};

module.exports.card_file_id_index = {
    clubs : 0, diamonds : 13, hearts : 26, spades : 39, ace : 0,
    2 : 1, 3 : 2, 4 : 3, 5 : 4, 6 : 5, 7 : 6, 8 : 7, 9 : 8, 10 : 9,
    jack : 10, queen : 11, king : 12
};

// return a shuffledDeck of cards
module.exports.shuffledDeck = (deck) => {
    for (let i = deck.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

module.exports.isFaceCard = function (ind) {
    const val = ind % 13;
    return val == 0 || val == 12 || val == 11 || val == 10;
}

module.exports.cardName(index) {
    const vals = [ "ace", "two", "three", "four", "five", "six", "seven",
                   "eight", "nine", "ten", "jack", "queen", "king" ];
    const suits = [ "clubs", "diamonds", "hearts", "spades" ];

    return `${vals[index % 13]} of ${suits[Math.floor(index / 13)]}`;
}
