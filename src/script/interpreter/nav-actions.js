var uistate = require('./uistate')
var exporter = require('../utl/exporter')
var generalActions = require('./general-actions')

module.exports = {
  closeCheatSheet: function () {
    generalActions.hideAllPanels()
  },
  closeEmbedSheet: function () {
    generalActions.hideAllPanels()
  },
  closeAboutSheet: function () {
    generalActions.hideAllPanels()
  },
  helpMeOnClick: function () {
    generalActions.togglePanel(
      window.__learn_panel
    )
  },
  embedMeOnClick: function () {
    window.__embedsnippet.textContent =
            exporter.toHTMLSnippet(
              uistate.getSource(),
              uistate.getLanguage(),
              {
                withLinkToEditor: uistate.getLinkToInterpeter(),
                mirrorEntities: uistate.getMirrorEntities(),
                verticalLabelAlignment: uistate.getVerticalLabelAlignment(),
                namedStyle: uistate.getNamedStyle()
              }
            )
    generalActions.togglePanel(
      window.__embed_panel
    )
  },
  linkToInterpreterOnClick: function () {
    uistate.setLinkToInterpeter(!(uistate.getLinkToInterpeter()))
    window.__embedsnippet.textContent =
            exporter.toHTMLSnippet(
              uistate.getSource(),
              uistate.getLanguage(),
              {
                withLinkToEditor: uistate.getLinkToInterpeter(),
                mirrorEntities: uistate.getMirrorEntities(),
                verticalLabelAlignment: uistate.getVerticalLabelAlignment(),
                namedStyle: uistate.getNamedStyle()
              }
            )
    uistate.setAutoRender(uistate.getAutoRender())
  },
  aboutOnClick: function () {
    generalActions.togglePanel(
      window.__aboutsheet
    )
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
