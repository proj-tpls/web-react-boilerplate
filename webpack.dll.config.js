const path = require('path');
const webpack = require('webpack');

const isProductionMode = process.env.NODE_ENV === 'production';
const nameHash = isProductionMode ? '.[hash:8]' : '';

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  entry: {
    vendor: ['react', 'react-dom', 'history', 'dva', 'dva/router', 'dva/saga'],
  },
  output: {
    filename: `[name].dll${nameHash}.js`,
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, 'dist/[name]-manifest.json'),
    }),
  ],
};
