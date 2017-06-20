define( 'TodoComponent', [
    'modules/APP',
    'jquery',
    '_',
    'Redux',
    'ReactRedux',
    'React',
    'ReactDOM',
    'ReduxInjector',
    'presenters/TodoApp/TodoListPresenter',
    'presenters/TodoApp/AddTodoListPresenter'
], function(
    APP,
    $,
    _,
    Redux,
    ReactRedux,
    React,
    ReactDOM,
    ReduxInjector,
    TodoListPresenter,
    AddTodoListPresenter

) {
    'use strict';
    APP.Components.register( 'TodoComponent', {
        init: function() {
            APP.Utils.log( 'TodoComponent.init()' );
            this.data = {
                todoList: []
            };
            this.data.todoJSON = APP.Utils.getEmbeddedJSON( this.$el.find( '.todo__json' ) );
            this.cacheLayout();
            this.bind();
        },
        bind: function() {
            APP.Utils.log( 'TodoComponent.bind()' );
            APP.Modules.MessageBus.on( APP.Constants.EVENT.COMPONENTS_LOADED, $.proxy( this.renderAddTodoList, this ) );
        },
        renderAddTodoList: function() {
            APP.Utils.log( 'TodoComponent.render()' );
            ReactDOM.render(
                React.createElement(
                    ReactRedux.Provider, { store: APP.Store },
                    React.createElement( AddTodoListPresenter, {
                        todoJSON: this.data.todoJSON,
                        getTodoListValue: $.proxy( this.getTodoListValue, this )
                    } )
                ),
                this.cache.$addTodoContainer.get( 0 )
            );
        },
        renderTodoList: function( item ) {
            APP.Utils.log( 'TodoComponent.render()' );
            ReactDOM.render(
                React.createElement(
                    ReactRedux.Provider, { store: APP.Store },
                    React.createElement( TodoListPresenter, {
                       listName: item,
                       listId: this.data.listId,
                       todoList: this.data.todoList
                    } )
                ),
                this.cache.$todoListContainer.get( 0 )
            );
        },
        cacheLayout: function() {
            APP.Utils.log( 'TodoComponent.cacheLayout()' );
            this.cache.$addTodoContainer =  this.$el.find( '.addtodolist' );
            this.cache.$todoListContainer = this.$el.find( '.todo__list' );
        },
        getTodoListValue: function( payload ) {
            var _that = this;
            APP.Utils.log( 'TodoComponent.getTodoListValue()' );
            this.data.todoList.push( payload.listName );
            this.data.listName = payload.listName;
            this.data.listId = payload.listId;
            _.map( this.data.todoList, function( item ) {
                _that.renderTodoList( item );
            } );
        }
    } );
} );
