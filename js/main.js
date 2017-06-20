define( 'init', [
    'modules/APP',
    'modules/loadModules',
    'components/loadComponents'
], function(
    APP
) {
    'use strict';
    function init() {
        APP.Utils.log( 'APP Started' );
        setTimeout( function() {
            window.APP = APP;
            APP.Modules.Bootstrap.init();

            APP.Modules.MessageBus.trigger( APP.Constants.EVENT.COMPONENTS_LOADED );
        }, 0 );
    }
    $( document ).on( 'ready', init );
} );
require( 'init' );
