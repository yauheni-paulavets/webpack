const customArchiver = require('./CustomArchiver');
const path = require('path');
const webpackMerge = require('webpack-merge');
const prodConfig = require('./webpack.prod.js');
const salesforceConfig = require('../salesforce.config.js');
const staticresourceConfig = require('../staticresource.config.js');
const WebpackSalesforcePlugin = require('webpack-salesforce-plugin');

let webpackSalesforcePluginInstance = new WebpackSalesforcePlugin({
	salesforce: salesforceConfig,
	resources: [
		{
			// the name of the static resource to be created/updated in Salesforce
			name: staticresourceConfig.name,
			// the files to include in the static resource folder, may be in glob format
			files: [
				path.resolve(__dirname , '..', 'dist'),
				path.resolve(__dirname , '..', 'src'),
				path.resolve(__dirname , '..', 'webpack_configs'),
				path.resolve(__dirname , '..', 'package.json'),
				path.resolve(__dirname , '..', 'salesforce.config.js'),
				path.resolve(__dirname , '..', 'staticresource.config.js'),
				path.resolve(__dirname , '..', 'webpack.config.js')
			]
		}
	]
});

webpackSalesforcePluginInstance.uploadFiles = function(compilation, done) 
{
	var self = this;
	var resource = this.options.resources[0];

	customArchiver.archive(resource.files, function(data)
	{
		var staticResource = {
			fullName: resource.name,
			content: data,
			contentType: 'application/zip'
		};
		self.__doUpload([staticResource], done);
	});
}

module.exports = webpackMerge(prodConfig, {

	plugins: [

		/**
		 * Plugin: WebpackSalesforcePlugin
		 * Description: A small configurable plugin that can zip and upload bundle files to Salesforce as static resources.
		 *
		 * See: https://github.com/nadrees/webpack-salesforce-plugin
		 */
		webpackSalesforcePluginInstance
	]
});
