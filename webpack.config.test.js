const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(baseConfig, {
	devtool: 'inline-source-map',	
	mode: "development",
	plugins: [
		new AssetsPlugin({
			filename: 'index.html',
			path: path.join(__dirname, 'target'),
			processOutput: function (assets) {
					let assetHelper = [];
					Object.keys(assets).forEach(function(bundleName, index) {
						let bundle = assets[bundleName];
						Object.keys(bundle).forEach(function(fileType, index) {
							let 
								file = bundle[fileType],
								htmlTag = ""
							;

							switch(fileType.toLowerCase() ) {
								case "js" :
									htmlTag = '<script src="' + file + '"></script>';
									break;
								case "css" :
									htmlTag = '<link type="text/css" rel="stylesheet" href="' + file + '"/>';
									break;
							}

							assetHelper.push(htmlTag);
						});
					});

					return "<html><head><title>Reudx Forth</title>" + assetHelper.join("") + "</head><body></body></html>";
			}
		})
	]
}) );