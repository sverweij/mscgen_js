var ast2dot = require('mscgenjs/dist/cjs/render/text/ast2dot')
var ast2mscgen = require('mscgenjs/dist/cjs/render/text/ast2mscgen')
var ast2doxygen = require('mscgenjs/dist/cjs/render/text/ast2doxygen')
const queryString = require('query-string')

/* max length of an URL on github (4122) - "https://sverweij.github.io/".length (27) - 1 */
var MAX_LOCATION_LENGTH = 4094
var gTemplate =
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '  <head>\n' +
    "    <meta content='text/html;charset=utf-8' http-equiv='Content-Type'>\n" +
    '{{config}}' +
    "    <script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer>\n" +
    '    </script>\n' +
    '  </head>\n' +
    '  <body>\n' +
    "    <pre class='code {{language}} mscgen_js'{{data-language}}{{namedstyle}}{{mirrorentities}}{{verticalalignment}}>\n" +
    '{{source}}\n' +
    '    </pre>\n' +
    '  </body>\n' +
    '</html>'
var gLinkToEditorConfig =
    '    <script>\n' +
    '      var mscgen_js_config = {\n' +
    '        clickable: true\n' +
    '      }\n' +
    '    </script>\n'

function extractNamedStyle (pNamedStyle) {
  return pNamedStyle && pNamedStyle !== 'none'
    ? " data-named-style='" + pNamedStyle + "'"
    : ''
}

function extractDataLanguage (pLanguage) {
  return pLanguage && pLanguage !== 'mscgen'
    ? " data-language='" + pLanguage + "'"
    : ''
}

function extractMirrorEntities (pMirrorEntities) {
  return pMirrorEntities ? " data-mirror-entities='true'" : ''
}

function extractVerticalAlignment (pAlignment) {
  return pAlignment && pAlignment !== 'middle'
    ? " data-regular-arc-text-vertical-alignment='" + pAlignment + "'"
    : ''
}

function extractLinkToEditor (pWithLinkToEditor) {
  return pWithLinkToEditor ? gLinkToEditorConfig : ''
}

function extractSource (pSource) {
  return pSource.replace(/</g, '&lt;')
}

function toHTMLSnippet (pSource, pLanguage, pOptions) {
  return gTemplate
    .replace(/{{config}}/g, extractLinkToEditor(pOptions.withLinkToEditor))
    .replace(/{{language}}/g, pLanguage)
    .replace(/{{data-language}}/g, extractDataLanguage(pLanguage))
    .replace(/{{mirrorentities}}/g, extractMirrorEntities(pOptions.mirrorEntities))
    .replace(/{{verticalalignment}}/g, extractVerticalAlignment(pOptions.verticalLabelAlignment))
    .replace(/{{namedstyle}}/g, extractNamedStyle(pOptions.namedStyle))
    .replace(/{{source}}/g, extractSource(pSource))
}

function getAdditionalParameters (pLocation, pMirrorEntities, pNamedStyle) {
  var lParams = queryString.parse(pLocation.search)
  var lAdditionalParameters = ''

  if (lParams.donottrack) {
    lAdditionalParameters += '&donottrack=' + lParams.donottrack
  }
  if (lParams.debug) {
    lAdditionalParameters += '&debug=' + lParams.debug
  }
  if (pMirrorEntities) {
    lAdditionalParameters += '&mirrorentities=' + pMirrorEntities
  }
  if (pNamedStyle) {
    lAdditionalParameters += '&style=' + pNamedStyle
  }
  return lAdditionalParameters
}

function source2LocationString (pLocation, pSource, pLanguage, pMirrorEntities, pNamedStyle) {
  return pLocation.pathname +
            '?lang=' + pLanguage +
            getAdditionalParameters(pLocation, pMirrorEntities, pNamedStyle) +
            '&msc=' + encodeURIComponent(pSource)
}

function sourceIsURLable (pLocation, pSource, pLanguage, pMirrorEntities, pNamedStyle) {
  return source2LocationString(pLocation, pSource, pLanguage, pMirrorEntities, pNamedStyle).length < MAX_LOCATION_LENGTH
}

module.exports = {
  toVectorURI: function (pSVGSource) {
    return 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent('<!DOCTYPE svg [<!ENTITY nbsp "&#160;">]>'.concat(pSVGSource))
  },
  toHTMLSnippet,
  toHTMLSnippetURI: function (pSource, pLanguage, pOptions) {
    return 'data:text/plain;charset=utf-8,' +
                encodeURIComponent(toHTMLSnippet(pSource, pLanguage, pOptions))
  },
  todotURI: function (pAST) {
    return 'data:text/plain;charset=utf-8,' +
                encodeURIComponent(ast2dot.render(pAST))
  },
  toVanillaMscGenURI: function (pAST) {
    return 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(ast2mscgen.render(pAST))
  },
  toDoxygenURI: function (pAST) {
    return 'data:text/plain;charset=utf-8,' +
        encodeURIComponent(ast2doxygen.render(pAST))
  },
  toLocationString: function (pLocation, pSource, pLanguage, pMirrorEntities, pNamedStyle) {
    var lSource = '# source too long for an URL'
    if (sourceIsURLable(pLocation, pSource, pLanguage, pMirrorEntities, pNamedStyle)) {
      lSource = pSource
    }
    return source2LocationString(pLocation, lSource, pLanguage, pMirrorEntities, pNamedStyle)
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
