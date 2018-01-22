const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {

	/**
	 * Developer tool to enhance debugging
	 *
	 * See: https://webpack.js.org/configuration/devtool/
	 */
	devtool: 'inline-source-map',

	/**
	 * DevServer
	 *
	 * See: https://webpack.js.org/configuration/dev-server
	 */
	devServer: {
		https: true,
		port: 3001,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	}
});