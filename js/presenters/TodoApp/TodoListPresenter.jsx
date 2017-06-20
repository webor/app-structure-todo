/**
 * Created by Vibhor.Tambat on 18/06/17.
 */
define( 'TodoListPresenter', [
    'modules/APP',
    'lodash',
    'React',
    'presenters/TodoApp/AddTodoItemPresenter',
    'presenters/TodoApp/TodoItemPresenter'
], function(
    APP,
    _,
    React,
    AddTodoItemPresenter,
    TodoItemPresenter
) {
    'use strict';
    var TodoList = React.createClass( {
        getInitialState: function() {
            APP.Utils.log( 'TodoList.getInitialState()' );
            return {
                itemsList: [],
                priority: 0,
                completedCount: 0,
                totalCount: 0,
                completedPercentage: 0,
                isChecked: false,
                upClicked: false,
                downClicked: false,
                isUpChecked: false,
                isDownChecked: false
            };
        },
        componentWillMount: function() {
            APP.Utils.log( 'TodoList.componentWillMount()' );
            this.data = {
                itemsList:[],
                completedCount: 0
            };
            this.cache = {};
        },
        render: function() {
            var _that = this,
                todoItem = '';
            APP.Utils.log( 'TodoList.render()' );
            if ( 0 !== this.state.totalCount ) {
                todoItem = _.map( this.state.itemsList, function( item, index ) {
                    return (
                        <TodoItemPresenter      data-totalCount = { _that.state.totalCount }
                                                priority = { index + 1 }
                                                data-listName = { _that.props.listName }
                                                data-listId = { _that.props.listId }
                                                item = { item }
                                                onDeleteSelection = { $.proxy( _that.onDeleteSelection, _that ) }
                                                onDoneSelection = { $.proxy( _that.onDoneSelection, _that ) }
                                                onDownSelection = { $.proxy( _that.onDownSelection, _that ) }
                                                onUpSelection = { $.proxy( _that.onUpSelection, _that ) }
                                                key= { index }
                        />
                    );
                } );
            } else {
                todoItem = '';
            }
            return (
                <ul className='todo__list__container' ref= { this.createElement }>
                    { this.showCompletedPer() }
                    <li className='todo__list__item todo__list__item--close'>
                        <img src='./images/close_red.png' alt='close' className='close__icon'/>
                    </li>
                    <li className='todo__list__item todo__list__item--name'>{ this.props.listName }</li>
                    <AddTodoItemPresenter
                        data-listName = { this.props.listName }
                        data-listId = { this.props.listId }
                        getTodoItemValue = { $.proxy( this.getTodoItemValue, this )  }
                        />
                    { todoItem }
                </ul>
            );
        },
        showCompletedPer: function() {
            APP.Utils.log( 'TodoList.componentDidMount()' );
            if ( 0 === this.state.itemsList.length ) {
                return '';
            } else {
                return ( <li className='todo__list__item todo__list__item--percentage'> { this.state.completedPercentage } % Complete</li> );
            }
        },
        createElement: function( ref ) {
            APP.Utils.log( 'TodoList.createElement()' );
            this.el = ref;
            this.$el = $( this.el );
        },
        onDeleteSelection: function( id ) {
            var selectedItem = [],
                countComplete = {},
                i = 0;
            APP.Utils.log( 'TodoList.onDeleteSelection()' );
            for ( i = 0 ; i < this.state.itemsList.length ; i = i + 1 ) {
                if ( this.state.itemsList[ i ].id !== parseInt( id ) ) {
                    selectedItem.push( this.state.itemsList[ i ] );
                }
            }
            countComplete = 0 === this.state.completedCount ? 0 : this.state.completedCount - 1;
            this.setState( {
                itemsList: selectedItem,
                completedCount: countComplete,
                completedPercentage:( ( countComplete / ( this.state.itemsList.length - 1 ) ) * 100 )
            } );
        },
        onDoneSelection: function( id, payload ) {
            var i, k = 0,
                selectedItem = [];
            APP.Utils.log( 'TodoList.onDoneSelection()' );
            for ( i = 0 ; i < this.state.itemsList.length ; i = i + 1 ) {
                selectedItem.push( this.state.itemsList[ i ] );
                if ( this.state.itemsList[ i ].id === parseInt( id ) ) {
                    if ( APP.Utils.isTrue( selectedItem[ i ].isCompleted ) ) {
                        selectedItem[ i ].isCompleted = false;
                    } else {
                        selectedItem[ i ].isCompleted = true;
                    }
                }
                if ( APP.Utils.isTrue( selectedItem[ i ].isCompleted ) ) {
                    k = k + 1;
                }
            }

            this.setState( {
                itemsList: selectedItem,
                completedCount:  k,
                completedPercentage:( ( k / ( this.state.itemsList.length ) ) * 100 )
            } );
        },
        onDownSelection: function( payload ) {
            var selectedItem, exchangedItem, that = this ;
            APP.Utils.log( 'TodoList.onUpSelection()' );
            selectedItem = this.data.itemsList[ payload.priority - 1 ];
            exchangedItem = this.data.itemsList[ payload.priority ];
            _.map( this.data.itemsList, function( item, index ) {
                if ( item === exchangedItem ) {
                    that.data.itemsList[ payload.priority ] = selectedItem;
                    that.data.itemsList[ payload.priority - 1 ] = exchangedItem;
                }
            } );
            this.setState( {
                itemsList: this.data.itemsList
            } );

        },
        onUpSelection: function( payload ) {
            var selectedItem, exchangedItem, that = this ;
            APP.Utils.log( 'TodoList.onUpSelection()' );
            selectedItem = this.data.itemsList[ payload.exchangePriority ];
            exchangedItem = this.data.itemsList[ payload.exchangePriority - 1 ];
            _.map( this.data.itemsList, function( item, index ) {
                if ( item === exchangedItem ) {
                    that.data.itemsList[ payload.exchangePriority - 1 ] = selectedItem;
                    that.data.itemsList[ payload.exchangePriority ] = exchangedItem;
                }
            } );
            this.setState( {
                itemsList: this.data.itemsList
            } );

        },
        componentDidMount: function() {
            APP.Utils.log( 'TodoList.componentDidMount()' );
            this.cacheDOM();
        },
        shouldComponentUpdate: function( nextProps, nextState ) {
            var _shouldUpdate = false;
            APP.Utils.log( 'AddTodoList.getTodoItemValue()' );
            if ( nextState.totalCount !== this.state.totalCount ) {
                _shouldUpdate = true;
            } else if ( nextState.upClicked !== this.state.upClicked ) {
                _shouldUpdate = true;
            } else if ( nextState.downClicked !== this.state.downClicked ) {
                _shouldUpdate = true;
            } else if ( nextState.completedPercentage !== this.state.completedPercentage ) {
                _shouldUpdate = true;
            } else {
                _shouldUpdate = true;
            }
            return _shouldUpdate;
        },
        componentWillUpdate: function() {
            APP.Utils.log( 'TodoList.componentWillUpdate()' );
        },
        cacheDOM: function() {
            APP.Utils.log( 'TodoList.cacheDOM()' );
            this.cache.$listCloseContainer = this.$el.find( '.todo__list__container' );
            this.bind();
        },
        bind: function() {
            APP.Utils.log( 'TodoList.cacheDOM()' );
            this.$el.on( 'click', '.' + 'todo__list__item--close', $.proxy( this.removeTodoList, this )  );
        },
        removeTodoList: function() {
            APP.Utils.log( 'TodoList.cacheDOM()' );
            $( '.todo__list__container' ).remove();
        },
        getTodoItemValue: function( payload ) {
            APP.Utils.log( 'TodoList.getTodoItemValue()' );
            this.data.priority = this.state.totalCount + 1 ;
            this.data.itemsList = this.state.itemsList;
            this.data.itemsList.push( {
                name: payload.ItemName,
                upClicked: this.state.upClicked,
                downClicked: this.state.downClicked,
                isChecked: false,
                id: payload.ItemId,
                isCompleted: false
            } );
            this.setState( {
                totalCount: payload.ItemId + this.state.totalCount,
                itemsList: this.data.itemsList,
                completedPercentage:( ( this.state.completedCount / ( this.data.itemsList.length ) ) * 100 )
            } );

        }
        } );
    return TodoList;
} );
