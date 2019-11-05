const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');


module.exports = {
	context: path.join(__dirname, "src"),
	mode: "none",
	entry: {
		main: "./main/javascript/com/mitProductions/forth/kernel.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				enforce: "pre",
				exclude: /(node_modules|bower_components)/,				
				loader: 'eslint-loader',
				options: {
					cache: true
				}
					
			},
			{
				test: /\.jsx?$/,
				enforce: "post",
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader?cacheDirectory',
				options: {
					presets: ['@babel/preset-react', ['@babel/preset-env', { corejs: 3, debug: false, useBuiltIns: 'usage' }]]
				}
					
			}
		]
	},
	output: {
		path: path.resolve(__dirname, "target"),
		publicPath: "/js/",
		filename: "[name].min.js"
	},
	optimization: {
		occurrenceOrder: true
	},
	plugins: [
		new CleanWebpackPlugin(),
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
};
