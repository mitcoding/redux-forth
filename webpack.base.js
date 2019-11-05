const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const debug = process.env.NODE_ENV !== "production";
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const webpack = require('webpack');


module.exports = smp.wrap({
	context: path.join(__dirname, "src"),
	devtool: false,
	mode: "production",
	entry: {
		main: "./main/javascript/com/mitProductions/forth/kernel.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader?cacheDirectory',
						options: {
							presets: ['@babel/preset-react', ['@babel/preset-env', { corejs: 3, debug: false, useBuiltIns: 'usage' }]]
						}
					},
					{
						loader: 'eslint-loader',
						options: {
							cache: true
						}
					}
				]
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "target/js"),
		publicPath: "/js/",
		filename: "[name].min.[contenthash].js"
	},
	optimization: {
		occurrenceOrder: true,
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new CircularDependencyPlugin({
			// exclude detection of files based on a RegExp
			exclude: /node_modules/,
			// include specific files based on a RegExp
			include: /src/,
			// add errors to webpack instead of warnings
			failOnError: true,
			// allow import cycles that include an asyncronous import,
			// e.g. via import(/* webpackMode: "weak" */ './file.js')
			allowAsyncCycles: false,
			// set the current working directory for displaying module paths
			cwd: process.cwd(),
		}),
		new AssetsPlugin({
			filename: 'AssetHelper.json',
			path: path.join(__dirname, 'target'),
			processOutput: function (assets) {
				let assetHelper = {};
				Object.keys(assets).forEach(function(bundleName, index) {
					let bundle = assets[bundleName];
					Object.keys(bundle).forEach(function(fileType, index) {
							let 
								versionedPath = bundle[fileType],
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