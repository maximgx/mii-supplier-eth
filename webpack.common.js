const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		supplier: './src/index.js'
	},

	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'Supplier',
			// template: 'src/index.html'
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				// Solves the problem of requiring 'solc'
				webPreferences: {
					nodeIntegration: false
				}
			}
		})
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				// query: {
				// 	plugins: ['transform-runtime']
				// }
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.sol$/,
				loaders: ['solc-loader']
			}
		]
	},

	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
};

// const path = require('path');
//
// module.exports = {
//   entry: './src/index.js',
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist')
//   }
// };
