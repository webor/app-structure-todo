/**
 * Created by Vibhor.Tambat on 18/06/17.
 */
define( 'AddTodoListPresenter', [
    'modules/APP',
    'React'
], function(
    APP,
    React
) {
    'use strict';
    var AddTodoList = React.createClass( {
        getInitialState: function() {
            APP.Utils.log( 'AddTodoList.getInitialState()' );
            return {
                todoName:''
            };
        },
        componentWillMount: function() {
            APP.Utils.log( 'AddTodoList.componentWillMount()' );
            this.data = {
                listNames: [],
                listId: 0
            };

        },
        render: function() {
            APP.Utils.log( 'AddTodoList.render()' );
            return (
                <fieldset className='addTodo__container' ref= { this.createElement }>
                    <label className='addTodo__label' htmlFor= 'list'>ADD NEW TODO LIST</label>
                    <input type='text' id='addTodo' className='addTodo__name' name='list-name'></input>
                    <input type='submit' value='ADD' className='addTodo__submit' onClick = { this.onAddClick } />
                </fieldset>
            );
        },

        componentDidMount: function() {
            APP.Utils.log( 'AddTodoList.componentDidMount()' );

        },

        createElement: function( ref ) {
            APP.Utils.log( 'AddTodoList.createElement()' );
            this.el = ref;
            this.$el = $( this.el );
        },
        onAddClick: function() {
            var payload;
            APP.Utils.log( 'AddTodoList.onAddClick()' );
            this.data.listName = $( '.addTodo__name' )[ 0 ].value;
            payload = {
                listName: this.data.listName,
                listId: this.data.listId + 1
            };
            this.props.getTodoListValue( payload );
        }
    } );
    return AddTodoList;
} );
