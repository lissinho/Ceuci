import SimpleSchema from 'simpl-schema';

Relatorios = new Mongo.Collection('relatorios');

Relatorios.attachSchema(new SimpleSchema({
    fundo_id: {
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
    indices: {
        type: Array
    },
    'indices.$': {
        type: Object
    },
    'indices.$.exchange': {
        type: String
    },
    'indices.$.market': {
        type: String
    },
    'indices.$.high': {
        type: Number
    },
    'indices.$.low': {
        type: Number
    },
    'indices.$.last': {
        type: Number
    },

    balanco: {
        type: Object
    },
    'balanco.$': {
        type: Object
    },
    'balanco.$.exchange': {
        type: String
    },
    'balanco.$.token': {
        type: String
    },
    'balanco.$.value': {
        type: Number
    },
    'balanco.$.btcValue': {
        type: Number
    },

    btcTotal: {
        type: Number
    }
    
}))

Relatorios.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  })