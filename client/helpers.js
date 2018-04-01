
Handlebars.registerHelper("unixdatetime", function (date) {
    moment.locale(TAPi18n.getLanguage());
    return moment.unix(date).format("L LT");
});

Handlebars.registerHelper("formatDate", function (date) {
    moment.locale(TAPi18n.getLanguage());
    return moment(date).format("L");
});

Handlebars.registerHelper("formatDateTime", function (date) {
    moment.locale(TAPi18n.getLanguage());
    return moment(date).format("L LT");
});

Handlebars.registerHelper("formatTime", function (date) {
    moment.locale(TAPi18n.getLanguage());
    return moment(date).format("LT");
});
