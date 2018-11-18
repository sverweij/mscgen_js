const path = require('path')
const process = require('process')
const lBaseFolder = process.env.BUILDDIR || 'dist'

const baseFolderify = (pBaseFolder) => (pPath) => path.join(pBaseFolder, pPath)

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
  ].map(baseFolderify(lBaseFolder)),
  stripPrefix: `${lBaseFolder}/`,
  swFile: baseFolderify(lBaseFolder)('service-worker.js')
}
