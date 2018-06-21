import SimpleSchema from 'simpl-schema';

Traders = new Mongo.Collection('traders');

Traders.attachSchema(new SimpleSchema({
    fundo_id: {
        type: String,
    },
    user_id: {
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

    apiKeys: {
        type: Array,
        optional: true
    },
    'apiKeys.$': {
        type: Object
    },
    "apiKeys.$.exchange": {
        type: String
    },
    "apiKeys.$.key": {
        type: String
    },
    "apiKeys.$.secret": {
        type: String,
        optional: true
    }

}));

Traders.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });