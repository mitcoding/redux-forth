var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: path.join(__dirname, "src"),
	devtool: false,
	mode: "production",
	entry: {
		main: "./main/javascript/scripts.js"
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
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: debug ? [] : [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
	]
};
