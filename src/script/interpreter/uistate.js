/*
msc {
  hscale="1.2";

  html [label="index.html", textbgcolor="#ddf"]
, ui [label="mscgenui.js"]
, msc [label="xuparser.js"]

, render [label="mscrender.js"]
, utls [label="mscrenderutensils.js"]
, doc [label="window.document", textbgcolor="#ddf"];

  html => ui [label="render"];
  ui =>> doc [label="get input from textarea"];
  doc >> ui [label="text"];
  ui =>> msc [label="parse(text)"];

  --- [label="[hunky dory]", linecolor="green"];
  ui << msc [label="AST"];
  ui => render [label="renderAST(AST, text)"];
  render => utls [label="low level helpers"];
  utls => doc [label="all kinds of dom manipulation"];
  render => doc [label="all kinds of dom manipulation"];
  render note render [label="move dom manipulation down?"];

  --- [label="[parse error]", linecolor="red"];
  ui << msc [label="exception"];
  ui =>> ui [label="show error"];

  ui =>> html [label="show error"];

  |||;
  ui note msc [label="There's a parser for mscgen and a separate one for ms genny.\nFor simplicity only showning one.",
              textbgcolor="#ffe"];
}
*/
/* eslint max-statements: 0 */
var xuparser = require('mscgenjs/dist/cjs/parse/xuparser')
var msgennyparser = require('mscgenjs/dist/cjs/parse/msgennyparser')
var renderast = require('mscgenjs/dist/cjs/render/graphics/renderast')
var ast2msgenny = require('mscgenjs/dist/cjs/render/text/ast2msgenny')
var ast2xu = require('mscgenjs/dist/cjs/render/text/ast2xu')
var maps = require('../utl/maps')
var $ = require('../utl/domutl')
var exporter = require('../utl/exporter')
var populateLists = require('./populate-lists')
var state = require('./state')

var gCodeMirror = {}
var gErrorCoordinates = {
  line: 0,
  column: 0
}

function requestRender () {
  if (state.getAutoRender()) {
    render(getSource(), state.getLanguage())
  }
}

function getASTBare (pSource, pLanguage) {
  if (pLanguage === 'msgenny') {
    return msgennyparser.parse(pSource)
  } else if (pLanguage === 'json') {
    return JSON.parse(pSource)
  } // we use the xu parser for both mscgen and xu:
  return xuparser.parse(pSource)
}

function getAST (pLanguage, pSource) {
  var lLanguage = pLanguage || state.getLanguage()
  var lSource = pSource || getSource()
  return getASTBare(lSource, lLanguage)
}

function clear () {
  if (['mscgen', 'xu'].indexOf(state.getLanguage()) > -1) {
    setSource('msc{\n  \n}')
    setCursorInSource(1, 3)
  } else {
    setSource('')
  }
}

function renderSource (pAST, pLanguage) {
  var lTargetSource = ''

  if (pLanguage === 'msgenny') {
    lTargetSource = ast2msgenny.render(pAST)
  } else if (pLanguage === 'json') {
    lTargetSource = JSON.stringify(pAST, null, '  ')
  } else { // for rendering mscgen we use the xu renderer
    lTargetSource = ast2xu.render(pAST)
  }
  return lTargetSource
}

function getSource () {
  return gCodeMirror.getValue()
}

function setSource (pSource) {
  gCodeMirror.setValue(pSource)
}

function setCursorInSource (pLine, pColumn) {
  gCodeMirror.setCursor(pLine, pColumn)
  gCodeMirror.focus()
}

function setLanguage (pLanguage) {
  state.setLanguage(pLanguage)
  gCodeMirror.setOption('mode', maps.language2Mode(pLanguage))

  window.__language_mscgen.checked = false
  window.__language_msgenny.checked = false
  window.__language_json.checked = false

  if (pLanguage === 'msgenny') {
    window.__language_msgenny.checked = true
    $.ss(window.__btn_more_color_schemes).hide()
    window.__color_panel.style.width = '0'
  } else if (pLanguage === 'json') {
    window.__language_json.checked = true
    $.ss(window.__btn_more_color_schemes).show()
  } else /* "mscgen" === pLanguage || "xu" === pLanguage */{
    window.__language_mscgen.checked = true
    $.ss(window.__btn_more_color_schemes).show()
  }
  requestRender()
}

function handleRenderException (pException, pSource) {
  if (pException.location) {
    gErrorCoordinates.line = pException.location.start.line
    gErrorCoordinates.column = pException.location.start.column
    displayError(
      'Line ' + pException.location.start.line + ', column ' +
            pException.location.start.column + ': ' + pException.message,
      '>>> ' + pSource.split('\n')[pException.location.start.line - 1] + ' <<<'
    )
  } else {
    gErrorCoordinates.line = 0
    gErrorCoordinates.column = 0
    displayError(pException.message)
  }
}

function render (pSource, pLanguage) {
  preRenderReset()
  try {
    var lAST = getASTBare(pSource, pLanguage)
    if (state.getDebug()) {
      try {
        window.history.replaceState(
          {},
          '',
          exporter.toLocationString(
            window.location,
            pSource,
            maps.correctLanguage(
              lAST.meta.extendedFeatures,
              pLanguage
            ),
            state.getMirrorEntities(),
            state.getNamedStyle()
          )
        )
      } catch (e) {
        // on chrome window.history.replaceState barfs when
        // the interpreter runs from a file:// instead of
        // from a server. This try/ catch is a crude way
        // to handle that without breaking the rest of the flow
      }
    }
    renderast.render(
      lAST,
      window,
      '__svg',
      {
        source: state.getIncludeSource() ? pSource : null,
        mirrorEntitiesOnBottom: state.getMirrorEntities(),
        regularArcTextVerticalAlignment: state.getVerticalLabelAlignment(),
        additionalTemplate: state.getNamedStyle()
      }
    )
    if (lAST.entities.length > 0) {
      showRenderSuccess(lAST.meta)
    }
  } catch (e) {
    handleRenderException(e, pSource)
  }
}

function preRenderReset () {
  hideError()
  $.ss(window.__output_controls_area).hide()
  $.ss(window.__placeholder).show('flex')
  $.ss(window.__svg).hide()
  renderast.clean('__svg', window)
}

function showRenderSuccess (pMeta) {
  $.ss(window.__output_controls_area).show()
  $.ss(window.__placeholder).hide()
  $.ss(window.__svg).show()
  showExtendedArcTypeFeatures(pMeta)
  showExtendedFeatures(pMeta)
  state.setLanguage(maps.correctLanguage(pMeta.extendedFeatures, state.getLanguage()))
}

function showExtendedArcTypeFeatures (pMeta) {
  if (pMeta && pMeta.extendedArcTypes === true) {
    $.ss(window.__show_anim).hide()
  } else {
    $.ss(window.__show_anim).show()
  }
}

function showExtendedFeatures (pMeta) {
  if (pMeta && pMeta.extendedFeatures === true) {
    $.ss(window.__xu_notify).show()
  } else {
    $.ss(window.__xu_notify).hide()
  }
}

function setAutoRender (pAutoRender) {
  state.setAutoRender(pAutoRender)
  if (pAutoRender) {
    window.__autorender.checked = true
    $.ss(window.__btn_render).hide()
  } else {
    window.__autorender.checked = false
    $.ss(window.__btn_render).show()
  }
}

function hideError () {
  $.ss(window.__error).hide()
  window.__error_output.textContent = ''
  window.__error_context.textContent = ''
}

function displayError (pError, pContext) {
  $.ss(window.__error).show()
  $.ss(window.__placeholder).hide()
  window.__error_output.textContent = pError
  window.__error_context.textContent = pContext
}

module.exports = {
  init: function (pCodeMirror) {
    gCodeMirror = pCodeMirror
    setAutoRender(state.getAutoRender())
    setLanguage(state.getLanguage())
    populateLists.initSamples(state.getDebug())
    populateLists.initNamedStyles()
    if (window.__loading) {
      window.__loading.outerHTML = ''
    }
  },

  switchLanguage: function (pLanguage) {
    var lAST = {}

    try {
      lAST = getAST()
      if (lAST !== {}) {
        setSource(renderSource(lAST, pLanguage))
      }
    } catch (e) {
      // do nothing
    }
    setLanguage(pLanguage)
  },
  manipulateSource: function (pFunction) {
    var lAST = {}

    try {
      lAST = getAST()
      if (lAST !== {}) {
        setSource(
          renderSource(
            pFunction(lAST),
            state.getLanguage()
          )
        )
      }
    } catch (e) {
      // do nothing
    }
  },
  setSample: function (pURL) {
    if (pURL === 'none' || !pURL) {
      clear()
    } else {
      $.ajax(
        pURL,
        function onSuccess (pEvent) {
          setLanguage(maps.classifyExtension(pURL))
          setSource(pEvent.target.response)
        },
        function onError () {
          setSource("# could not find or open '" + pURL + "'")
        }
      )
    }
  },

  errorOnClick: function () {
    setCursorInSource(gErrorCoordinates.line - 1, gErrorCoordinates.column - 1)
  },

  /**
     * parses + renders the given source in the given language
     * @type {string} source
     * @type {string} language (one of mscgen, xu, msgenny or json)
     */
  render: render,

  /**
     *  parse + renders the current source in the current
     *  language if 'autorender' is on
     */
  requestRender: requestRender,
  getAutoRender: state.getAutoRender,
  setAutoRender: setAutoRender,
  getSource: getSource,
  setSource: setSource,
  getLanguage: state.getLanguage,
  setLanguage: setLanguage,
  getDebug: state.getDebug,
  setDebug: function (pBoolean) {
    state.setDebug(pBoolean)
    if (state.getDebug()) {
      $.doForAllOfClass('debug', function (pDomNode) {
        $.ss(pDomNode).show()
      })
    }
  },
  getAST: getAST,
  getLinkToInterpeter: state.getLinkToInterpreter,
  setLinkToInterpeter: function (pBoolean) {
    state.setLinkToInterpreter(pBoolean)
    window.__link_to_interpreter.checked = pBoolean
  },
  setMirrorEntities: function (pBoolean) {
    state.setMirrorEntities(pBoolean)
    window.__option_mirror_entities.checked = pBoolean
  },
  getMirrorEntities: state.getMirrorEntities,
  setIncludeSource: function (pBoolean) {
    state.setIncludeSource(pBoolean)
    window.__option_include_source.checked = pBoolean
  },
  getIncludeSource: state.getIncludeSource,
  setNamedStyle: function (pStyle) {
    window.__option_style_basic.checked = false
    window.__option_style_inverted.checked = false
    window.__option_style_grayscaled.checked = false
    window.__option_style_fountainpen.checked = false
    window.__option_style_lazy.checked = false
    window.__option_style_cygne.checked = false
    window.__option_style_pegasse.checked = false
    window.__option_style_classic.checked = false
    window.__option_style_noentityboxes.checked = false

    var lOptionToCheck = document.getElementById('__option_style_' + pStyle)
    if (lOptionToCheck) {
      lOptionToCheck.checked = true
      state.setNamedStyle(pStyle)
    } else {
      window.__option_style_basic.checked = true
      state.setNamedStyle('basic')
    }
  },
  getNamedStyle: state.getNamedStyle,
  setVerticalLabelAlignment: function (pVerticalLabelAlignment) {
    window.__option_vertical_label_alignment.value = pVerticalLabelAlignment
    state.setVerticalLabelAlignment(pVerticalLabelAlignment)
  },
  getVerticalLabelAlignment: state.getVerticalLabelAlignment,
  preRenderReset: preRenderReset
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
