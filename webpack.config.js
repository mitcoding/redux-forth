module.exports = (env = "prd") => {
	return require(`./webpack.config.${env}.js`)
}