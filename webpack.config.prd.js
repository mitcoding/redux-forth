const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const baseDevConfig = require('./webpack.config.base.dev.js');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(merge(baseDevConfig, {
	devtool: 'nosources-source-map',
	mode: "production"	
}) );