define( 'loadModules', [
    'modules/APP',
    'modules/Bootstrap',
    'modules/MessageBus',
    'modules/APP.Store',
    'modules/APP.ActionsCreator'
], function(
    APP
) {
    'use strict';
    APP.Utils.log( 'All modules Loaded' );
});
