import Chart from 'Chart.js';

let relatorioFundoComposicao = new ReactiveVar([]);
let relatorioFundoTotal = new ReactiveVar();

Template.relatorio.onRendered(function(){

    // certifica-se que todo os processamentos de renderizacao do DOM foram finalizados
    _.defer(function(){
        var ctx1 = document.getElementById('fundoDoughnut').getContext('2d');
        var fundoDoughnutChart = new Chart(ctx1, {
            type: 'doughnut',
        });

        Deps.autorun(function () {
            // atualiza os dados do grafico reactively
            var investimentos = Investimentos.find({ fundo_id: FlowRouter.getParam("fundo_id") })

            var valores = []
            var labels = []
            var cores = []
            var total = 0

            var composicao = []

            investimentos.forEach((i) => {
                var pessoa = Pessoas.findOne( i.pessoa_id );

                // normaliza os valores
                var val = i.valor
                if (i.currency != 'BTC'){
                    var found = i.tickers.find(function(y){
                        return y.symbol == 'BTC/' + i.currency || i.currency + '/BTC'
                    })
                    if (found == null) {
                        // handleGeneralError('Não foi possível normalizar o valor do investimento ' + i._id);
                    } else {
                        if (found.symbol == 'BTC/' + i.currency){
                            val = i.valor / found.last
                        } else {
                            val = found.last / i.valor
                        }
                    }
                }
                var found = labels.indexOf(pessoa.nome);
                if (found >= 0){
                    valores[found] += val
                } else {
                    labels.push(pessoa.nome)
                    valores.push(val)
                    cores.push('#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6))    
                }
                total += val

                composicao.push({
                    investimento: i,
                    pessoa: pessoa,
                    valor: val
                })
            })

            fundoDoughnutChart.data.datasets = [{ data: valores, backgroundColor: cores }]
            fundoDoughnutChart.data.labels = labels

            fundoDoughnutChart.update()

            relatorioFundoTotal.set(total)
            relatorioFundoComposicao.set(composicao)
        });
    });
})

Template.relatorio.helpers({
    fundoNome() {
        if (FlowRouter.getParam("fundo_id") == null) {
            return null
        } else {
            var fundo = Fundos.findOne(FlowRouter.getParam("fundo_id"))
            return fundo.nome    
        }
    },
    fundoTotal() {
        return relatorioFundoTotal.get()
    },
    investimentos() {
        return relatorioFundoComposicao.get().map(function(i){
            return {
                investimento: i.investimento,
                pessoa: i.pessoa,
                valor: i.valor,
                percentual: (i.valor / relatorioFundoTotal.get()) * 100
            }
        })
    },
})