var uistate = require('./uistate')
var codemirror = require('codemirror')
var maps = require('../utl/maps')
require('codemirror/addon/edit/closebrackets')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/display/placeholder')
require('codemirror/addon/dialog/dialog')
require('codemirror/addon/search/searchcursor')
require('codemirror/addon/search/search')
require('codemirror/addon/selection/active-line')
require('codemirror/mode/mscgen/mscgen')
require('codemirror/mode/javascript/javascript')

var gGaKeyCount = 0
var gCodeMirror = {}
var gBufferTimer = {}

/*
    Average typing speeds (source: https://en.wikipedia.org/wiki/Words_per_minute)
    1 wpm = 5 cpm
    transcription:
        fast        : 40wpm = 200cpm = 200c/60s = 200c/60000ms => 300 ms/character
        moderate    : 35wpm = 175cpm = 343ms/character
        slow        : 23wpm = 115cpm => 522ms/character
    composition:
        average     : 19wpm = 95cpm  => 630ms/ character

        But: average professional typists can reach 50 - 80 wpm

    So, about 630ms would be good enough for a buffer to timeout.
*/
var BUFFER_TIMEOUT = 500

function init (pElement) {
  gCodeMirror = codemirror.fromTextArea(pElement, {
    lineNumbers: true,
    autoCloseBrackets: true,
    autofocus: true,
    matchBrackets: true,
    styleActiveLine: true,
    theme: 'blackboard',
    mode: 'xu',
    placeholder: 'Type your text. Or drag a file to this area....',
    lineWrapping: false
  })
}

function summedLength (pArray) {
  return pArray.reduce(
    function (pSum, pCur) {
      return pSum + pCur.length
    },
    0
  )
}

function isBigChange (pChange) {
  return Math.max(summedLength(pChange.text), summedLength(pChange.removed)) > 1
}

function setupEditorEvents () {
  gCodeMirror.on('change', function (pUnused, pChange) {
    onInputChanged(isBigChange(pChange))
    if (gGaKeyCount > 17) {
      gGaKeyCount = 0
    } else {
      gGaKeyCount++
    }
  })

  gCodeMirror.on('drop', function (pUnused, pEvent) {
    /* if there is a file in the drop event clear the textarea,
            * otherwise do default handling for drop events (whatever it is)
            */
    if (pEvent.dataTransfer.files.length > 0) {
      uistate.setLanguage(maps.classifyExtension(pEvent.dataTransfer.files[0].name))
      uistate.setSource('')
    }
  })
}

function requestRender () {
  uistate.requestRender()
  window.clearTimeout(gBufferTimer)
}

function onInputChanged (pBigChange) {
  if (uistate.getSource() === '') {
    /* no need to render no input */
    uistate.preRenderReset()
  } else if (pBigChange) {
    /* probably a drag/ drop, paste operation or sample replacement
            * can be rendered without buffering
            */
    uistate.requestRender()
  } else if (uistate.getAutoRender()) {
    /* probably editing by typing in the editor - buffer for
            * a few ms
            */
    window.clearTimeout(gBufferTimer)
    gBufferTimer = window.setTimeout(requestRender, BUFFER_TIMEOUT)
  }
}

module.exports = {
  init: function (pElement) {
    init(pElement)
    uistate.init(gCodeMirror)
    setupEditorEvents()
  }
}
/*
 This file is part of mscgen_js.

 mscgen_js is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 mscgen_js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with mscgen_js.  If not, see <http://www.gnu.org/licenses/>.
 */
