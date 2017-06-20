define( 'APP', [
    'modules/APP.Constants',
    'modules/APP.Utils',
    'modules/APP.Components'
], function(
    Constants,
    Utils,
    Components
) {
    'use strict';
    return {
        Constants: Constants,
        Utils: Utils,
        Modules: { },
        Models:{},
        Components: Components,
        Store: {},
        ActionsCreators: {}
    };
});
