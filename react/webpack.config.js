var path = require( 'path' );
var webpack = require( 'webpack' );
 
module.exports = {
	entry: './main.js',
	mode: 'development',
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
	resolve: {
	    extensions: ['*','.js','.jsx' ]
	}
};
