import SimpleSchema from 'simpl-schema';

Investimentos = new Mongo.Collection('investimentos');

Investimentos.attachSchema(new SimpleSchema({
    fundo_id: {
        type: String,
    },
    pessoa_id: {
        type: String
    },
    criadoEm: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return { $setOnInsert: new Date() };
            } else {
                this.unset();
            }
        }
    },
    valor: {
        type: Number
    },
    currency: {
        type: String
    },
    tickers: {
        type: Array
    },
    'tickers.$': {
        type: Object
    },
    'tickers.$.datetime': {
        type: Date
    },
    'tickers.$.source': {
        type: String
    },
    'tickers.$.symbol': {
        type: String
    },
    'tickers.$.last': {
        type: Number
    },
    'tickers.$.high': {
        type: Number
    },
    'tickers.$.low': {
        type: Number
    }

}));


Investimentos.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });