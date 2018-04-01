import SimpleSchema from 'simpl-schema';

Fundos = new Mongo.Collection('fundos');

Fundos.attachSchema(new SimpleSchema({
    nome: {
        type: String,
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
        type: String
    }

}));

Fundos.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });