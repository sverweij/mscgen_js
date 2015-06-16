/* jshint browser:true */
/* global require */
require(["ui-control/interpreter-input-actions",
        "ui-control/interpreter-output-actions",
        "ui-control/interpreter-nav-actions",
        "ui-control/interpreter-param-actions",
        "ui-control/interpreter-editor-events"
        ],
        function(
            iactions,
            oactions,
            nactions,
            par,
            edit) {
    "use strict";

    function setupInputEvents(){
      window.__autorender.addEventListener("click", iactions.autorenderOnClick, false);
      window.__language_msgenny.addEventListener("click", iactions.languageMsGennyOnClick, false);
      window.__language_mscgen.addEventListener("click", iactions.languageMscGenOnClick, false);
      window.__language_json.addEventListener("click", iactions.languageJSONOnClick, false);
      window.__btn_colorize.addEventListener("click", iactions.colorizeOnClick, false);
      window.__btn_uncolorize.addEventListener("click", iactions.uncolorizeOnClick, false);
      window.__btn_render.addEventListener("click", iactions.renderOnClick, false);
      window.__samples.addEventListener("change", iactions.samplesOnChange, false);
      window.__save.addEventListener("click", iactions.saveOnClick, false);
      window.__load.addEventListener("click", iactions.loadOnClick, false);
    }

    function setupOutputEvents(){
      window.__svg.addEventListener("dblclick", oactions.svgOnDblClick, false);
      window.__show_svg.addEventListener("click", oactions.svgOnClick, false);
      window.__show_png.addEventListener("click", oactions.pngOnClick,false);
      window.__show_jpeg.addEventListener("click", oactions.jpegOnClick, false);
      window.__show_html.addEventListener("click", oactions.htmlOnClick, false);
      window.__show_dot.addEventListener("click", oactions.dotOnClick, false);
      window.__show_vanilla.addEventListener("click", oactions.vanillaOnClick, false);
      window.__show_url.addEventListener("click", oactions.urlOnClick, false);
      window.__show_anim.addEventListener("click", oactions.animOnClick, false);
      window.__error.addEventListener("click", oactions.errorOnClick, false);
    }

    function setupInfoNavigationEvents(){
      window.__close_lightbox.addEventListener("click", nactions.closeCheatSheet, false);
      window.__close_embedsheet.addEventListener("click", nactions.closeEmbedSheet, false);
      window.__close_aboutsheet.addEventListener("click", nactions.closeAboutSheet, false);
      window.__helpme.addEventListener("click", nactions.helpMeOnClick, false);
      window.__embedme.addEventListener("click", nactions.embedMeOnClick, false);
      window.__link_to_interpreter.addEventListener("click", nactions.linkToInterpreterOnClick, false);
      window.__about.addEventListener("click", nactions.aboutOnClick, false);
      window.document.body.addEventListener("keydown", nactions.keyDown, false);
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
