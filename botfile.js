const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const SteamCommunity = require('steamcommunity');
const TradeOfferManager = require ('steam-tradeoffer-manager');
const TeamFortress2 = require('tf2');

const Prices = require('./prices.json');
const config = require('./config.json');

const client = new SteamUser();
const tf2 = new TeamFortress2(client);
const community = new SteamCommunity();
const manager = new TradeOfferManager ({
	steam: client,
	community: community,
	language: 'en'
});

const logOnOptions = {
	accountName: config.username,
	password: config.password,
	twoFactorCode: SteamTotp.generateAuthCode(config.sharedSecret)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
	console.log('Logged into Steam!');
	client.setPersona(SteamUser.Steam.EPersonaState.LookingToTrade);
	client.gamesPlayed(440); /* 440 is TF2 if you want to play csgo you need to have it in your library and change 440 to 780. 
                              Works for any steam game. If its free you can just change the number, if its not free you need to
                              have it in your library.
                              The number can be found here: http://store.steampowered.com/app/440/ */
});
