/**
 * Created by Vibhor.Tambat on 18/06/17.
 */
define( 'TodoItemPresenter', [
    'modules/APP',
    'React'
], function(
    APP,
    React
) {
    'use strict';
    var TodoItem = React.createClass( {
        getInitialState: function() {
            APP.Utils.log( 'TodoItem.getInitialState()' );
            return {
                isCompleted: this.props.item.isCompleted
            };
        },
        componentWillMount: function() {
            APP.Utils.log( 'TodoItem.componentWillMount()' );
            this.data = {  };
            this.selectors = {
                closeButton: 'close__icon',
                doneButton: 'done__icon',
                upButton: 'up__icon',
                downButton: 'down__icon'
            };
            this.cache = {};
        },
        render: function() {
            APP.Utils.log( 'TodoItem.render()' );
            if ( ! this.state.isCompleted ) {
                return (
                    <fieldset className='todo__item__container' ref= { this.createElement }>
                        <ul className='todo__item__actions__list'>
                            <li className='todo__item__actions todo__item__actions--label' htmlFor= 'Item' >{ this.props.item.name }</li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/close_red.png' alt='close' className='close__icon'/>
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/done_green.png' alt='close' className='done__icon'/>
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/up_blue.png' alt='close' className='up__icon'/>
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/down_blue.png' alt='close' className='down__icon'/>
                            </li>
                        </ul>
                    </fieldset>
                );
            } else {
                return (
                    <fieldset className='todo__item__container' ref= { this.createElement }>
                        <ul className='todo__item__actions__list'>
                            <li className='todo__item__actions todo__item__actions--striked'></li>
                            <li className='todo__item__actions todo__item__actions--label' htmlFor= 'Item' >{ this.props.item.name  }</li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/close_red.png' alt='close' className='close__icon'/>
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/replay_black.png' alt='close' className='done__icon'/>
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id} >
                                <img src='./images/up_blue.png' alt='close' className='up__icon' />
                            </li>
                            <li className='todo__item__actions' data-id = {this.props.item.id}>
                                <img src='./images/down_blue.png' alt='close' className='down__icon'/>
                            </li>
                        </ul>
                    </fieldset>
                );
            }
        },
        onDeleteSelection: function( event ) {
            var payload,
                _id = $( event.currentTarget ).parent().attr( 'data-id' );
            APP.Utils.log( 'TodoItem.onDoneSelection()' );

            //X - if ( this.state.isCompleted ) {
            //    this.setState( {
            //        isCompleted: ! this.state.isCompleted
            //    } );
            //}
            //payload = {
            //    itemName: this.props.item.name,
            //    totalCount: this.props['data-totalCount'],
            //    priority: this.props.priority
            //};
            //this.props.onDeleteSelection( payload );

            this.props.onDeleteSelection( _id );
        },
        onDoneSelection: function( event ) {
            var _id, payload;
            _id = $( event.currentTarget ).parent().attr( 'data-id' );
            APP.Utils.log( 'TodoItem.onDoneSelection()' );
            payload = {
                itemName: this.props.item.name,
                totalCount: this.props['data-totalCount'],
                priority: this.props.priority
            };

            this.props.onDoneSelection( _id, payload );
        },
        onDownSelection: function() {
            var payload;
            APP.Utils.log( 'TodoItem.onDownSelection()' );
            if ( this.state.isCompleted ) {
                payload = {
                    itemName:this.props.item.name,
                    totalCount: this.props['data-totalCount'],
                    priority: this.props.priority,
                    exchangePriority: this.props.priority + 1,
                    isCompleted:  this.state.isCompleted
                };
            } else {
                payload = {
                    itemName: this.props.item.name,
                    totalCount: this.props['data-totalCount'],
                    priority: this.props.priority,
                    exchangePriority: this.props.priority + 1
                };
            }

            this.props.onDownSelection( payload );

        },
        onUpSelection: function() {
            var payload;
            APP.Utils.log( 'TodoItem.onUpSelection()' );
            if ( this.state.isCompleted ) {
                payload = {
                    itemName: this.props.item.name,
                    totalCount: this.props['data-totalCount'],
                    priority: this.props.priority,
                    exchangePriority: this.props.priority - 1,
                    isCompleted:  this.state.isCompleted
                };
            } else {
                payload = {
                    itemName: this.props.item.name,
                    totalCount: this.props['data-totalCount'],
                    priority: this.props.priority,
                    exchangePriority: this.props.priority - 1
                };
            }
            this.props.onUpSelection( payload );
        },
        componentDidMount: function() {
            APP.Utils.log( 'TodoItem.componentDidMount()' );
            this.cacheDOM();
            this.bind();
        },

        createElement: function( ref ) {
            APP.Utils.log( 'TodoItem.createElement()' );
            this.el = ref;
            this.$el = $( this.el );
        },
        bind: function() {
            APP.Utils.log( 'TodoItem.bind()' );
            this.$el.on( 'click', '.' + this.selectors.closeButton, $.proxy( this.onDeleteSelection, this ) );
            this.$el.on( 'click', '.' + this.selectors.doneButton, $.proxy( this.onDoneSelection, this )  );
            this.$el.on( 'click', '.' + this.selectors.downButton, $.proxy( this.onDownSelection, this )  );
            this.$el.on( 'click', '.' + this.selectors.upButton, $.proxy( this.onUpSelection, this )  );
        },
        shouldComponentUpdate: function( nextState, nextProps ) {
            var _shouldUpdate = true;
            APP.Utils.log( 'TodoItem.cacheDOM()' );

            //X - if ( nextState.isCompleted !== this.state.isCompleted ) {
            //    _shouldUpdate = true;
            //} else if ( nextProps.isUpChecked !== this.props.isUpChecked ) {
            //    _shouldUpdate = true;
            //}  else if ( nextProps.isDownChecked !== this.props.isDownChecked ) {
            //    _shouldUpdate = true;
            //}
            return _shouldUpdate;
        },
        componentWillReceiveProps: function( nextProps ) {
            APP.Utils.log( 'TodoList.componentWillUpdate()' );
            this.setState( {
                isCompleted: nextProps.item.isCompleted
            } );
        },
        cacheDOM: function() {
            APP.Utils.log( 'TodoItem.cacheDOM()' );
            this.cache.$closeButton = this.$el.find( '.' + this.selectors.closeButton );
            this.cache.$doneButton = this.$el.find( '.' + this.selectors.doneButton );
            this.cache.$downButton = this.$el.find( '.' + this.selectors.downButton );
            this.cache.$upButton = this.$el.find( '.' + this.selectors.upButton );

        },
        componentWillUnmount: function() {
            APP.Utils.log( 'FileSingleAttributePresenter.componentWillUnmount()' );
            this.deleteObjs();
        },
        deleteObjs: function() {
            APP.Utils.log( 'FileSingleAttributePresenter.deleteObjs()' );
            delete this.el;
            delete this.$el;
            delete this.cache;
            delete this.selectors;
        }
    } );
    return TodoItem;
} );
