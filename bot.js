const TelegramBot = require('node-telegram-bot-api');
var http = require('http');
var request = require('sync-request');

const getToken = (function () {
   const token = process.env.TELEGRAM_TOKEN;
    return function () {
        return token;
    };
})();

//사용자 id 저장
var g_idSet = new Set();
//스팀 가격 주소
var g_upbitSteem = "https://crix-api-endpoint.upbit.com/v1/crix/candles/weeks?code=CRIX.UPBIT.KRW-STEEM";
// 정신승리를 위한 뻥튀기
var g_mentalVictory = 10;
// 앞에 문구
var g_pre = "우와 스팀가격이 ";
// 뒤에 문구
var g_after = "원 이에요!";

const bot = new TelegramBot(getToken(), { polling: true });

bot.on('message', (msg) => {
    if(g_idSet.has(msg.chat.id) == false) {
        g_idSet.add(msg.chat.id);
    }
    return;
});

setInterval(function() {
    let res = request('GET', g_upbitSteem);
    let steems = JSON.parse(res.getBody().toString("utf8"));

    steems.map(steem => {
        for(let id of g_idSet) {
            bot.sendMessage(id, g_pre + steem.tradePrice * g_mentalVictory + g_after);
        }
    });

}, process.env.INTERVAL);
 


