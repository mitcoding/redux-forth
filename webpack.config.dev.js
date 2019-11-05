const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const baseDevConfig = require('./webpack.config.base.dev.js');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap(baseDevConfig);