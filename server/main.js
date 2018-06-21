import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    Meteor.publish("fundos", function () {
        return Fundos.find();
    });

    Meteor.publish("pessoas", function () {
        return Pessoas.find();
    });

    Meteor.publish("investimentos", function () {
        return Investimentos.find();
    });

    Meteor.publish("relatorios", function () {
        return Relatorios.find();
    });

    'use strict';
    const ccxt = require('ccxt');

    (async function () {

        let exchanges = []
        var markets = []
        var currencies = []

        let foxbit = new ccxt.foxbit();
        exchanges.push('foxbit')

        let mercadobitcoin = new ccxt.mercado();
        exchanges.push('mercadobitcoin')

        let binance = new ccxt.binance();
        exchanges.push('binance')

        let hitbtc = new ccxt.hitbtc2();
        exchanges.push('hitbtc')
        
        let livecoin = new ccxt.livecoin();
        exchanges.push('livecoin')

        let bitfinex = new ccxt.bitfinex2();
        exchanges.push('bitfinex')

        let yobit = new ccxt.yobit();
        exchanges.push('yobit')

        exchanges.push('bitcointrade')

        Meteor.methods({

            // ALL EXCHANGES
            // 'exchanges.markets'() {
            //     return exchangesMarkets;
            // },
            'exchanges'() {
                return exchanges
            },
            async 'exchanges.markets'(){
                if (markets.length > 0) {
                    return markets
                }
                var excs = []
                excs.push(await hitbtc.loadMarkets())
                // excs.push(await yobit.loadMarkets())
                excs.push(await binance.loadMarkets())
                excs.push(await mercadobitcoin.loadMarkets())

                excs.forEach(e => {
                    Object.keys(e).map(function(i){
                        if (!markets.some(function(y){ return (y == i) })){
                            markets.push(i)
                        }
                    })    
                })
                markets.sort()
                
                return markets;
            },
            async 'exchanges.currencies'(){
                if (currencies.length > 0) {
                    return currencies
                }

                var excs = []
                excs.push(await hitbtc.currencies)
                // excs.push(await yobit.currencies)
                excs.push(await binance.currencies)
                excs.push(await mercadobitcoin.currencies)

                excs.forEach(e => {
                    Object.keys(e).map(function(i){
                        if (!currencies.some(function(y){ return (y == i) })){
                            currencies.push(i)
                        }
                    })    
                })
                currencies.sort()
                
                return currencies;
            },
            async 'exchanges.fetchTickers'(){
                var tickers = [];
                
                // var e1 = await hitbtc.fetchTickers();

                // if (e1 != null){
                //     tickers = Object.values(e1).map(function(i){
                //         return {
                //             source: 'hitbtc',
                //             datetime: i.datetime,
                //             symbol: i.symbol,
                //             last: i.last,
                //             high: i.high,
                //             low: i.low
                //         }
                //     });
                // }

                return tickers;
            },
            'exchanges.registerApi'(fundo_id, exchange, apiKey, apiSecret) {
                var lista = [];
                var traderExistente = Traders.findOne({ user_id: Meteor.userId(), fundo_id: fundo_id });
                if (traderExistente != null) {
                    traderExistente.apiKeys.forEach(function (i) {
                        if (i.exchange != exchange) {
                            lista.push(i);
                        }
                    })
                }
                lista.push({
                    'exchange': exchange,
                    'key': apiKey,
                    'secret': apiSecret
                });
                Traders.upsert({ user_id: Meteor.userId(), fundo_id: fundo_id },
                    { $set: { apiKeys: lista }});
            },
            // async 'exchanges.fetchBalance'(exchange, fundo_id){

            // },

            // FOXBIT
            'foxbit.loadMarkets'() {
                return {'BTC/BRL': {}}
            },
            async 'foxbit.fetchTicker'() {
                return await foxbit.fetchTicker('BTC/BRL');
            },
            async 'foxbit.fetchTrades'(since) {
                return await foxbit.publicGetCurrencyTrades({ currency: 'BRL', limit: 30, since: since });
            },
            async 'foxbit.fetchOrderBook'() {
                return await foxbit.fetchOrderBook('BTC/BRL');
            },
            async 'foxbit.fetchBalanceANTIGO'() {
                return await foxbit.fetchBalance();
            },
            async 'foxbit.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'foxbit'){
                            let foxbitTrader = new ccxt.foxbit({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await foxbitTrader.fetchBalance();

                                var resp = [];
                                resp.push({ 'token': 'BRL', 'value': bal.Responses[0][4].BRL / 1e8 });
                                resp.push({ 'token': 'BRL_locked', 'value': bal.Responses[0][4].BRL_locked / 1e8 });
                                resp.push({ 'token': 'BTC', 'value': bal.Responses[0][4].BTC / 1e8 });
                                resp.push({ 'token': 'BTC_locked', 'value': bal.Responses[0][4].BTC_locked / 1e8 });
                        
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('foxbit.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },
            async 'foxbit.fetchMyTrades'(symbol) {
                //var ledger = await foxbit.publicGetRequestLedger();
                //console.log(ledger);
                //return ledger;
                return null;
            },

            // MERCADOBITCOIN
            async 'mercadobitcoin.loadMarkets'() {
                return await mercadobitcoin.loadMarkets();
            },
            async 'mercadobitcoin.fetchTicker'(symbol) {
                return await mercadobitcoin.fetchTicker(symbol);
            },
            async 'mercadobitcoin.fetchTrades'(symbol) {
                return await mercadobitcoin.fetchTrades(symbol)
            },
            async 'mercadobitcoin.fetchOrderBook'(symbol) {
                return await mercadobitcoin.fetchOrderBook(symbol);
            },
            async 'mercadobitcoin.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'mercadobitcoin'){
                            let mercadobitcoinTrader = new ccxt.mercado({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await mercadobitcoinTrader.fetchBalance();
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: bal
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('mercadobitcoin.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },



            // BINANCE
            async 'binance.loadMarkets'() {
                return await binance.loadMarkets();
            },
            async 'binance.fetchTicker'(symbol) {
                return await binance.fetchTicker(symbol);
            },
            async 'binance.fetchTrades'(symbol) {
                return await binance.fetchTrades(symbol)
            },
            async 'binance.fetchOrderBook'(symbol) {
                return await binance.fetchOrderBook(symbol);
            },
            async 'binance.fetchBalanceANTIGO'() {
                return await binance.fetchBalance();
            },
            async 'binance.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'binance'){
                            let binanceTrader = new ccxt.binance({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await binanceTrader.fetchBalance();

                                var resp = Object.keys(bal).filter(function(i){
                                    return (bal.total[i] != null);
                                }).map(function(i){
                                    return {
                                        token: i,
                                        value: bal.total[i]
                                    }
                                });

                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp,
                                    info: bal.info
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('binance.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },
            // async 'binance.fetchMyTrades'(symbol) {
            //     return await binance.fetchMyTrades(symbol);
            // },

            // HITBTC
            async 'hitbtc.loadMarkets'() {
                return await hitbtc.loadMarkets();
            },
            async 'hitbtc.fetchTicker'(symbol) {
                return await hitbtc.fetchTicker(symbol);
            },
            async 'hitbtc.fetchTrades'(symbol) {
                return await hitbtc.fetchTrades(symbol)
            },
            async 'hitbtc.fetchOrderBook'(symbol) {
                return await hitbtc.fetchOrderBook(symbol);
            },
            async 'hitbtc.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'hitbtc'){
                            let hitbtcTrader = new ccxt.hitbtc2({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await hitbtcTrader.fetchBalance();
                                var resp = Object.keys(bal).filter(function(i){
                                    return (bal.total[i] != null);
                                }).map(function(i){
                                    return {
                                        token: i,
                                        value: bal.total[i]
                                    }
                                });

                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('hitbtc.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },

            // LIVECOIN
            async 'livecoin.loadMarkets'() {
                return await livecoin.loadMarkets();
            },
            async 'livecoin.fetchTicker'(symbol) {
                return await livecoin.fetchTicker(symbol);
            },
            async 'livecoin.fetchTrades'(symbol) {
                return await livecoin.fetchTrades(symbol)
            },
            async 'livecoin.fetchOrderBook'(symbol) {
                return await livecoin.fetchOrderBook(symbol);
            },
            async 'livecoin.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'livecoin'){
                            let livecoinTrader = new ccxt.livecoin({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await livecoinTrader.fetchBalance();
                                var resp = Object.keys(bal).filter(function(i){
                                    return (bal.total[i] != null);
                                }).map(function(i){
                                    return {
                                        token: i,
                                        value: bal.total[i]
                                    }
                                });
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('livecoin.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },

            // BITFINEX
            async 'bitfinex.loadMarkets'() {
                return await bitfinex.loadMarkets();
            },
            async 'bitfinex.fetchTicker'(symbol) {
                return await bitfinex.fetchTicker(symbol);
            },
            async 'bitfinex.fetchTrades'(symbol) {
                return await bitfinex.fetchTrades(symbol)
            },
            async 'bitfinex.fetchOrderBook'(symbol) {
                return await bitfinex.fetchOrderBook(symbol);
            },
            async 'bitfinex.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'bitfinex'){
                            let bitfinexTrader = new ccxt.bitfinex({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await bitfinexTrader.fetchBalance();
                                var resp = Object.keys(bal).filter(function(i){
                                    return (bal.total[i] != null);
                                }).map(function(i){
                                    return {
                                        token: i,
                                        value: bal.total[i]
                                    }
                                });
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('bitfinex.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },

            // YOBIT
            async 'yobit.loadMarkets'() {
                return await yobit.loadMarkets();
            },
            async 'yobit.fetchTicker'(symbol) {
                return await yobit.fetchTicker(symbol);
            },
            async 'yobit.fetchTrades'(symbol) {
                return await yobit.fetchTrades(symbol)
            },
            async 'yobit.fetchOrderBook'(symbol) {
                return await yobit.fetchOrderBook(symbol);
            },
            async 'yobit.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'yobit'){
                            let yobitTrader = new ccxt.yobit({
                                apiKey: element.key,
                                secret: element.secret,
                            })
                            try {
                                let bal = await yobitTrader.fetchBalance();
                                var resp = Object.keys(bal).filter(function(i){
                                    return (bal.total[i] != null);
                                }).map(function(i){
                                    return {
                                        token: i,
                                        value: bal.total[i]
                                    }
                                });
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: resp
                                })                                
                            } catch (error) {
                                throw new Meteor.Error('yobit.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },


            // BitcoinTrade
            async 'bitcointrade.loadMarkets'() {
                return {
                    "BTC/BRL": {},
                    "ETH/BRL": {}
                }
            },
            async 'bitcointrade.fetchTicker'(symbol) {
                var currencies = symbol.split("/")
                var result = HTTP.get('https://api.bitcointrade.com.br/v1/public/' + currencies[0] + '/ticker')
                return result.data.data
            },
            async 'bitcointrade.fetchTrades'(symbol) {
                var currencies = symbol.split("/")
                var result = HTTP.get('https://api.bitcointrade.com.br/v1/public/' + currencies[0] + '/trades', {
                    params: {
                        start_time: moment().subtract(30,'days').format(),
                        end_time: moment().add(1, 'days').format(),
                        page_size: 100,
                        current_page: 1
                    }
                })
                return result.data.data.trades
            },
            async 'bitcointrade.fetchOrderBook'(symbol) {
                var currencies = symbol.split("/")
                var result = HTTP.get('https://api.bitcointrade.com.br/v1/public/' + currencies[0] + '/orders')
                return result.data.data
            },
            async 'bitcointrade.fetchBalance'() {
                var trader = Traders.findOne({ user_id: Meteor.userId() });
                if (trader != null) {
                    var lista = [];
                    for (let index = 0; index < trader.apiKeys.length; index++) {
                        const element = trader.apiKeys[index];
                        if (element.exchange === 'bitcointrade'){
                            try {
                                var result = HTTP.get('https://api.bitcointrade.com.br/v1/wallets/balance', {
                                    headers: {
                                        Authorization: 'ApiToken ' + element.key
                                    }
                                })
                                if (result == undefined) {
                                    return
                                }
                                lista.push({
                                    fundo: Fundos.findOne(trader.fundo_id),
                                    balance: result.data.data.map(x => {
                                        return {
                                            token: x.currency_code,
                                            value: x.available_amount,
                                            locked: x.locked_amount
                                        }
                                    })
                                })             
                            } catch (error) {
                                throw new Meteor.Error('bitcointrade.fetchBalance.error', error.message);   
                            }
                        }
                    }
                    return lista.length > 0 ? lista : null;
                }
                return null;
            },

        });

    })();


});
