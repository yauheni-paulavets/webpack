const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
module.exports = merge(common, {

	/**
	 * Developer tool to enhance debugging.
	 *
	 * The 'source-map' settings is meant to be used in production only. It
	 * splits the source map in a separate file and it is slow to compute.
	 *
	 * See: https://webpack.js.org/configuration/devtool/
	 */
	devtool: 'source-map',
	plugins: [

		/**
		 * Plugin: UglifyJsPlugin
		 * Description: Minimize all JavaScript output of chunks.
		 * Loaders are switched into minimizing mode.
		 *
		 * See: https://webpack.js.org/plugins/uglifyjs-webpack-plugin/
		 */
		new UglifyJSPlugin({
			 sourceMap: true,
			 uglifyOptions: {
			 	toplevel: true,
				warnings: "verbose",
				keep_fnames: false
			}
		})
	]
})