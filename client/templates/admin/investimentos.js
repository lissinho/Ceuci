Template.investimentos.helpers({
    investimentos() {
        return Investimentos.find().fetch().map(function(i){
            return {
                investimento: i,
                fundo: Fundos.findOne(i.fundo_id),
                pessoa: Pessoas.findOne(i.pessoa_id)
            }
        })
    }
});

