import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './routes.js'
import './helpers.js'

// languages-management
T9n.setLanguage('pt')
TAPi18n.setLanguage("pt-BR")

Meteor.subscribe("fundos")
Meteor.subscribe("pessoas")
Meteor.subscribe("investimentos")
Meteor.subscribe("relatorios")

let allExchanges = new ReactiveVar([])
let allMarkets = new ReactiveVar([])
let allCurrencies = new ReactiveVar([])
let generalErrors = new ReactiveVar([])

handleGeneralError = function (error) {
    if (error) {
        const errors = generalErrors.get();
        errors.push(error);
        generalErrors.set(errors);
    }
}

handleLoadAllMarkets = (error, data) => {
    handleGeneralError(error)
    allMarkets.set(data)
}

getAllMarkets = () => {
    return allMarkets.get()
}

handleLoadAllCurrencies = (error, data) => {
    handleGeneralError(error)
    allCurrencies.set(data)
}

Meteor.startup(() => {

    Meteor.call('exchanges', function (error, data) {
        allExchanges.set(data);
    })

    Meteor.call('exchanges.markets', function (error, data) {
        handleLoadAllMarkets(error, data);
    })

    Meteor.call('exchanges.currencies', function (error, data) {
        handleLoadAllCurrencies(error, data);
    })

})

Handlebars.registerHelper("allExchangesOptions", function () {
    return allExchanges.get().map(function(i){
        return { label: i, value: i}
    });
});

Handlebars.registerHelper("allMarketsOptions", function () {
    return allMarkets.get().map(function(i){
        return { label: i, value: i}
    });
});

Handlebars.registerHelper("allCurrenciesOptions", function () {
    return allCurrencies.get().map(function(i){
        return { label: i, value: i}
    });
});

Handlebars.registerHelper("generalErrors", function () {
    return generalErrors.get();
});

