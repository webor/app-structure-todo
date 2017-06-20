/**
 * Created by Vibhor.Tambat on 18/06/17.
 */
define( 'AddTodoItemPresenter', [
    'modules/APP',
    'React'
], function(
    APP,
    React
) {
    'use strict';
    var AddTodoItem = React.createClass( {
        getInitialState: function() {
            APP.Utils.log( 'AddTodoItem.getInitialState()' );
            return {
                ItemName:''
            };
        },
        componentWillMount: function() {
            APP.Utils.log( 'AddTodoItem.componentWillMount()' );
            this.data = {
                ItemName:'',
                ItemId: 0
            };

        },
        render: function() {
            APP.Utils.log( 'AddTodoItem.render()' );
            return (
                <fieldset className='addTodo__item__container' ref= { this.createElement }>
                    <label className='addTodo__item__label' htmlFor= 'Item'>ADD NEW TODO ITEM</label>
                    <input type='text' id='add-todo-item' className='addTodo__item__name' name='Item-name'></input>
                    <input type='submit' value='ADD' className='addTodo__item__submit' onClick = { this.onAddClick } />
                </fieldset>
            );
        },

        componentDidMount: function() {
            APP.Utils.log( 'AddTodoItem.componentDidMount()' );

        },

        createElement: function( ref ) {
            APP.Utils.log( 'AddTodoItem.createElement()' );
            this.el = ref;
            this.$el = $( this.el );
        },
        onAddClick: function() {
            var payload;
            APP.Utils.log( 'AddTodoItem.onAddClick()' );
            this.data.ItemName = $( '.addTodo__item__name' )[ 0 ].value;
            if ( ! _.isEmpty( this.data.ItemName ) ) {
                payload = {
                    ItemName: this.data.ItemName,
                    ItemId: this.data.ItemId + 1
                };
                this.data.ItemId = payload.ItemId;
                this.props.getTodoItemValue( payload );
            }
        }
    } );
    return AddTodoItem;
} );
