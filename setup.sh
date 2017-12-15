#!/bin/sh

## This script automatically sets everything up for you
## to be run upon cloning the repo

## make everything runable
printf "marking scripts as runable..."
chmod +x *.sh
printf " done\n"

# if token wasn't exported by update.sh or steve.sh
# then we need to prompt the user for it
if [ ! -f /tmp/foo.txt ]; then
	# get bot token
	printf "Enter your Telegram Bot API token: "
	read POKEMON_TG_KEY

    # put token into config dir
    printf "inserting token into ur ~/.mew2"
    echo $POKEMON_TG_KEY > $HOME/.mew2/key
    printf "done\n"

fi

printf "making ~/.mew2..."
mkdir "$HOME/.mew2"
echo "done"


# install dependencies
echo "installing dependencies..."
npm install --save node-telegram-bot-api node-datetime open-exchange-rates money time pokemon
echo "installed dependencies"
