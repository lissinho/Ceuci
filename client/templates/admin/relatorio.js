import Chart from 'Chart.js';

let relatorioFundoComposicao = new ReactiveVar([])
let relatorioFundoTotal = new ReactiveVar()
let relatorioIndices = new ReactiveVar([])
let relatorioBalanco = new ReactiveVar([])
let relatorioIndiceLoading = []

const loadRelatorioIndice = (exchange, market) => {
    if (relatorioIndiceLoading.some(function(i){ return i.exchange == exchange && i.market == market })){
        return
    }
    relatorioIndiceLoading.push({
        exchange: exchange,
        market: market
    })
    Meteor.call(exchange + '.fetchTicker', market, function (error, data) {
        handleGeneralError(error);
        let mrkt = relatorioIndices.get()
        // verifica se é o menor ou maior
        let pos = ""
        if (!mrkt.some(function(i){ return market == i.market && i.last < data.last  })) {
            pos = "<"
            mrkt.forEach(function(i){
                if (market == i.market && i.pos == "<") {
                    i.pos = ""
                }
            })
        }
        if (!mrkt.some(function(i){ return market == i.market && i.last > data.last  })) {
            pos = ">"
            mrkt.forEach(function(i){
                if (market == i.market && i.pos == ">") {
                    i.pos = ""
                }
            })
        }    
        mrkt.push({
            exchange: exchange,
            market: market,
            high: data.high,
            low: data.low,
            last: data.last,
            pos: pos,
            perc: 0
        })
        mrkt.sort(function (a, b) {
            return (a.market - b.market) || (a.last - b.last)
        })
        let m = ""
        let l = 0
        mrkt.forEach(function(i){
            if (m != i.market) {
                m = i.market
                l = i.last
            }
            i.perc = (1 - (l / i.last)) * 100
        })
        relatorioIndices.set(mrkt)
    })
}

const reloadRelatorioIndice = () => {
    let idx = relatorioIndiceLoading.slice()
    relatorioIndiceLoading = []
    relatorioIndices.set([])
    idx.forEach(x => {
        loadRelatorioIndice(x.exchange, x.market)
    })
}

const calculaBtcValor = (item, exchange) => {
    if (item.token == 'BTC') {
        return item.value
    }
    var indices = relatorioIndices.get()
    var found = indices.find(function(y){
        return /*y.exchange == exchange &&*/ y.market == 'BTC/' + item.token
    })
    var val = 0
    if (found != undefined) {
        val = item.value / found.last
    } else {
        found = indices.find(function(y){
            return /*y.exchange == exchange &&*/ y.market == item.token + '/BTC'
        })
        if (found != undefined) {
            val = found.last * item.value
        } else {
            let allMarkets = getAllMarkets()
            if (allMarkets.some(x => { return x == item.token + '/BTC'})) {
                loadRelatorioIndice(exchange, item.token + '/BTC')
            } else {
                loadRelatorioIndice(exchange, 'BTC/' + item.token)
            }
        }
    }
    if (isNaN(val) || (val < 1.e-7)){
        val = 0
    }
    return val
}

Template.relatorio.onRendered(function(){

    // certifica-se que todo os processamentos de renderizacao do DOM foram finalizados
    _.defer(function(){
        var ctx1 = document.getElementById('fundoDoughnut').getContext('2d')
        var fundoDoughnutChart = new Chart(ctx1, {
            type: 'doughnut',
        })

        var ctx2 = document.getElementById('fundoHistoricoBalanco').getContext('2d')
        var fundoHistoricoBalanco = new Chart(ctx2, {
            type: 'line',
        })

        var ctx3 = document.getElementById('fundoHistoricoIndices').getContext('2d')
        var fundoHistoricoIndices = new Chart(ctx3, {
            type: 'line',
        })

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
                        return y.symbol == 'BTC/' + i.currency
                    })
                    if (found != undefined) {
                        val = i.valor / found.last
                    } else {
                        found = i.tickers.find(function(y){
                            return y.symbol == i.currency + '/BTC'
                        })
                        if (found != undefined) {
                            val = found.last * i.valor
                        }
                    }
                }
                var nome = (pessoa == null) 
                            ? "(desconhecido)"
                            : pessoa.nome
                var found = labels.indexOf(nome);
                if (found >= 0){
                    valores[found] += val
                } else {
                    labels.push(nome)
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

            // atualiza o histórico
            var historico = Relatorios.find({ fundo_id: FlowRouter.getParam("fundo_id") })

            var totais = []
            var labels2 = []
            var indices = []
            
            moment.locale(TAPi18n.getLanguage());
            historico.forEach((i) => {
                totais.push(i.btcTotal)
                labels2.push(moment(i.criadoEm).format("L LT"))

                for (ind = 0; ind < i.indices.length; ind++) {
                    var found = indices.filter(function(y){
                        return y.exchange == i.indices[ind].exchange && y.market == i.indices[ind].market
                    })
                    if (found.length == 0) {
                        indices.push({
                            exchange: i.indices[ind].exchange,
                            market: i.indices[ind].market,
                            data: [i.indices[ind].last]
                        })
                    } else {
                        found[0].data.push(i.indices[ind].last)
                    }
                }
            })

            // balanço
            fundoHistoricoBalanco.data.datasets = [{
                label: 'BTC Total',
                data: totais.slice()
            }]
            fundoHistoricoBalanco.data.labels = labels2.slice()
            fundoHistoricoBalanco.update()

            // comparativo (calcula os percentuais em relação ao relatório anterior)
            for (let index = totais.length-1; index > 0; index--) {
                totais[index] = Math.round((100 * ((totais[index] / totais[index-1]) - 1)) * 10000) / 10000 
            }
            totais.shift()
            fundoHistoricoIndices.data.datasets = [{
                label: 'Fundo',
                data: totais
            }]
            for (let ind = 0; ind < indices.length; ind++) {
                for (let index = indices[ind].data.length-1; index > 0; index--) {
                    indices[ind].data[index] = Math.round((100 * ((indices[ind].data[index] / indices[ind].data[index-1]) - 1)) * 10000) / 10000 
                }
                indices[ind].data.shift()
                fundoHistoricoIndices.data.datasets.push({
                    label: indices[ind].exchange + ' (' + indices[ind].market + ')',
                    data: indices[ind].data,
                    borderColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
                    fill: false
                })
            }
            labels2.shift()
            fundoHistoricoIndices.data.labels = labels2
            fundoHistoricoIndices.update()
        });
    });
})

Template.relatorio.helpers({
    fundoNome() {
        relatorioIndices.set([])
        relatorioBalanco.set([])
        if (FlowRouter.getParam("fundo_id") == null) {
            return null
        } else {
            var fundo = Fundos.findOne(FlowRouter.getParam("fundo_id"))
            if (fundo == null) {
                return null
            }
            // busca os tickers dos indices cadastrados para o fundo                
            fundo.indices.forEach(function(i){
                loadRelatorioIndice(i.exchange, i.market)
            })
            // busca o balanço atual conforme as APIs configuradas para o usuário
            Meteor.call('exchanges', function (error, data) {
                data.forEach(function(i){
                    Meteor.call(i + '.fetchBalance', function (error, balance) {
                        if (balance != null){
                            balance.forEach(function(y){
                                if (y.fundo._id == fundo._id){
                                    var bal = relatorioBalanco.get()
                                    bal.push({
                                        exchange: i,
                                        dados: balance
                                    })
                                    relatorioBalanco.set(bal)            
                                }
                            })
                        }
                    })
                })
            })
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
    indices() {
        return relatorioIndices.get()
    },
    balanco() {
        return relatorioBalanco.get()
    },
    balancoDados(dados) {
        return dados[0].balance
    },
    balancoDadosTokenTemValor(item) {
        return item.value != 0
    },
    tokenBtcValor(item, exchange) {
        return calculaBtcValor(item, exchange)
    },
    balancoTotal() {
        var bal = relatorioBalanco.get()
        if (bal == undefined) {
            return 0
        }

        var total = 0
        bal.forEach(x => {
            x.dados[0].balance.forEach(y => {
                if (y.value > 0) {
                    total += calculaBtcValor(y, x.exchange)
                }
            })
        })

        return total
    },
    classeIndicePos(item) {
        return (item.pos == '<') ? "bg-success text-white"
                                 : (item.pos == '>') ? "bg-danger text-white"
                                                     : "";
    }
})

Template.relatorio.events({
    'click #btnSalvarRelatorio': function(event, instance) {

        if (FlowRouter.getParam("fundo_id") == null) {
            toastr.error('É necessário especificar um fundo!');
            return;
        }

        var bal = []
        var total = 0
        relatorioBalanco.get().forEach(element => {
            element.dados[0].balance.forEach(item =>{
                if (item.value > 0) {
                    var btcVal = calculaBtcValor(item, element.exchange)
                    bal.push({
                        exchange: element.exchange,
                        token: item.token,
                        value: item.value,
                        btcValue: btcVal
                    })
                    total += btcVal
                }
            })
        })

        let rel = {
            fundo_id: FlowRouter.getParam("fundo_id"),
            indices: relatorioIndices.get(),
            balanco: bal,
            btcTotal: total
        }

        Relatorios.insert(rel)

        toastr.success('Relatório salvo!')
        reloadRelatorioIndice()

    },
})