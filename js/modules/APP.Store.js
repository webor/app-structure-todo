define( [
    'modules/APP',
    'Redux',
    'ReduxThunk',
    'ReduxInjector',
    'ReduxLogger',
    'ReduxDevtoolsExtension'
], function(
    APP,
    Redux,
    ReduxThunk,
    ReduxInjector,
    ReduxLogger,
    ReduxDevtoolsExtension
) {
    'use strict';
    var _middlewares,
        _isProduction = 'production' === process.env.NODE_ENV,
        _reducers = {
            app: APP.Constants.REDUCER
        };
    if ( _isProduction ) {
        _middlewares = Redux.applyMiddleware(
            ReduxThunk.default
        );
    } else {
        _middlewares = Redux.applyMiddleware(
            ReduxThunk.default,
            new ReduxLogger()
        );
    }
    if ( APP.Utils.isDebugEnable() && ! _isProduction ) {
        APP.Store =  ReduxInjector.createInjectStore( _reducers, {}, ReduxDevtoolsExtension.composeWithDevTools( {} )( _middlewares )  );
    } else {
        APP.Store =  ReduxInjector.createInjectStore( _reducers, {}, _middlewares  );
    }
} );
