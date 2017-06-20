/**
 * Created by Vibhor.Tambat on 16/06/17.
 */

var React = require( 'react' );
var ReactDOM = require( 'react-dom' );
var TodoPresenter = require( '../src/TodoPresenter' );

ReactDOM.render(
    React.createElement( TodoPresenter, null ),
    document.getElementById( 'app' )
);


