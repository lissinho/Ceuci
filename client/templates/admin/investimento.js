Template.investimento.onCreated(function(){
    this.tickers = new ReactiveVar([]);
    this.pessoa = new ReactiveVar();

    const handleFetchTickers = (error, data) => {
        handleGeneralError(error);
        this.tickers.set(data);
    }

    // Meteor.call('exchanges.fetchTickers', function (error, data) {
    //     handleFetchTickers(error, data);
    // })
})

Template.investimento.helpers({
    tipoFormulario() {
        return FlowRouter.getParam("_id") == undefined
                    ? "insert"
                    : "update";
    },
    documento() {
        var doc = Investimentos.findOne({ _id: FlowRouter.getParam("_id") });
        return doc;
    },
    fundosOptions() {
        return Fundos.find().map(function(i){
            return { label: i.nome, value: i._id }
        });
    },
    fundoSelected(id) {
        return (id == AutoForm.getFieldValue('fundo_id') || id == FlowRouter.getParam("fundo_id"))
                    ? 'selected'
                    : null;
    },
    pessoasOptions() {
        return Pessoas.find().map(function(i){
            return { label: i.nome, value: i._id }
        });
    },
    pessoaSelected(id) {
        return (id == AutoForm.getFieldValue('pessoa_id') || id == FlowRouter.getParam("pessoa_id"))
                    ? 'selected'
                    : null;
    },
    tickers() {
        return Template.instance().tickers.get();
    },
})

Template.investimento.events({
    'change .selectExchange': function (event, instance) {
        var exchange = $(event.target).val()
        var selectMarket = $('[data-exchange="' + event.target.name + '"]')
        $(selectMarket).hide()
        Meteor.call(exchange + '.loadMarkets', function (error, data) {
            $(selectMarket)
                .find('option')
                .remove()
                .end()

            $(selectMarket)
                .append($("<option></option>")
                            .text('(Selecione)')); 

            $.each(data, function(i) {   
                $(selectMarket)
                    .append($("<option></option>")
                               .attr("value",i)
                               .text(i)); 
           });
           $(selectMarket).show()
        })
    },
    'change .selectMarket': function (event, instance) {
        var symbol = $(event.target).val()
        var exchange = $('[name="' + $(event.target).data('exchange') + '"]').val()
        var sel = '[data-market="' + event.target.name + '"]'
        Meteor.call(exchange + '.fetchTicker', symbol, function (error, data) {
            $("input[name$='high']" + sel).val(data.high)
            $("input[name$='low']" + sel).val(data.low)
            $("input[name$='last']" + sel).val(data.last)
        })
    }    
})

AutoForm.addHooks('formInvestimento', {
    onSuccess: function (formType, result) {
        FlowRouter.go("/admin/investimentos");
    },
    onError: function (formType, error) {
        toastr.error(error);
    }
  });

