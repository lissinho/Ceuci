import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);

Pessoas = new Mongo.Collection('pessoas');

SimpleSchema.debug = true;

Pessoas.attachSchema(new SimpleSchema({
    nome: {
        type: String,
    },
    dataDeNascimento: {
        type: Date,
        optional: true
    },
    sexo: {
        type: String,
        autoform: {
            type: 'select',
            firstOption: '(Selecione)',
            options: function(){
                return [
                    {label:'M',value:'M'},
                    {label:'F',value:'F'},
                ]
            }
        }    
    },
    telefone: {
        type: String,
    },
    cpf: {
        type: String,
        optional: true
    },
    rg: {
        type: String,
        optional: true
    },
    endereco: {
        type: String,
        optional: true
    },
    bairro: {
        type: String,
        optional: true
    },
    cep: {
        type: String,
        optional: true
    },
    cidade: {
        type: String,
        optional: true
    },
    estado: {
        type: String,
        optional: true,
        autoform: {
            type: 'select',
            firstOption: '(Selecione)',
            options: function(){
                return [
                    {label:'AC',value:'AC'},
                    {label:'AL',value:'AL'},
                    {label:'AP',value:'AP'},
                    {label:'AM',value:'AM'},
                    {label:'BA',value:'BA'},
                    {label:'CE',value:'CE'},
                    {label:'DF',value:'DF'},
                    {label:'ES',value:'ES'},
                    {label:'GO',value:'GO'},
                    {label:'MA',value:'MA'},
                    {label:'MT',value:'MT'},
                    {label:'MS',value:'MS'},
                    {label:'MG',value:'MG'},
                    {label:'PA',value:'PA'},
                    {label:'PB',value:'PB'},
                    {label:'PR',value:'PR'},
                    {label:'PE',value:'PE'},
                    {label:'PI',value:'PI'},
                    {label:'RJ',value:'RJ'},
                    {label:'RN',value:'RN'},
                    {label:'RS',value:'RS'},
                    {label:'RO',value:'RO'},
                    {label:'RR',value:'RR'},
                    {label:'SC',value:'SC'},
                    {label:'SP',value:'SP'},
                    {label:'SE',value:'SE'},
                    {label:'TO',value:'TO'}
                ]
            }
        }
    }
}));


Pessoas.allow({
    insert: function () {
      return true;
    },
    update: function () {
      return true;
    }
  });