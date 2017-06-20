define( 'APP.Components', [ 'modules/APP.Constants', 'modules/APP.Utils', 'lodash', 'jquery' ], function( Constants, Utils, _, $ ) {
    'use strict';
   var componentsMap = {},
    _instanceMap = {},
    _removeInstance = function( objectID ) {
        var _instance = _instanceMap[ objectID ];
        if ( 'function' === typeof _instance.unBindEvents ) {
            _instance.unBindEvents();
        }
        if ( 'function' === typeof _instance.remove ) {
            _instance.remove();
        }
        if ( 'function' === typeof _instance.onClose ) {
            _instance.onClose();
        }
        delete _instanceMap[ objectID ];
    };

    function Component( el, attr ) {
            /* Throw an error if new keyword is not used while initializing the component */
        if ( ! ( this instanceof Component ) ) {
            throw new Error( Constants.COMPONENTS.NEW_NOT_USED_ERROR );
        }
        Utils.log( 'Components.' + this.constructor.className + ' Initialized' );

        if ( 'string' === typeof el ) {
            this.el = document.getElementById( el );
        } else if ( 'undefined' !== typeof el.jquery ) {
            this.el = el.get( 0 );
        } else {
            this.el = el;
        }

        this.constructor.ObjCounter = this.constructor.ObjCounter + 1 || 1;
        this.objectID = this.constructor.className + '__' + this.constructor.ObjCounter;

        this.$el = $( this.el );

        this.attr = _.clone( attr );
        this.cache = {};
        this.data = {};
        if ( 'function' === typeof this.init ) {
            this.init();
        }

        this.close = function() {
            _removeInstance( this.objectID );
        };

        this.remove = function() {
            this.$el.remove();
        };
    }

    Component.extend = function extend( protoProps, staticProps ) {
        var parent = this;
        var child;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent constructor.
        if ( protoProps && _.has( protoProps, 'constructor' ) ) {
            child = protoProps.constructor;
        } else {
            child = function() {
                return parent.apply( this, arguments );
            };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend( child, parent, staticProps );

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent` constructor function.
        var Surrogate = function() {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if ( protoProps ) {
            _.extend( child.prototype, protoProps );
        }

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.prototype.__super__ = parent.prototype;

        return child;
    };

    function isValidComponentName( componentName ) {
        return 'undefined' !== typeof componentName && '' !== componentName;
    }
    function isRegisteredComponent( componentName ) {
        return 'undefined' !==  typeof componentsMap[ componentName ];
    }

    return {
        register: function register( componentName, componentPrototype ) {
            /* Removing any initial and trailing spaces from component name */
            var compName = $.trim( componentName );

            /* Don't execute if component name is known, blank or already registered */
            if ( ! isValidComponentName( compName ) ) {
                throw new Error( Constants.COMPONENTS.COMPONENT_NAME_UNKNOWN_ERROR );
            } else if ( isRegisteredComponent( compName ) ) {
                throw new Error( Constants.COMPONENTS.COMPONENT_ALREADY_REGISTERED_ERROR + ' : ' +  compName );
            } else {
                componentsMap[ compName ] = Component.extend( componentPrototype, { className: compName } );
            }
        },
        extend: function( componentName, componentPrototype, extendedComponent ) {
            /* Removing any initial and trailing spaces from component name */
            var compName = $.trim( componentName );

            var parentComponent = componentsMap[ extendedComponent ];

            /* Don't execute if component name is known, blank, already registered or extended component doesn't exist */
            if ( ! isValidComponentName( compName ) || ! isValidComponentName( extendedComponent ) ) {
                throw new Error( Constants.COMPONENTS.COMPONENT_NAME_UNKNOWN_ERROR );
            } else if ( isRegisteredComponent( compName ) ) {
                throw new Error( Constants.COMPONENTS.COMPONENT_ALREADY_REGISTERED_ERROR + ' : ' +  compName );
            } else if ( ! isRegisteredComponent( extendedComponent ) ) {
                throw new Error( Constants.COMPONENTS.COMPONENT_NOT_REGISTERED_ERROR + ' : ' +  extendedComponent );
            } else {
                componentsMap[ compName ] = parentComponent.extend( componentPrototype, { className: compName } );
            }
        },
        getInstanceOf: function( componentName, el, attr ) {
            var $el,
                instance = null;

            if ( ! isValidComponentName( componentName ) ) {
                Utils.warn( Constants.COMPONENTS.COMPONENT_NAME_UNKNOWN_ERROR );
            } else if ( ! isRegisteredComponent( componentName ) ) {
                Utils.warn( Constants.COMPONENTS.COMPONENT_NOT_REGISTERED_ERROR + ' : ' +  componentName );
            } else if ( ! componentName || ! el ) {
                Utils.warn( Constants.ERROR.TOO_FEW_PARAMETERS );
            } else {
                if ( 'string' === typeof el ) {
                    $el = $( '#'  + el );
                } else if ( 'undefined' !== typeof el.jquery ) {
                    $el = el;
                } else {
                    $el = $( el );
                }

                instance = $( el ).data( 'instance' );
                if ( instance && instance.length && ( instance in _instanceMap ) ) {

                    //If instance exists for component, simply return it
                    instance = _instanceMap[ instance ];
                } else {
                    instance = new componentsMap[ componentName ]( el, attr );
                    _instanceMap[ instance.objectID ] = instance;
                    $el.data( 'instance', instance.objectID );
                }

            }
            return instance;
        }
    };
});
