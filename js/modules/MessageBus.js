/**
 * Created by Vineet on 23/02/17.
 */

define( 'MessageBus', [
        'modules/APP',
        'lodash' ],
    function( APP, _ ) {
        'use strict';

        /*A module that can be mixed in to *any object* in order to provide it with
         a custom event channel. You may bind a callback to an event with `on` or
         remove with `off`; `trigger`-ing an event fires all callbacks in
         succession.

         var object = {};
         _.extend(object, Events);
         object.on('expand', function(){ alert('expanded'); });
         object.trigger('expand');
         */
        var Events = {};

        // Regular expression used to split event strings.
        var eventSplitter = /\s+/;

        /* Iterates over the standard `event, callback` (as well as the fancy multiple
         space-separated events `"change blur", callback` and jQuery-style event
         maps `{event: callback}`).*/
        var eventsApi = function( iteratee, events, name, callback, opts ) {
            var i = 0,
                names,
                internalOn;
            if ( name && typeof 'object' === name ) {

                // Handle event maps.
                if ( callback !== void 0 && 'context' in opts && opts.context === void 0 ) {
                    opts.context = callback;
                }
                for ( names = _.keys( name ); i < names.length ; i++ ) {
                    events = eventsApi( iteratee, events, names[i], name[ names[i] ], opts );
                }
            } else if ( name && eventSplitter.test( name ) ) {

                // Handle space-separated event names by delegating them individually.
                for ( names = name.split( eventSplitter ); i < names.length; i++ ) {
                    events = iteratee( events, names[i], callback, opts );
                }
            } else {

                // Finally, standard events.
                events = iteratee( events, name, callback, opts );
            }
            return events;
        };

        var onApi,
            offApi,
            onceMap,
            triggerApi,
            triggerEvents,
            internalOn;

        /* Bind an event to a `callback` function. Passing `"all"` will bind
         the callback to all events fired.*/

        Events.on = function( name, callback, context ) {
            return internalOn( this, name, callback, context );
        };

        // Guard the `listening` argument from the public API.

        internalOn = function( obj, name, callback, context, listening ) {
            var listeners;
            obj._events = eventsApi( onApi, obj._events || {}, name, callback, {
                context: context,
                ctx: obj,
                listening: listening
            } );

            if ( listening ) {
                listeners = obj._listeners || ( obj._listeners = {} );
                listeners[listening.id] = listening;
            }

            return obj;
        };

        /* Inversion-of-control versions of `on`. Tell *this* object to listen to
         an event in another object... keeping track of what it's listening to
         for easier unbinding later.*/

        Events.listenTo = function( obj, name, callback ) {
            var id,
                listeningTo,
                thisId,
                listening;

            if ( ! obj ) {
                return this;
            }
            id = obj._listenId || ( obj._listenId = _.uniqueId( 'l' ) );
            listeningTo = this._listeningTo || ( this._listeningTo = {} );
            listening = listeningTo[id];

            // This object is not listening to any other events on `obj` yet.
            // Setup the necessary references to track the listening callbacks.

            if ( ! listening ) {
                thisId = this._listenId || ( this._listenId = _.uniqueId( 'l' ) );
                listening = listeningTo[id] = { obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0 };
            }

            // Bind callbacks on obj, and keep track of them on listening.

            internalOn( obj, name, callback, this, listening );
            return this;
        };

        // The reducing API that adds a callback to the `events` object.

        onApi = function( events, name, callback, options ) {
            var handlers,
                ctx,
                listening,
                context;
            if ( callback ) {
                handlers = events[name] || ( events[name] = [] );
                context = options.context;
                ctx = options.ctx;
                listening = options.listening;
                if ( listening ) {
                    listening.count++;
                }

                handlers.push( { callback: callback, context: context, ctx: context || ctx, listening: listening } );
            }
            return events;
        };

        /* Remove one or many callbacks. If `context` is null, removes all
         callbacks with that function. If `callback` is null, removes all
         callbacks for the event. If `name` is null, removes all bound
         callbacks for all events.*/

        Events.off = function( name, callback, context ) {
            if ( ! this._events ) {
                return this;
            }
            this._events = eventsApi( offApi, this._events, name, callback, {
                context: context,
                listeners: this._listeners
            } );
            return this;
        };

        /* Tell this object to stop listening to either specific events ... or
         to every object it's currently listening to.*/

        Events.stopListening = function( obj, name, callback ) {
            var listeningTo = this._listeningTo,
                i,
                ids,
                listening;
            if ( ! listeningTo ) {
                return this;
            }
            ids = obj ? [obj._listenId] : _.keys( listeningTo );

            for ( i = 0; i < ids.length; i++ ) {
                listening = listeningTo[ids[i]];

                // If listening doesn't exist, this object is not currently
                // listening to obj. Break out early.

                if ( ! listening ) {
                    break;
                }

                listening.obj.off( name, callback, this );
            }

            return this;
        };

        // The reducing API that removes a callback from the `events` object.

        offApi = function( events, name, callback, options ) {
            var i,
                listening,
                context,
                j,
                ids,
                handler,
                names,
                handlers,
                remaining,
                listeners;
            if ( ! events ) {
                return;
            }

            i = 0;
            context = options.context;
            listeners = options.listeners;

            // Delete all events listeners and "drop" events.

            if ( ! name && ! callback && ! context ) {
                ids = _.keys( listeners );
                for ( ; i < ids.length; i++ ) {
                    listening = listeners[ids[i]];
                    delete listeners[listening.id];
                    delete listening.listeningTo[listening.objId];
                }
                return;
            }

            names = name ? [name] : _.keys( events );
            for ( ; i < names.length; i++ ) {
                name = names[i];
                handlers = events[name];

                // Bail out if there are no events stored.

                if ( ! handlers ) {
                    break;
                }

                // Replace events if there are any remaining.  Otherwise, clean up.

                remaining = [];
                for ( j = 0; j < handlers.length; j++ ) {
                    handler = handlers[j];
                    if (
                        callback && callback !== handler.callback &&
                        callback !== handler.callback._callback ||
                        context && context !== handler.context
                    ) {
                        remaining.push( handler );
                    } else {
                        listening = handler.listening;
                        if ( 0 === listening && --listening.count ) {
                            delete listeners[listening.id];
                            delete listening.listeningTo[listening.objId];
                        }
                    }
                }

                // Update tail event if the list has any events.  Otherwise, clean up.

                if ( remaining.length ) {
                    events[name] = remaining;
                } else {
                    delete events[name];
                }
            }
            return events;
        };

        /* Bind an event to only be triggered a single time. After the first time
         the callback is invoked, its listener will be removed. If multiple events
         are passed in using the space-separated syntax, the handler will fire
         once for each event, not once for a combination of all events.*/
        Events.once = function( name, callback, context ) {

            // Map the event into a `{event: once}` object.
            var events = eventsApi( onceMap, {}, name, callback, _.bind( this.off, this ) );
            if ( 'string' === typeof name && null == context ) {
                callback = void 0;
            }
            return this.on( events, callback, context );
        };

        // Inversion-of-control versions of `once`.
        Events.listenToOnce = function( obj, name, callback ) {

            // Map the event into a `{event: once}` object.
            var events = eventsApi( onceMap, {}, name, callback, _.bind( this.stopListening, this, obj ) );
            return this.listenTo( obj, events );
        };

        /* Reduces the event callbacks into a map of `{event: onceWrapper}`.
         `offer` unbinds the `onceWrapper` after it has been called.*/
        onceMap = function( map, name, callback, offer ) {
            var once;
            if ( callback ) {
                once = map[name] = _.once( function() {
                    offer( name, once );
                    callback.apply( this, arguments );
                } );
                once._callback = callback;
            }
            return map;
        };

        /* Trigger one or many events, firing all bound callbacks. Callbacks are
         passed the same arguments as `trigger` is, apart from the event name
         (unless you're listening on `"all"`, which will cause your callback to
         receive the true name of the event as the first argument).*/
        Events.trigger = function( name ) {
            var length,
                i,
                args;
            if ( ! this._events ) {
                return this;
            }

            length = Math.max( 0, arguments.length - 1 );
            args = Array( length );
            for ( i = 0; i < length; i++ ) {
                args[i] = arguments[i + 1];
            }

            eventsApi( triggerApi, this._events, name, void 0, args );
            return this;
        };

        // Handles triggering the appropriate event callbacks.
        triggerApi = function( objEvents, name, callback, args ) {
            var allEvents,
                events;
            if ( objEvents ) {
                events = objEvents[name];
                allEvents = objEvents.all;
                if ( events && allEvents ) {
                    allEvents = allEvents.slice();
                }
                if ( events ) {
                    triggerEvents( events, args );
                }
                if ( allEvents ) {
                    triggerEvents( allEvents, [name].concat( args ) );
                }
            }
            return objEvents;
        };

        /* A difficult-to-believe, but optimized internal dispatch function for
         triggering events. Tries to keep the usual cases speedy (most internal
         Backbone events have 3 arguments).*/

        triggerEvents = function( events, args ) {
            var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
            switch ( args.length ) {
                case 0:
                    while ( ++i < l ) {
                        ( ev = events[i] ).callback.call( ev.ctx );
                    }
                    return;
                case 1:
                    while ( ++i < l ) {
                        ( ev = events[i] ).callback.call( ev.ctx, a1 );
                    }
                    return;
                case 2:
                    while ( ++i < l ) {
                        ( ev = events[i] ).callback.call( ev.ctx, a1, a2 );
                    }
                    return;
                case 3:
                    while ( ++i < l ) {
                        ( ev = events[i] ).callback.call( ev.ctx, a1, a2, a3 );
                    }
                    return;
                default:
                    while ( ++i < l ) {
                        ( ev = events[i] ).callback.apply( ev.ctx, args );
                    }
                    return;
            }
        };

        // Aliases for backwards compatibility.

        Events.bind   = Events.on;
        Events.unbind = Events.off;

        APP.Modules.MessageBus = ( function() {
            return _.extend( {}, Events );
        }() );
    } );
