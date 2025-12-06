const path = require('path')

module.exports = (_pOne, pArguments) => {
  return {
    entry: './src/script/mscgen-interpreter.js',
    devtool: 'source-map',
    output: {
      filename: 'mscgen-interpreter.min.js',
      path: path.join(__dirname, pArguments.outputPath || 'docs')
    }
  }
}
