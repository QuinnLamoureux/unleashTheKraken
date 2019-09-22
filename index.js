const Discord = require('discord.js');
const { StreamClient } = require("cw-sdk-node");
const { prefix, token, KrakenPubKey, KrakenSecretKey } = require('./config.json');
const client = new Discord.Client();
const kraken = new StreamClient({
  creds: {
    apiKey: KrakenPubKey,
    secretKey: KrakenSecretKey
  },
  subscriptions: [
    "markets:*:trades", // monitor all trades
  ],
});
let BTCprice;
let ETHprice;
let LTCprice;

kraken.onMarketUpdate(marketData => { //live update the price of btc, eth, and ltc every time a crypto-usd trade happens with them
  switch(marketData.market.currencyPairID) {
  case '138': //ltc usd
  LTCprice = marketData.trades[0].price
    break;
  case '9': //btc usd
    BTCprice = marketData.trades[0].price
    break;
  case '125': //eth usd
    ETHprice = marketData.trades[0].price
    break;
  }
});

client.on('message', message => { //respond to user input, and give price of requested coin in usd

  if(message.content.startsWith(prefix)){
    switch(message.content.substring(7)) {
    case 'BTC':
      message.channel.send("One Bitcoin is currently " + new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(BTCprice))
      break;
    case 'LTC':
      message.channel.send("One Litecoin is currently " + new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(LTCprice))
      break;
    case 'ETH':
      message.channel.send("One Etherium is currently " + new Intl.NumberFormat('us-US', { style: 'currency', currency: 'USD' }).format(ETHprice))
      break;
    default:
      message.channel.send("Type 'kraken [ETH/BTC/LTC]' to get the price in USD.");
   }
  }
})



client.login(token);
kraken.connect();
