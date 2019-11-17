var path = require( 'path' );
var webpack = require( 'webpack' );
 
module.exports = {
	entry: './main.js',
	output: { path: '/home/ec2-user/server/public/js', filename: 'bundle.js' },
	module: {
        	rules: [
            		{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
};
