var inputActions = require('./interpreter/input-actions')
var outputActions = require('./interpreter/output-actions')
var navActions = require('./interpreter/nav-actions')
var paramActions = require('./interpreter/param-actions')
var generalActions = require('./interpreter/general-actions')
var editorEvents = require('./interpreter/editor-events')

function setupInputEvents() {
  window.__autorender.addEventListener('click', inputActions.autorenderOnClick, { capture: false, passive: true })
  window.__language_msgenny.addEventListener('click', inputActions.languageMsGennyOnClick, { capture: false, passive: true })
  window.__language_mscgen.addEventListener('click', inputActions.languageMscGenOnClick, { capture: false, passive: true })
  window.__language_json.addEventListener('click', inputActions.languageJSONOnClick, { capture: false, passive: true })
  window.__btn_more_color_schemes.addEventListener('click', inputActions.moreColorSchemesOnClick, { capture: false, passive: true })
  window.__color_minimal.addEventListener('click', inputActions.colorMinimalOnClick, { capture: false, passive: true })
  window.__color_minimal_force.addEventListener('click', inputActions.colorMinimalFOnClick, { capture: false, passive: true })
  window.__color_rose.addEventListener('click', inputActions.colorRoseOnClick, { capture: false, passive: true })
  window.__color_rose_force.addEventListener('click', inputActions.colorRoseFOnClick, { capture: false, passive: true })
  window.__color_bluey.addEventListener('click', inputActions.colorBlueyOnClick, { capture: false, passive: true })
  window.__color_bluey_force.addEventListener('click', inputActions.colorBlueyFOnClick, { capture: false, passive: true })
  window.__color_auto.addEventListener('click', inputActions.colorAutoOnClick, { capture: false, passive: true })
  window.__color_auto_force.addEventListener('click', inputActions.colorAutoFOnClick, { capture: false, passive: true })
  window.__color_remove.addEventListener('click', inputActions.uncolorizeOnClick, { capture: false, passive: true })
  window.__btn_render.addEventListener('click', inputActions.renderOnClick, { capture: false, passive: true })
  window.__samples.addEventListener('change', inputActions.samplesOnChange, { capture: false, passive: true })
  window.__save.addEventListener('click', inputActions.saveOnClick, { capture: false, passive: true })
  window.__load.addEventListener('click', inputActions.loadOnClick, { capture: false, passive: true })
  window.__btn_color_panel_close.addEventListener('click', inputActions.closeColorPanel, { capture: false, passive: true })
}

function setupOutputEvents() {
  window.__svg.addEventListener('dblclick', outputActions.svgOnDblClick, { capture: false, passive: true })
  window.__show_save_as.addEventListener('click', outputActions.showSaveAsOnClick, { capture: false, passive: true })
  window.__render_options.addEventListener('click', outputActions.renderOptionsOnClick, { capture: false, passive: true })
  window.__btn_render_options_close.addEventListener('click', outputActions.closeRenderOptions, { capture: false, passive: true })
  window.__option_mirror_entities.addEventListener('click', outputActions.optionMirrorEntitiesOnClick, { capture: false, passive: true })
  window.__option_include_source.addEventListener('click', outputActions.optionIncludeSourceOnClick, { capture: false, passive: true })
  window.__option_vertical_label_alignment.addEventListener(
    'change', outputActions.optionVerticalLabelAlignmentOnChange, { capture: false, passive: true }
  )
  window.__option_style_basic.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_inverted.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_grayscaled.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_fountainpen.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_lazy.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_cygne.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_pegasse.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_classic.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__option_style_noentityboxes.addEventListener('click', outputActions.styleOnClick, { capture: false, passive: true })
  window.__more_export_options.addEventListener('click', outputActions.moreExportOptionsOnClick, { capture: false, passive: true })
  window.__btn_output_panel_close.addEventListener('click', outputActions.closeExportOptions, { capture: false, passive: true })
  window.__btn_save_as_panel_close.addEventListener('click', outputActions.closeSaveAsOptions, { capture: false, passive: true })
  window.__show_html.addEventListener('click', outputActions.htmlOnClick, { capture: false, passive: true })
  window.__show_dot.addEventListener('click', outputActions.dotOnClick, { capture: false, passive: true })
  window.__show_vanilla.addEventListener('click', outputActions.vanillaOnClick, { capture: false, passive: true })
  window.__show_doxygen.addEventListener('click', outputActions.doxygenOnClick, { capture: false, passive: true })
  window.__show_url.addEventListener('click', outputActions.urlOnClick, { capture: false, passive: true })
  window.__show_anim.addEventListener('click', outputActions.animOnClick, { capture: false, passive: true })
  window.__error.addEventListener('click', outputActions.errorOnClick, { capture: false, passive: true })
}

function setupInfoNavigationEvents() {
  window.__close_lightbox.addEventListener('click', navActions.closeCheatSheet, { capture: false, passive: true })
  window.__btn_embed_panel_close.addEventListener('click', navActions.closeEmbedSheet, { capture: false, passive: true })
  window.__close_aboutsheet.addEventListener('click', navActions.closeAboutSheet, { capture: false, passive: true })
  window.__helpme.addEventListener('click', navActions.helpMeOnClick, { capture: false, passive: true })
  window.__embedme.addEventListener('click', navActions.embedMeOnClick, { capture: false, passive: true })
  window.__link_to_interpreter.addEventListener('click', navActions.linkToInterpreterOnClick, { capture: false, passive: true })
  window.__about.addEventListener('click', navActions.aboutOnClick, { capture: false, passive: true })
  window.document.body.addEventListener('keydown', generalActions.keyDown, { capture: false, passive: true })
}

function setupEvents() {
  editorEvents.init(window.__msc_input)
  paramActions.processParams()

  setupInputEvents()
  setupOutputEvents()
  setupInfoNavigationEvents()
  paramActions.tagAllLinks()
}

setupEvents()
require('./interpreter/register-service-worker.js')
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
