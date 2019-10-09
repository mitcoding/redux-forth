// Karma configuration
// Generated on Fri Aug 19 2016 18:52:47 GMT-0700 (PDT)
var webpackConfig = require('./webpack.config.js');
module.exports = function(config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '.',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['cucumber-js', 'sinon-chai'],
		plugins: [
			require("karma-coverage"),
			require("karma-cucumber-js-latest"),
			require("karma-chrome-launcher"),
			require("karma-sinon-chai"),
			require("karma-sourcemap-loader"),
			require("karma-webpack")
		],
		// list of files / patterns to load in the browser
		files: [
			{ pattern: "src/main/javascript/**/!(*min).js", included: true },
			{ pattern: "src/test/resources/javascript/feature/**/*.feature", included: false },
			{ pattern: "src/test/javascript/feature/**/*.js", included: false }
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'src/main/javascript/**/!(*min).js': ['webpack', 'coverage', 'sourcemap'],
			'src/test/javascript/**/!(*min).js': ['webpack']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['coverage', 'bdd-json', 'progress'],
		
		bddJSONReporter: {
			outputFile: './target/site/javascript-ut/results.json'
		},

		coverageReporter: {
			type: 'html',
			dir : './target/site/javascript-ut/'
		},

		// web server port
		port: 9877,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['ChromeHeadless'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		//webpack config
		webpack: Object.assign({}, webpackConfig, { 
			devtool: "inline-sourcemap",
			mode: "development"
		}),
		webpackServer: {
			noInfo: true 
		}
	});
}
