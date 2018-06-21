import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

AccountsTemplates.configure({
    defaultLayout: 'App_body',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main'
});

//AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
//AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
AccountsTemplates.configureRoute('resendVerificationEmail');

FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', { main: 'notfound' });
    },
};

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { main: 'home' });
    },
});

var adminRoutes = FlowRouter.group({
    prefix: '/admin',
    triggersEnter: [AccountsTemplates.ensureSignedIn]
});

var exchangeRoutes = adminRoutes.group({
    prefix: '/exchanges'
});

exchangeRoutes.route('/', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'exchanges' });
    }
});

exchangeRoutes.route('/foxbit', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'foxbit' });
    }
});

exchangeRoutes.route('/mercadobitcoin', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'mercadobitcoin' });
    }
});

exchangeRoutes.route('/binance', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'binance' });
    }
});

exchangeRoutes.route('/hitbtc', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'hitbtc' });
    }
});

exchangeRoutes.route('/livecoin', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'livecoin' });
    }
});

exchangeRoutes.route('/bitfinex', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'bitfinex' });
    }
});

exchangeRoutes.route('/yobit', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'yobit' });
    }
});

exchangeRoutes.route('/bitcointrade', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'bitcointrade' });
    }
});

exchangeRoutes.route('/', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'exchanges' });
    }
});

adminRoutes.route('/fundos', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'fundos' });
    }
})

adminRoutes.route('/fundo/:_id?', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'fundo', _id: params['_id'] });
    }
})


adminRoutes.route('/pessoas', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'pessoas' });
    }
})

adminRoutes.route('/pessoa/:_id?', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'pessoa', _id: params['_id'] });
    }
})

adminRoutes.route('/investimentos', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'investimentos' });
    }
})

adminRoutes.route('/investimento/:_id?', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'investimento', _id: params['_id'] });
    }
})

adminRoutes.route('/investimento/pessoa/:pessoa_id', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'investimento', pessoa_id: params['pessoa_id'] });
    }
})

adminRoutes.route('/relatorio/:fundo_id?', {
    action: function (params, queryParams) {
        BlazeLayout.render('App_body', { main: 'relatorio', fundo_id: params['fundo_id'] })
    }
})


/*
FlowRouter.route('/:template', {
    name: 'Template.auto',
    action(params) {
        BlazeLayout.render('App_body', { main: params['template'] });
    },
});

FlowRouter.route('/:template/:_id', {
    name: 'Template.edit',
    action(params) {
        BlazeLayout.render('App_body', { main: params['template'], _id: params['_id'] });
    },
});
*/