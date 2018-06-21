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

    'use strict';
    const ccxt = require('ccxt');

    (async function () {

        let foxbit = new ccxt.foxbit();

        let mercadobitcoin = new ccxt.mercado();

        let binance = new ccxt.binance();

        let hitbtc = new ccxt.hitbtc2();
        
        let livecoin = new ccxt.livecoin();

        let bitfinex = new ccxt.bitfinex2();

        let yobit = new ccxt.yobit();


        Meteor.methods({

            // ALL EXCHANGES
            // 'exchanges.markets'() {
            //     return exchangesMarkets;
            // },
            async 'exchanges.markets'(){
                // var c1 = await hitbtc.loadMarkets();
                var c1 = await yobit.loadMarkets();
                
                return Object.keys(c1);
            },
            async 'exchanges.currencies'(){
                var c1 = await yobit.currencies;

                return Object.keys(c1);
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
                                resp.push({ 'name': 'BRL', 'value': bal.Responses[0][4].BRL / 1e8 });
                                resp.push({ 'name': 'BRL_locked', 'value': bal.Responses[0][4].BRL_locked / 1e8 });
                                resp.push({ 'name': 'BTC', 'value': bal.Responses[0][4].BTC / 1e8 });
                                resp.push({ 'name': 'BTC_locked', 'value': bal.Responses[0][4].BTC_locked / 1e8 });
                        
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

        });

    })();


});
