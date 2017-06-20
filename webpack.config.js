var webpack = require( 'webpack' ); //require node js webpack module for this
var path = require( 'path' );
var ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
var WriteFilePlugin = require('write-file-webpack-plugin');

/**
 * exports webpack module bundler
 * require one entry point and output path
 * webpack is fed via a configuration object.
 * It is passed in one of two ways depending on how you are using webpack: through the terminal or via Node.js.
 */
module.exports = {
    context: __dirname,

    //webpack creates a graph of all of your application's dependencies.
    // The starting point of this graph is known as an entry point.
    // The entry point tells webpack where to start and follows the graph of dependencies to know what to bundle.
    entry: {
        'js/main.js': path.resolve( __dirname, 'js/main.js' ),
        'css/style.css': path.resolve( __dirname, 'sass/style.scss' )
    },
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: '[name]'
    },

    devtool: 'source-map',

    resolve: {
        extensions: [ '.js', '.jsx', '.html' ],
        alias: {

            //Third Party Libraries
            'jquery': __dirname + '/js/vendor/jquery/jquery-1.11.2',
            '_': __dirname + '/js/vendor/lodash/lodash-4.12.0',
            'Redux': __dirname + '/js/vendor/redux/redux',
            'ReactRedux': __dirname + '/node_modules/react-redux/lib/index',
            'React': __dirname + '/js/vendor/react/react',
            'ReactDOM': __dirname + '/node_modules/react-dom/index', //Works only through node_modules. Dist files throw errors.
            'ReduxInjector': __dirname + '/js/vendor/redux-injector/redux-injector',
            'ReduxThunk': __dirname + '/js/vendor/redux-thunk/redux-thunk',
            'ReduxLogger': __dirname + '/node_modules/redux-logger/dist/index', //Works only through node_modules. Dist files throw errors.
            'ReduxDevtoolsExtension': __dirname + '/node_modules/redux-devtools-extension/index',

            //Directory Paths
            'components': __dirname + '/js/components',
            'modules': __dirname + '/js/modules',
            'presenters': __dirname + '/js/presenters',
            'actions': __dirname + '/js/actions',
            'Reducers': __dirname + '/js/reducers'

        }
    },
    devServer: {
        contentBase: './dist',
        compress: true,
        port: 9000,
        stats: 'errors-only',
        overlay: { errors: true },
        open: false
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'jsx-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract( {
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ],
                    publicPath: '/dist/css'
                } )
            },
            {
                test: /\.js$/,
                enforce: 'pre',
                exclude: [ path.resolve( __dirname, 'node_modules' ), path.resolve( __dirname, 'js/vendor' ), path.resolve( __dirname, 'js/modules/MessageBus' ) ],
                loader: 'jshint-loader',
                options: {
                    /* For reference: any jshint option http://www.jshint.com/docs/options/ */
                    camelcase: false,
                    strict: false,
                    emitErrors: true,
                    failOnHint: false,
                    reporter: function( errors ) {
                        var _message = '\n- - - - - JSHINT - - - - -';
                        _message += errors.map( function( error ) {
                            return '\n\n line: ' + error.line + ', col: ' + error.character + '\n' + error.reason;
                        } ).join( '\n\n' );
                        _message += '\n\n- - - - - - - - - - - - - - -\n';
                        this.emitError( _message );
                    }
                }
            },
            {
                test: /\.(jsx|js)$/,
                enforce: 'pre',
                exclude: [ path.resolve( __dirname, 'node_modules' ), path.resolve( __dirname, 'js/vendor' ), path.resolve( __dirname, 'js/modules' ) , path.resolve( __dirname, 'js/modules/MessageBus' ) ],
                loader: 'jscs-loader',
                options: {
                    emitErrors: true,
                    //disallowTrailingWhitespace: false,
                    //requireCapitalizedComments: false,
                    //requireVarDeclFirst: false,
                    failOnHint: false,
                    reporter: function( errors ) {
                        var _message = '\n- - - - - JSCS - - - - -';
                        _message += errors.getErrorList().map( function( error ) {
                            return '\n\n line: ' + error.line + ', col: ' + error.column + '\n' + error.message;
                        } ).join( '\n\n' );
                        _message += '\n\n- - - - - - - - - - - - - - -\n';
                        this.emitError( _message );
                    }
                }
            }
        ]
    },
    plugins: [

        new webpack.ProvidePlugin( {
            $ : 'jquery',
            jQuery : 'jquery',
            underscore: '_',
            moment: 'moment'
        } ),

        new WriteFilePlugin(),

        new ExtractTextPlugin( {
            filename: '[name]',
            disable: false,
            allChunks: true
        } )
    ]

};