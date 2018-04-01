Template.foxbit.onCreated(function () {
    this.lastTicker = new ReactiveVar();
    this.lastTrades = new ReactiveVar();
    this.orderBook = new ReactiveVar();

    this.balance = new ReactiveVar();
    this.myTrades = new ReactiveVar();

    const handleFetchTicker = (error, data) => {
        handleGeneralError(error);
        this.lastTicker.set(data);
    }

    Meteor.call('foxbit.fetchTicker', function (error, data) {
        handleFetchTicker(error, data);
    });

    const handleFetchTrades = (error, data) => {
        handleGeneralError(error);
        this.lastTrades.set(data);
    }

    Meteor.call('foxbit.fetchTrades', function (error, data) {
        handleFetchTrades(error, data);
    });

    const handleOrderBook = (error, data) => {
        handleGeneralError(error);
        this.orderBook.set(data);
    }

    Meteor.call('foxbit.fetchOrderBook', function (error, data) {
        handleOrderBook(error, data);
    });

    const handleBalance = (error, data) => {
        handleGeneralError(error);
        this.balance.set(data);
    }

    Meteor.call('foxbit.fetchBalance', function (error, data) {
        handleBalance(error, data);
    });

    const handleMyTrades = (error, data) => {
        handleGeneralError(error);
        this.myTrades.set(data);
    }

    // Meteor.call('foxbit.fetchMyTrades', function (error, data) {
    //     handleMyTrades(error, data);
    // });


});

Template.foxbit.helpers({
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


Template.foxbit.events({
    'click #btnMostrarConfigApi': function (event, instance) {
        $('#alertaConfigApi').hide();
        $('#configApi').show();
    },
    'click #btnConfigApi': function (event, instance) {
        Meteor.call('exchanges.registerApi', $('#fundo_id').val(), 'foxbit', $('#apikey').val(), $('#apisecret').val(), function(error, data){
            handleGeneralError(error);
            if (error == null){
                location.reload();
            }
        });
    }
})