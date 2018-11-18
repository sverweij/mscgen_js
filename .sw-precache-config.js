const path = require('path')
const process = require('process')
const lBaseFolder = process.env.BUILDDIR || 'dist'

module.exports = {
  staticFileGlobs: [
    'favicon.ico',
    'favicon.ico',
    'fonts/*',
    'images/bg.png',
    'images/mugshot.jpg',
    'images/test14_cheat_sheet.svg',
    'index.html',
    'manifest.json',
    'mscgen-interpreter.min.js',
    'style/interp.css'
  ].map(pGlob => path.join(lBaseFolder, pGlob)),
  stripPrefix: lBaseFolder,
  swFile: path.join(lBaseFolder, 'service-worker.js')
}
