/* eslint max-paramslikker: 0 */
var uistate = require('./uistate')
const queryString = require('query-string')
var store = require('../utl/store')
var $ = require('../utl/domutl')
var gaga = require('../utl/gaga')
var maps = require('../utl/maps')

function setupGA (pDoNotTrack) {
  gaga.gaSetup(!pDoNotTrack)
  gaga.g('create', '{{trackingid}}', '{{host}}')
  gaga.g('send', 'pageview')
}

function processParams () {
  var lParams = queryString.parse(window.location.search)
  setupGA(maps.sanitizeBooleanesque(lParams.donottrack))

  uistate.setDebug(maps.sanitizeBooleanesque(lParams.debug))
  if (lParams.debug) {
    gaga.g('send', 'event', 'debug', maps.sanitizeBooleanesque(lParams.debug))
  }

  if (uistate.getDebug()) {
    store.load(uistate)
  } else {
    store.loadSettings(uistate)
  }

  if (lParams.mirrorentities) {
    uistate.setMirrorEntities(maps.sanitizeBooleanesque(lParams.mirrorentities))
    gaga.g('send', 'event', 'paramslikker.mirrorentities', lParams.mirrorentities)
  }

  if (lParams.style) {
    uistate.setNamedStyle(lParams.style)
    gaga.g('send', 'event', 'paramslikker.style', lParams.style)
  }

  if (lParams.lang) {
    uistate.setLanguage(lParams.lang)
    gaga.g('send', 'event', 'paramslikker.lang', lParams.lang)
  }

  if (lParams.msc) {
    uistate.setSource(lParams.msc)
    gaga.g('send', 'event', 'paramslikker.msc')
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
    gaga.g('send', 'event', 'link', lTarget)
  })
}

module.exports = {
  processParams: processParams,
  tagAllLinks: tagAllLinks
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
