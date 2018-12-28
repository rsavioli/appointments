const path = require('path');

module.exports = {
	entry: "./webpack-sample/index.js",
	output: {
		path: path.join(__dirname, "webpack-sample"),
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{ include: /\.json$/, loaders: ["json-loader"] }
		]
	},
	resolve: {
		extensions: ['', '.json', '.jsx', '.js']
	}
};