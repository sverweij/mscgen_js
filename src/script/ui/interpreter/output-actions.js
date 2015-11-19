/* global define */
/* jshint browser:true */
define(["./uistate",
        "./animator",
        "../utl/exporter",
        "./raster-exporter",
        "../utl/domutl",
        "../utl/gaga"
        ],
        function(uistate, animctrl, xport, rxport, dq, gaga) {
    "use strict";

    function _closeExportPanel(){
        window.__output_panel.style.height = '0';
    }

    return {
        svgOnDblClick: function() {
            window.open(xport.toVectorURI(dq.webkitNamespaceBugWorkaround(window.__svg.innerHTML)));
            gaga.g('send', 'event', 'show_svg_base64', 'svg dblcick');
        },
        svgOnClick: function() {
            window.open(xport.toVectorURI(dq.webkitNamespaceBugWorkaround(window.__svg.innerHTML)));
            gaga.g('send', 'event', 'show_svg_base64', 'button');
        },
        pngOnClick: function() {
            window.open(rxport.toRasterURI(document, dq.webkitNamespaceBugWorkaround(window.__svg.innerHTML), "image/png"), "_blank");
            gaga.g('send', 'event', 'show_png_base64', 'button');
        },
        jpegOnClick: function() {
            window.open(rxport.toRasterURI(document, dq.webkitNamespaceBugWorkaround(window.__svg.innerHTML), "image/jpeg"), "_blank");
            gaga.g('send', 'event', 'show_jpeg_base64', 'button');
        },
        htmlOnClick: function() {
            window.open(xport.toHTMLSnippetURI(uistate.getSource(), uistate.getLanguage()));
            gaga.g('send', 'event', 'show_html', 'button');
        },
        dotOnClick: function() {
            window.open(xport.todotURI(uistate.getAST()));
            gaga.g('send', 'event', 'show_dot', 'button');
        },
        vanillaOnClick: function() {
            window.open(xport.toVanillaMscGenURI(uistate.getAST()));
            gaga.g('send', 'event', 'show_vanilla', 'button');
        },
        doxygenOnClick: function() {
            window.open(xport.toDoxygenURI(uistate.getAST()));
            gaga.g('send', 'event', 'show_doxygen', 'button');
        },
        urlOnClick: function() {
            window.history.replaceState({}, "", xport.toLocationString(window.location, uistate.getSource(), uistate.getLanguage()));
            gaga.g('send', 'event', 'show_url', 'button');
        },
        animOnClick: function() {
            try {
                animctrl.initialize(uistate.getAST());
                // dq.SS(window.__animscreen).show();
            } catch(e) {
                // do nothing
            }
            gaga.g('send', 'event', 'show_anim', 'button');
        },
        errorOnClick: function() {
            uistate.errorOnClick();
            gaga.g('send', 'event', 'link', "error");
        },
        moreExportOptionsOnClick: function(){
            var lHeight = window.__output_panel.style.height.toString();
            if ( lHeight === '0px' || lHeight === ""){
                window.__output_panel.style.height = '250px';
                gaga.g('send', 'event', 'export.open', 'button');
            } else {
                _closeExportPanel();
                gaga.g('send', 'event', 'export.close', 'button');
            }
        },
        closeExportOptions: function(){
            _closeExportPanel();
            gaga.g('send', 'event', 'exportPanel.close', 'button');
        }
    };
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
