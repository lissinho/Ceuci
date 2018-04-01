import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './routes.js';
import './helpers.js';

// languages-management
T9n.setLanguage('pt');
TAPi18n.setLanguage("pt-BR");

Meteor.subscribe("fundos");
Meteor.subscribe("pessoas");
Meteor.subscribe("investimentos");

let allMarkets = new ReactiveVar(['BTC/BRL'])
let allCurrencies = new ReactiveVar(['BRL'])
let generalErrors = new ReactiveVar([]);

handleGeneralError = function (error) {
    if (error) {
        const errors = generalErrors.get();
        errors.push(error);
        generalErrors.set(errors);
    }
}

handleLoadAllMarkets = (error, data) => {
    handleGeneralError(error)
    var marks = allMarkets.get()
    data.map(function(i){
        if (!marks.some(function(y){ return (y == i) })){
            marks.push(i)
        }
    })
    marks.sort()
    allMarkets.set(marks)
}

handleLoadAllCurrencies = (error, data) => {
    handleGeneralError(error)
    var curs = allCurrencies.get()
    data.map(function(i){
        if (!curs.some(function(y){ return (y == i) })){
            curs.push(i)
        }
    })
    curs.sort()
    allCurrencies.set(curs)
}

Meteor.startup(() => {

    Meteor.call('exchanges.markets', function (error, data) {
        handleLoadAllMarkets(error, data);
    })

    Meteor.call('exchanges.currencies', function (error, data) {
        handleLoadAllCurrencies(error, data);
    })

})

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

