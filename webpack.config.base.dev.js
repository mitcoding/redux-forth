const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const baseConfig = require('./webpack.config.base.js');
const merge = require('webpack-merge');

module.exports = merge(baseConfig, {
	devtool: "source-map",
	mode: "development",
	optimization: {
		occurrenceOrder: true,
		splitChunks: {
			chunks: 'all'
		}
	},
	output: {
		filename: "js/[name].min.[contenthash].js"
	},
	plugins: [
		new AssetsPlugin({
			filename: 'AssetHelper.json',
			path: path.join(__dirname, 'target'),
			processOutput: function (assets) {
				let assetHelper = {};
				Object.keys(assets).forEach(function(bundleName, index) {
					let bundle = assets[bundleName];
					Object.keys(bundle).forEach(function(fileType, index) {
							let 
								versionedPath = bundle[fileType].replace("/js/js", "/js"),
								fileParts = versionedPath.split("."),
								origionalPath = fileParts.slice(0, fileParts.length - 2).join(".") + "." + fileType
							;
							
							assetHelper[origionalPath] = versionedPath;
					});
				});

				return JSON.stringify(assetHelper);
			}
		})
	]	
});
