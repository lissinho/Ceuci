Template.bitfinex.onCreated(function () {
    this.markets = new ReactiveVar();
    this.selectedMarket = new ReactiveVar();

    this.lastTicker = new ReactiveVar();
    this.lastTrades = new ReactiveVar();
    this.orderBook = new ReactiveVar();

    this.balance = new ReactiveVar();
    this.myTrades = new ReactiveVar();

    const handleLoadMarkets = (error, data) => {
        handleGeneralError(error);
        this.markets.set(data);
        this.selectedMarket.set(Object.keys(data)[0]);

        this.loadSelectedMarketInfo();
    }

    Meteor.call('bitfinex.loadMarkets', function (error, data) {
        handleLoadMarkets(error, data);
    })

    const handleFetchTicker = (error, data) => {
        handleGeneralError(error);
        this.lastTicker.set(data);
    }

    const handleFetchTrades = (error, data) => {
        handleGeneralError(error);
        this.lastTrades.set(data);
    }

    const handleOrderBook = (error, data) => {
        handleGeneralError(error);
        this.orderBook.set(data);
    }

    const handleBalance = (error, data) => {
        handleGeneralError(error);
        this.balance.set(data);
    }

    const handleMyTrades = (error, data) => {
        handleGeneralError(error);
        this.myTrades.set(data);
    }

    this.loadSelectedMarketInfo = () => {
        Meteor.call('bitfinex.fetchTrades', this.selectedMarket.get(), function (error, data) {
            handleFetchTrades(error, data);
        });
        Meteor.call('bitfinex.fetchTicker', this.selectedMarket.get(), function (error, data) {
            handleFetchTicker(error, data);
        });
        Meteor.call('bitfinex.fetchOrderBook', this.selectedMarket.get(), function (error, data) {
            handleOrderBook(error, data);
        });

        Meteor.call('bitfinex.fetchBalance', function (error, data) {
           console.log(data);
           handleBalance(error, data);
        });
    }

});

Template.bitfinex.helpers({
    markets() {
        return Template.instance().markets.get();
    },
    marketsKeys() {
        var obj = Template.instance().markets.get();
        return obj == null ? null : Object.keys(obj);
    },
    lastTicker() {
        return Template.instance().lastTicker.get();
    },
    lastTrades() {
        return Template.instance().lastTrades.get();
    },
    orderBook() {
        return Template.instance().orderBook.get();
    },

    naoTemApiKey() {
        return Template.instance().balance.get() == null;
    },
    fundosOptions() {
        return Fundos.find().map(function(i){
            return { label: i.nome, value: i._id }
        });
    },

    balances() {
       return Template.instance().balance.get();
    },
})

Template.bitfinex.events({
    'change #selectSymbol': function (event, instance) {
        Template.instance().selectedMarket.set($('#selectSymbol').val());
        Template.instance().loadSelectedMarketInfo();
    },
    'click #btnMostrarConfigApi': function (event, instance) {
        $('#alertaConfigApi').hide();
        $('#configApi').show();
    },
    'click #btnConfigApi': function (event, instance) {
        Meteor.call('exchanges.registerApi', $('#fundo_id').val(), 'bitfinex', $('#apikey').val(), $('#apisecret').val(), function(error, data){
            handleGeneralError(error);
            if (error == null){
                location.reload();
            }
        });
    }
})