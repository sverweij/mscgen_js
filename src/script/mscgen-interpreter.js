/* eslint max-params: 0 */
var inputActions = require('./interpreter/input-actions')
var outputActions = require('./interpreter/output-actions')
var navActions = require('./interpreter/nav-actions')
var paramActions = require('./interpreter/param-actions')
var generalActions = require('./interpreter/general-actions')
var editorEvents = require('./interpreter/editor-events')

function setupInputEvents () {
  window.__autorender.addEventListener('click', inputActions.autorenderOnClick, false)
  window.__language_msgenny.addEventListener('click', inputActions.languageMsGennyOnClick, false)
  window.__language_mscgen.addEventListener('click', inputActions.languageMscGenOnClick, false)
  window.__language_json.addEventListener('click', inputActions.languageJSONOnClick, false)
  window.__btn_more_color_schemes.addEventListener('click', inputActions.moreColorSchemesOnClick, false)
  window.__color_minimal.addEventListener('click', inputActions.colorMinimalOnClick, false)
  window.__color_minimal_force.addEventListener('click', inputActions.colorMinimalFOnClick, false)
  window.__color_rose.addEventListener('click', inputActions.colorRoseOnClick, false)
  window.__color_rose_force.addEventListener('click', inputActions.colorRoseFOnClick, false)
  window.__color_bluey.addEventListener('click', inputActions.colorBlueyOnClick, false)
  window.__color_bluey_force.addEventListener('click', inputActions.colorBlueyFOnClick, false)
  window.__color_auto.addEventListener('click', inputActions.colorAutoOnClick, false)
  window.__color_auto_force.addEventListener('click', inputActions.colorAutoFOnClick, false)
  window.__color_remove.addEventListener('click', inputActions.uncolorizeOnClick, false)
  window.__btn_render.addEventListener('click', inputActions.renderOnClick, false)
  window.__samples.addEventListener('change', inputActions.samplesOnChange, false)
  window.__save.addEventListener('click', inputActions.saveOnClick, false)
  window.__load.addEventListener('click', inputActions.loadOnClick, false)
  window.__btn_color_panel_close.addEventListener('click', inputActions.closeColorPanel, false)
}

function setupOutputEvents () {
  window.__svg.addEventListener('dblclick', outputActions.svgOnDblClick, false)
  window.__show_save_as.addEventListener('click', outputActions.showSaveAsOnClick, false)
  window.__render_options.addEventListener('click', outputActions.renderOptionsOnClick, false)
  window.__btn_render_options_close.addEventListener('click', outputActions.closeRenderOptions, false)
  window.__option_mirror_entities.addEventListener('click', outputActions.optionMirrorEntitiesOnClick, false)
  window.__option_include_source.addEventListener('click', outputActions.optionIncludeSourceOnClick, false)
  window.__option_vertical_label_alignment.addEventListener(
    'change', outputActions.optionVerticalLabelAlignmentOnChange, false
  )
  window.__option_style_basic.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_inverted.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_grayscaled.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_fountainpen.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_lazy.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_cygne.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_pegasse.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_classic.addEventListener('click', outputActions.styleOnClick, false)
  window.__option_style_noentityboxes.addEventListener('click', outputActions.styleOnClick, false)
  window.__more_export_options.addEventListener('click', outputActions.moreExportOptionsOnClick, false)
  window.__btn_output_panel_close.addEventListener('click', outputActions.closeExportOptions, false)
  window.__btn_save_as_panel_close.addEventListener('click', outputActions.closeSaveAsOptions, false)
  window.__show_html.addEventListener('click', outputActions.htmlOnClick, false)
  window.__show_dot.addEventListener('click', outputActions.dotOnClick, false)
  window.__show_vanilla.addEventListener('click', outputActions.vanillaOnClick, false)
  window.__show_doxygen.addEventListener('click', outputActions.doxygenOnClick, false)
  window.__show_url.addEventListener('click', outputActions.urlOnClick, false)
  window.__show_anim.addEventListener('click', outputActions.animOnClick, false)
  window.__error.addEventListener('click', outputActions.errorOnClick, false)
}

function setupInfoNavigationEvents () {
  window.__close_lightbox.addEventListener('click', navActions.closeCheatSheet, false)
  window.__btn_embed_panel_close.addEventListener('click', navActions.closeEmbedSheet, false)
  window.__close_aboutsheet.addEventListener('click', navActions.closeAboutSheet, false)
  window.__helpme.addEventListener('click', navActions.helpMeOnClick, false)
  window.__embedme.addEventListener('click', navActions.embedMeOnClick, false)
  window.__link_to_interpreter.addEventListener('click', navActions.linkToInterpreterOnClick, false)
  window.__about.addEventListener('click', navActions.aboutOnClick, false)
  window.document.body.addEventListener('keydown', generalActions.keyDown, false)
}

function setupEvents () {
  editorEvents.init(window.__msc_input)
  paramActions.processParams()

  setupInputEvents()
  setupOutputEvents()
  setupInfoNavigationEvents()
  paramActions.tagAllLinks()
}

setupEvents()
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
