define( 'APP.Utils', [
    'modules/APP.Constants',
    'jquery',
    'lodash'
], function(
    Constants,
    $
) {
    'use strict';

    return {

        getUrlParameter: function( urlName ) {
            var regex,
                results,
                name;
            name = urlName.replace( /[\[]/, '\\[' ).replace( /[\]]/, '\\]' );
            regex = new RegExp( '[\\?&]' + name + '=([^&#]*)' );
            results = regex.exec( location.search );
            return null === results ? null : decodeURIComponent( results[ 1 ].replace( /\+/g, ' ' ) );
        },

        isTrue: function( value ) {
            return null !== value && 'undefined' !== typeof value && 'true' === value.toString();
        },

        isDebugEnable: function() {
            return this.isTrue( this.getUrlParameter( Constants.DEBUG ) );
        },

        log: function( message ) {

            // Will add late following code
            // if ( this.isDebugEnable() && 'undefined' !== typeof window.console && 'function' === typeof window.console.log ) {
            //    window.console.log( message );
            //}
            window.console.log( message );
        },

        warn: function( msg ) {
            if ( this.isDebugEnable() && 'undefined' !== typeof window.console && 'function' === typeof window.console.warn ) {
                window.console.warn( msg );
            }
        },

        isUndefined: function isUndefined( value ) {
            return null === value || 'undefined' === typeof value || 'null' === value;
        },

        getEmbeddedJSON: function( $el ) {
            var htmlJSON,
                parsedJSON = null;
            if ( 'undefined' === $el.jQuery ) {
                throw new Error( 'JSON script element should be a jQuery object.' );
            } else if ( 0 === $el.length ) {
                throw new Error( 'JSON script element not present on page.' );
            } else {
                htmlJSON = $el.html();
                if ( 0 === $.trim( htmlJSON ).length ) {
                    throw new Error( 'JSON script element is empty.' );
                } else {
                    parsedJSON = JSON.parse( htmlJSON );
                }
            }
            return parsedJSON;
        },

        ajax: $.ajax,

        getAttributeSpecificClass: function( status ) {

            switch ( status ) {
                case Constants.SYSTEM_ATTRIBUTE_NAME.SUCCESS:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.SUCCESS;
                case Constants.SYSTEM_ATTRIBUTE_NAME.ERROR:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.ERROR;
                case Constants.SYSTEM_ATTRIBUTE_NAME.PRE_PROCESSING:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.PRE_PROCESSING;
                case Constants.SYSTEM_ATTRIBUTE_NAME.PROCESSING:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.PROCESSING;
                case Constants.SYSTEM_ATTRIBUTE_NAME.SENT:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.SENT;
                case Constants.SYSTEM_ATTRIBUTE_NAME.NTP:
                    return Constants.SYSTEM_ATTRIBUTE_CLASSNAME.NTP;

                default:
                    return '';
            }
        },

        getDetailTypeClassName: function( type ) {
            switch ( type ) {
                case Constants.DETAIL_TYPE.RULE:
                    return Constants.DETAIL_TYPE_CLASS.RULE;
                case Constants.DETAIL_TYPE.ERROR:
                    return Constants.DETAIL_TYPE_CLASS.ERROR;
                case Constants.DETAIL_TYPE.HOLD:
                    return Constants.DETAIL_TYPE_CLASS.HOLD;
                case Constants.DETAIL_TYPE.PROCESSED:
                    return Constants.DETAIL_TYPE_CLASS.PROCESSED;
                case Constants.DETAIL_TYPE.SENT:
                    return Constants.DETAIL_TYPE_CLASS.SENT;
                case Constants.DETAIL_TYPE.TRANSFORM:
                    return Constants.DETAIL_TYPE_CLASS.TRANSFORM;
                default:
                    return '';
            }
        },

        percentageCalculator: function( value, total ) {
            return ( value / total ) * 100;
        },

        getWindow: function() {
            return $( window );
        },

        getDocument: function() {
            return $( document );
        },

        hingeContainer: function( data ) {
            var value = 0 !== data.value ? data.value + 'px' : data.value;
            data.container.css( 'transform', 'translate3d(0,' + value + ',0)' );
        }
    };
});
