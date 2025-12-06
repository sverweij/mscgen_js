var uistate = require('./uistate')
var animator = require('./animator')
var store = require('../utl/store')
var exporter = require('../utl/exporter')
var rasterExporter = require('./raster-exporter')
var svgutensils = require('mscgenjs/dist/cjs/render/graphics/svgutensils')
var generalActions = require('./general-actions')

function setRasterURI (pLinkId) {
  return function (pRasterURI, pError) {
    var lLinkId = document.getElementById(pLinkId)
    if (pError) {
      window.__export_too_big.style.display = 'block'
      lLinkId.href = '#'
      lLinkId.style.display = 'none'
    } else {
      window.__export_too_big.style.display = 'none'
      lLinkId.href = pRasterURI
      lLinkId.style.display = 'flex'
    }
  }
}

function showSaveAsOnClick () {
  window.__save_as_svg.href = exporter.toVectorURI(
    svgutensils.webkitNamespaceBugWorkaround(window.__svg.innerHTML)
  )
  rasterExporter.toRasterURI(
    document,
    window.__svg,
    'image/png',
    setRasterURI('__save_as_png')
  )
  rasterExporter.toRasterURI(
    document,
    window.__svg,
    'image/jpeg',
    setRasterURI('__save_as_jpeg')
  )
  generalActions.togglePanel(
    window.__save_as_panel
  )
}

module.exports = {
  svgOnDblClick: null,
  showSaveAsOnClick,
  htmlOnClick: function () {
    window.open(
      exporter.toHTMLSnippetURI(
        uistate.getSource(),
        uistate.getLanguage(),
        {
          withLinkToEditor: uistate.getLinkToInterpeter(),
          mirrorEntities: uistate.getMirrorEntities(),
          verticalLabelAlignment: uistate.getVerticalLabelAlignment(),
          namedStyle: uistate.getNamedStyle()
        }
      )
    )
  },
  dotOnClick: function () {
    window.open(exporter.todotURI(uistate.getAST()))
  },
  vanillaOnClick: function () {
    window.open(exporter.toVanillaMscGenURI(uistate.getAST()))
  },
  doxygenOnClick: function () {
    window.open(exporter.toDoxygenURI(uistate.getAST()))
  },
  urlOnClick: function () {
    window.history.replaceState(
      {},
      '',
      exporter.toLocationString(
        window.location,
        uistate.getSource(),
        uistate.getLanguage(),
        uistate.getMirrorEntities(),
        uistate.getNamedStyle()
      )
    )
  },
  animOnClick: function () {
    try {
      animator.initialize(uistate.getAST(), uistate.getMirrorEntities())
      // svgutensils.ss(window.__animscreen).show();
    } catch (e) {
      // do nothing
    }
  },
  errorOnClick: function () {
    uistate.errorOnClick()
  },
  renderOptionsOnClick: function () {
    generalActions.togglePanel(
      window.__render_options_panel
    )
  },
  closeRenderOptions: function () {
    generalActions.hideAllPanels()
  },
  optionMirrorEntitiesOnClick: function (pEvent) {
    uistate.setMirrorEntities(pEvent.target.checked)
    uistate.requestRender()
    store.saveSettings(uistate)
  },
  optionIncludeSourceOnClick: function (pEvent) {
    uistate.setIncludeSource(pEvent.target.checked)
    uistate.requestRender()
    store.saveSettings(uistate)
  },
  optionVerticalLabelAlignmentOnChange: function (pEvent) {
    uistate.setVerticalLabelAlignment(pEvent.target.value)
    uistate.requestRender()
    store.saveSettings(uistate)
  },
  styleOnClick: function (pEvent) {
    uistate.setNamedStyle(pEvent.target.value)
    uistate.requestRender()
    store.saveSettings(uistate)
  },
  moreExportOptionsOnClick: function () {
    generalActions.togglePanel(
      window.__output_panel
    )
  },
  closeExportOptions: function () {
    generalActions.hideAllPanels()
  },
  closeSaveAsOptions: function () {
    generalActions.hideAllPanels()
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
