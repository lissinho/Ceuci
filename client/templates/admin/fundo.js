Template.fundo.helpers({
    tipoFormulario() {
        return FlowRouter.getParam("_id") == undefined
                    ? "insert"
                    : "update";
    },
    documento() {
        return Fundos.findOne({ _id: FlowRouter.getParam("_id") });
    }
});

Template.fundo.events({
    'change .selectExchange': function (event, instance) {
        var exchange = $(event.target).val()
        var selectMarket = $('[data-exchange="' + event.target.name + '"]')
        $(selectMarket).hide()
        Meteor.call(exchange + '.loadMarkets', function (error, data) {
            $(selectMarket)
                .find('option')
                .remove()
                .end()

            var pares = Object.keys(data)
            pares.sort(function (a, b) {
                return (a > b) ? 1 : -1
            })

            pares.map(function(i) {   
                $(selectMarket)
                    .append($("<option></option>")
                               .attr("value",i)
                               .text(i)); 
           })
           $(selectMarket).show()
        })
    }
})

AutoForm.addHooks('formFundo', {
    onSuccess: function (formType, result) {
        FlowRouter.go("/admin/fundos");
    },
    onError: function (formType, error) {
        toastr.error(error);
    }
});
