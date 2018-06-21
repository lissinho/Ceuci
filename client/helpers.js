
Handlebars.registerHelper("unixdatetime", function (date) {
    moment.locale(TAPi18n.getLanguage());
    return moment.unix(date).format("L LT")
})

Handlebars.registerHelper("formatDate", function (date) {
    moment.locale(TAPi18n.getLanguage())
    return moment(date).format("L")
})

Handlebars.registerHelper("formatDateTime", function (date) {
    moment.locale(TAPi18n.getLanguage())
    return moment(date).format("L LT")
})

Handlebars.registerHelper("formatTime", function (date) {
    moment.locale(TAPi18n.getLanguage())
    return moment(date).format("LT")
})

Handlebars.registerHelper("formatNumber", function(number) {
    return parseFloat(Math.round(number * 100000000) / 100000000).toFixed(8);
})

Handlebars.registerHelper("formatMoney", function(number) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(2);
})

Handlebars.registerHelper("allExchangesOptions", function () {
    return allExchanges.get().map(function(i){
        return { label: i, value: i}
    })
})

Handlebars.registerHelper("allMarketsOptions", function () {
    return allMarkets.get().map(function(i){
        return { label: i, value: i}
    })
})

Handlebars.registerHelper("allCurrenciesOptions", function () {
    return allCurrencies.get().map(function(i){
        return { label: i, value: i}
    })
})

Handlebars.registerHelper("generalErrors", function () {
    return generalErrors.get();
})

