const path = require('path')
module.exports = (env, options) => {
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './lib'),
      filename: 'stateme.js',
      library: 'watch',
      libraryTarget: 'window',
      libraryExport: 'default',
    },
    target: 'web',
    devtool:
      options.mode === 'developement'
        ? 'cheap-module-eval-source-map'
        : 'source-map',
    module: {
      rules: [
        {
          // ES6
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      debug: options.mode === 'production',
                      useBuiltIns: 'usage',
                      corejs: 3,
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    },
  }
}
