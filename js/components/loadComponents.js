define( 'loadComponents', [
    'modules/APP',
    'components/TodoComponent'
], function(
    APP
) {
    'use strict';
    APP.Utils.log( 'All Components Loaded' );

});
