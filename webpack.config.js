module.exports = {
	entry: './dashboard/client',
	output: {
		filename: 'index.js',
		libraryTarget: "umd"
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.scss$/,
				loaders: ['style', 'css', 'sass']
			}
		],
	}
};
