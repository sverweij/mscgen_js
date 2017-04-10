/* eslint max-params: 0 */
/* global require */
require([
    "./interpreter/input-actions",
    "./interpreter/output-actions",
    "./interpreter/nav-actions",
    "./interpreter/param-actions",
    "./interpreter/general-actions",
    "./interpreter/editor-events"
],
function(iactions, oactions, nactions, par, gactions, edit) {
    "use strict";

    function setupInputEvents(){
        window.__autorender.addEventListener("click", iactions.autorenderOnClick, false);
        window.__language_msgenny.addEventListener("click", iactions.languageMsGennyOnClick, false);
        window.__language_mscgen.addEventListener("click", iactions.languageMscGenOnClick, false);
        window.__language_json.addEventListener("click", iactions.languageJSONOnClick, false);
        window.__btn_more_color_schemes.addEventListener("click", iactions.moreColorSchemesOnClick, false);
        window.__color_minimal.addEventListener("click", iactions.colorMinimalOnClick, false);
        window.__color_minimal_force.addEventListener("click", iactions.colorMinimalFOnClick, false);
        window.__color_rose.addEventListener("click", iactions.colorRoseOnClick, false);
        window.__color_rose_force.addEventListener("click", iactions.colorRoseFOnClick, false);
        window.__color_bluey.addEventListener("click", iactions.colorBlueyOnClick, false);
        window.__color_bluey_force.addEventListener("click", iactions.colorBlueyFOnClick, false);
        window.__color_auto.addEventListener("click", iactions.colorAutoOnClick, false);
        window.__color_auto_force.addEventListener("click", iactions.colorAutoFOnClick, false);
        window.__color_remove.addEventListener("click", iactions.uncolorizeOnClick, false);
        window.__btn_render.addEventListener("click", iactions.renderOnClick, false);
        window.__samples.addEventListener("change", iactions.samplesOnChange, false);
        window.__save.addEventListener("click", iactions.saveOnClick, false);
        window.__load.addEventListener("click", iactions.loadOnClick, false);
        window.__btn_color_panel_close.addEventListener("click", iactions.closeColorPanel, false);
    }

    function setupOutputEvents(){
        window.__svg.addEventListener("dblclick", oactions.svgOnDblClick, false);
        window.__show_save_as.addEventListener("click", oactions.showSaveAsOnClick, false);
        window.__render_options.addEventListener("click", oactions.renderOptionsOnClick, false);
        window.__btn_render_options_close.addEventListener("click", oactions.closeRenderOptions, false);
        window.__option_mirror_entities.addEventListener("click", oactions.optionMirrorEntitiesOnClick, false);
        window.__option_include_source.addEventListener("click", oactions.optionIncludeSourceOnClick, false);
        window.__option_vertical_label_alignment.addEventListener(
            "change", oactions.optionVerticalLabelAlignmentOnChange, false
        );
        window.__option_style_basic.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_inverted.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_grayscaled.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_fountainpen.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_lazy.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_cygne.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_pegasse.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_classic.addEventListener("click", oactions.styleOnClick, false);
        window.__option_style_noentityboxes.addEventListener("click", oactions.styleOnClick, false);
        window.__more_export_options.addEventListener("click", oactions.moreExportOptionsOnClick, false);
        window.__btn_output_panel_close.addEventListener("click", oactions.closeExportOptions, false);
        window.__btn_save_as_panel_close.addEventListener("click", oactions.closeSaveAsOptions, false);
        window.__show_html.addEventListener("click", oactions.htmlOnClick, false);
        window.__show_dot.addEventListener("click", oactions.dotOnClick, false);
        window.__show_vanilla.addEventListener("click", oactions.vanillaOnClick, false);
        window.__show_doxygen.addEventListener("click", oactions.doxygenOnClick, false);
        window.__show_url.addEventListener("click", oactions.urlOnClick, false);
        window.__show_anim.addEventListener("click", oactions.animOnClick, false);
        window.__error.addEventListener("click", oactions.errorOnClick, false);
    }

    function setupInfoNavigationEvents(){
        window.__close_lightbox.addEventListener("click", nactions.closeCheatSheet, false);
        window.__btn_embed_panel_close.addEventListener("click", nactions.closeEmbedSheet, false);
        window.__close_aboutsheet.addEventListener("click", nactions.closeAboutSheet, false);
        window.__helpme.addEventListener("click", nactions.helpMeOnClick, false);
        window.__embedme.addEventListener("click", nactions.embedMeOnClick, false);
        window.__link_to_interpreter.addEventListener("click", nactions.linkToInterpreterOnClick, false);
        window.__about.addEventListener("click", nactions.aboutOnClick, false);
        window.document.body.addEventListener("keydown", gactions.keyDown, false);
    }

    function setupEvents(){
        edit.init(window.__msc_input);
        par.processParams();

        setupInputEvents();
        setupOutputEvents();
        setupInfoNavigationEvents();
        par.tagAllLinks();
    }

    setupEvents();
});
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
