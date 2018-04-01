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
});

AutoForm.addHooks('formInvestimento', {
    onSuccess: function (formType, result) {
        FlowRouter.go("/admin/investimentos");
    },
    onError: function (formType, error) {
        toastr.error(error);
    }
  });

