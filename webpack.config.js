const path = require('path')

module.exports = (pOne, pArguments) => {
  let lRetval = {
    entry: './src/script/mscgen-interpreter.js',
    output: {
      filename: 'mscgen-interpreter.min.js',
      path: path.join(__dirname, pArguments.outputPath || 'dist')
    }
  }

  if (pArguments.mode === 'development') {
    lRetval.devtool = 'source-map'
  }

  return lRetval
}
