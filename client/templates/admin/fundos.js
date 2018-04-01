Template.fundos.onCreated(function() {
    this.procurarFundo = new ReactiveVar();
});

Template.fundos.helpers({
    fundos() {
        return Fundos.find({ nome: new RegExp(Template.instance().procurarFundo.get(), "i") }).fetch();
    }
});

Template.fundos.events({
    'keyup #procurarFundo': function (event, instance) {
        Template.instance().procurarFundo.set($(event.currentTarget).val());
    }
});
