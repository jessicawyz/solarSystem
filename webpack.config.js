const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // Set to 'production' for deployment
  entry: './src/main.js', // Entry point for your JS
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    // Automatically include the index.html file in the build
    new HtmlWebpackPlugin({
      template: './src/index.html', // Source HTML file
    }),
    // Copy shaders and textures to the output directory
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/shaders', to: 'shaders' }, // Copy shaders to 'dist/shaders'
        { from: './src/textures', to: 'textures' }, // Copy textures to 'dist/textures'
      ],
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, 'dist'), // Serve static files from 'dist'
    port: 8080, // Development server port
  },
  module: {
    rules: [
      {
        test: /\.(glsl|vs|fs)$/, // Load shader files
        use: 'raw-loader',
      },
    ],
  },
};
