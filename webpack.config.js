module.exports = () => {
  return {
    mode: 'development',
    entry: './src/script/mscgen-interpreter.js',
    output: {
      filename: 'mscgen-interpreter.min.js',
      path: `${__dirname}/build`
    }
  }
}
