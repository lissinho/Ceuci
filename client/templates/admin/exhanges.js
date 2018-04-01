Template.exchanges.helpers({
    mercados() {
        var lista = [];
        Meteor.call('exchanges.markets', function(error, data){
            lista = data;
        })
        console.log(lista);
        var keys = lista.map(function(i){
            return {
                exchange: i.exchange,
                markets: Object.keys(i.markets)
            }
        })
        return lista;
    }
})