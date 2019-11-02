const CircularDependencyPlugin = require('circular-dependency-plugin');
const debug = process.env.NODE_ENV !== "production";
const path = require('path');
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
				enforce: 'pre',
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader?cacheDirectory',
						options: {
							presets: ['@babel/preset-react', '@babel/preset-env'],
							plugins: ['react-html-attrs',  'transform-class-properties', ["@babel/plugin-proposal-decorators", { "legacy": true }], '@babel/plugin-proposal-function-bind']
						}
					},
					{
						loader: 'eslint-loader',
						options: {
							// eslint options (if necessary)
						}
					}
				]
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "target/js"),
		publicPath: "/js/",
		filename: "[name].min.js"
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
		})
	]	
});