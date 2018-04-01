Template.pessoas.onCreated(function() {
    this.pessoaSearch = new ReactiveVar();
});

Template.pessoas.helpers({
    pessoas() {
        return Pessoas.find({
            $or: [
                { nome: new RegExp(Template.instance().pessoaSearch.get(), "i") },
                { cpf: new RegExp(Template.instance().pessoaSearch.get(), "i") }
            ]
        }).fetch();
    }
});

Template.pessoas.events({
    'keyup #searchPessoa': function (event, instance) {
        Template.instance().pessoaSearch.set($(event.currentTarget).val());
    }
});
