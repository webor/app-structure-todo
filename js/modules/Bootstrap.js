/**
 *  File:               Bootstrap.js
 *  Version:            2.0
 *  Author:             Gautam Chadha,
 *  Updated By:         Sourabh Kumar,
 *  Creation Date:      August 03, 2015,
 *  Updated On:         December 05, 2015
 *  Changelog:          Dependency Injection implemented via webpack
 **/
define( 'Bootstrap', [
    'modules/APP',
    'jquery',
    'modules/MessageBus'
], function(
    APP,
    $
) {
    'use strict';

    var isBootstrapRunning = false,
        componentsDeclaratives = [],
        bootstrap,
        init,
        searchComponents,
        initComponents,
        checkQueue,
        bind,
        run,
        ctr,
        pause,
        resume,
        isPaused = false,
        queue = [];

    init = function init() {
        APP.Utils.log( 'APP.modules.Bootstrap.init()' );
        bind();
        run();
    };

    bootstrap = function bootstrap( payloadContext ) {
        APP.Utils.log( 'APP.modules.Bootstrap.bootstrap()' );

        var context = payloadContext || 'body';

        //Jquery version
        if ( 'string' === typeof context || 'undefined' === typeof context.jquery ) {
            context = $( context );
        }

        searchComponents( context );
        initComponents();
    };

//Search Components in context
    searchComponents = function searchComponents( context ) {
        APP.Utils.log( 'APP.modules.Bootstrap.searchComponents()' );
        componentsDeclaratives = context.find( '[' + APP.Constants.COMPONENT_ID + ']' );
    };

//Create instance for components
    initComponents = function initComponents() {
        APP.Utils.log( 'APP.modules.Bootstrap.initComponents()' );
        var componentName,
            componentsLength = componentsDeclaratives.length;
        for ( ctr = 0; ctr < componentsLength && ! isPaused ; ctr += 1 ) {
            componentName = componentsDeclaratives.eq( ctr ).attr( APP.Constants.COMPONENT_ID );

            APP.Components.getInstanceOf( componentName, componentsDeclaratives.eq( ctr ) );
        }
    };

//Pause instance creation
    pause = function pause() {
        APP.Utils.log( 'APP.modules.Bootstrap.pause()' );
        isPaused = true;
    };

//Resume instance creation
    resume = function resume() {
        APP.Utils.log( 'APP.modules.Bootstrap.resume()' );
        isPaused = false;
        var componentName,
            componentsLength = componentsDeclaratives.length;
        for ( ; ctr < componentsLength && ! isPaused ; ctr += 1 ) {
            componentName = componentsDeclaratives.eq( ctr ).attr( APP.Constants.COMPONENT_ID );

            APP.Components.getInstanceOf( componentName, componentsDeclaratives.eq( ctr ) );
        }
    };

    checkQueue = function checkQueue() {
        APP.Utils.log( 'APP.modules.Bootstrap.checkQueue()' );
        if ( 0 < queue.length ) {
            run( queue.splice( 0, 1 )[0] );
        }
    };

    bind = function bind() {
        APP.Utils.log( 'APP.modules.Bootstrap.bindEvents()' );
        APP.Modules.MessageBus.on( APP.Constants.COMPONENTS.BOOTSTRAP_RUN, run );
        APP.Modules.MessageBus.on( APP.Constants.EVENT.M_CONTROLLER_RUN_INITIALIZER, run );
        APP.Modules.MessageBus.on( APP.Constants.EVENT.BOOTSTRAP_PAUSE, pause );
        APP.Modules.MessageBus.on( APP.Constants.EVENT.BOOTSTRAP_RESUME, resume );
    };

    run = function run( payload ) {
        APP.Utils.log( 'APP.modules.Bootstrap.run()' );

        /* If bootstrap is already running then push current bootstrap in queue and execute it later */
        if ( true === isBootstrapRunning ) {
            queue.push( payload );
        } else {
            /* INTENTIONAL: the value below is assigned intentionally, for the use-case to make sure bootstrap doesn't
             re-run if run is called by MessageBus before the bootstrap finishes its task.
             */
            isBootstrapRunning = true;
            if ( 'undefined' === typeof payload || 'undefined' === typeof payload.context ) {
                bootstrap();
            } else {
                bootstrap( payload.context );
            }
            isBootstrapRunning = false;
            checkQueue();
        }

    };

    APP.Modules.Bootstrap = {
        init: init,
        run: run
    };
} );
