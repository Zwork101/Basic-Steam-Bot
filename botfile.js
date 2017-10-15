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

client.on('friendRelationship', (steamid, relationship) => {
    if (relationship === 2) {
        client.addFriend(steamid);
        client.chatMessage(steamid, config.addMessage);
    }
});

client.on('webSession', (sessionid, cookies) => {
	manager.setCookies(cookies);

	community.setCookies(cookies);
	community.startConfirmationChecker(20000, config.identitySecret);
});

function acceptOffer(offer) {
	offer.accept((err) => {
		community.checkConfirmations();
		console.log("we Accepted an offer")
		if (err) console.log("There was an error accepting the offer");
	});
}

function declineOffer(offer) {
	offer.decline((err) => {
		console.log("we Declined an offer")
		if (err) console.log("There was an error declining the offer");
	});
}

function processOffer(offer) {
	if (offer.isGlitched() || offer.state === 11) {
	console.log("Offer was unavailable, declining.");
	declineOffer(offer);
	} else if (offer.partner.getSteamID64() === config.ownerID) {
		acceptOffer(offer);
	} else {
		var ourItems = offer.itemsToGive;
		var theirItems = offer.itemsToReceive;
		var ourValue = 0;
		var theirValue = 0;
		for (var i in ourItems) {
			var item = ourItems[i].market_name;
			if(Prices[item]) {
				ourValue += Prices[item].sell
			} else {
				console.log("Invalid Value, declining.")
				ourValue+= 99999;
			}
		}
		for (var i in theirItems) {
			var item = theirItems[i].market_name;
			if(Prices[item]) {
				theirValue += Prices[item].buy;
			} else {
			console.log("Their item value was different.")
		}
	}
	console.log("Our value: "+ourValue);
	console.log("Their value: "+theirValue);
	
    if (ourValue <= theirValue) {
        acceptOffer(offer);
    } else {
        declineOffer(offer);
    }
    }
}

manager.on('newOffer', (offer) => {
	processOffer(offer);

});

/* manager.on('newOffer', (offer) => {
	if (offer.partner.getSteamID64() === config.ownerID) {
		acceptOffer(offer);
	} else {
		declineOffer(offer);
	}
}); */

// client.setOption("promptSteamGuardCode", false);

// Crafting soon

