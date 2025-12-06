var uistate = require('./uistate')
const queryString = require('query-string')
var store = require('../utl/store')
var $ = require('../utl/domutl')
var maps = require('../utl/maps')

function processParams () {
  var lParams = queryString.parse(window.location.search)

  uistate.setDebug(maps.sanitizeBooleanesque(lParams.debug))

  if (uistate.getDebug()) {
    store.load(uistate)
  } else {
    store.loadSettings(uistate)
  }

  if (lParams.mirrorentities) {
    uistate.setMirrorEntities(maps.sanitizeBooleanesque(lParams.mirrorentities))
  }

  if (lParams.style) {
    uistate.setNamedStyle(lParams.style)
  }

  if (lParams.lang) {
    uistate.setLanguage(lParams.lang)
  }

  if (lParams.msc) {
    uistate.setSource(lParams.msc)
  } else if (uistate.getSource().length <= 0) {
    uistate.setSample()
  }
}

function tagAllLinks () {
  $.attachEventHandler('a[href]', 'click', function (e) {
    var lTarget = 'unknown'

    if (e.currentTarget) {
      if (e.currentTarget.href) {
        lTarget = e.currentTarget.href
      }
      if (e.currentTarget.download && e.currentTarget.type) {
        lTarget = e.currentTarget.type
      }
    }
  })
}

module.exports = {
  processParams,
  tagAllLinks
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
