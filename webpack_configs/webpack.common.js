const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SRC = path.join(__dirname, 'src/');
const NODE_MODULES = path.join(__dirname, 'node_modules/');

const NODE_ENV = process.env.NODE_ENV || 'prod';

module.exports = {
	entry: {
		app: './src/attachmentsUiHandler.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, '..', 'dist'),
		library: 'attachmentsUiHandler',
		libraryTarget: 'umd'
	},
	resolve: {
		alias: {
			SRC$: SRC,
			NODE_MODULES$: NODE_MODULES
		}
	},
	/*
	 * The externals configuration option provides a way of excluding dependencies from the output bundles. 
	 * Instead, the created bundle relies on that dependency to be present in the consumer's environment
	*/
	externals: {
		jquery: 'jQuery',
		sfdc: 'Sfdc'
	},
	plugins: [

		/**
		 * Plugin: CleanWebpackPlugin
		 * Description: A webpack plugin to remove/clean your build folder(s) before building.
		 *
		 * See: https://github.com/johnagan/clean-webpack-plugin
		 */
		new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname , '..') }),

		/**
		 * Plugin: HtmlWebpackPlugin
		 * Description: The plugin will generate an HTML5 file for you that includes all your webpack bundles in the body using script tags.
		 *
		 * See: https://github.com/jantimon/html-webpack-plugin
		 */
		new HtmlWebpackPlugin({
			title: 'Production'
		}),

		/**
		 * Plugin: DefinePlugin
		 * Description: Define free variables.
		 * Useful for having development builds with debug logging or adding global constants.
		 *
		 * Environment helpers
		 *
		 * See: https://webpack.js.org/plugins/define-plugin/
		 */
		new webpack.DefinePlugin({
			'NODE_ENV': JSON.stringify(NODE_ENV)
		}),

		/**
		 * Plugin: CommonsChunkPlugin
		 * Description: Shares common code between the pages.
		 * It identifies common modules and put them into a commons chunk.
		 *
		 * See: https://webpack.js.org/plugins/commons-chunk-plugin/
		 * See: https://webpack.js.org/plugins/limit-chunk-count-plugin/#multi-page-app
		 */
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: module => /node_modules/.test(module.resource)
				|| /bower_components/.test(module.resource)
				|| /assets\/scripts/.test(module.resource)
				|| /assets\/stylesheets\/@salesforce-ux/.test(module.resource)
		})
	]
}