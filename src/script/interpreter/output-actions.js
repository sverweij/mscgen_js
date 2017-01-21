/* eslint max-params: 0 */
define([
    "./uistate",
    "./animator",
    "../utl/store",
    "../utl/exporter",
    "./raster-exporter",
    "../lib/mscgenjs-core/render/graphics/svgutensils",
    "./general-actions",
    "../utl/gaga"
],
function(uistate, animctrl, store, xport, rxport, dq, gactions, gaga) {
    "use strict";

    var IMAGE_EXPORT_WINDOW_NAME = "mscgenjsimages";
    function rasterExport(pType){
        /*
         * first open a window directly as opening windows from the img.load
         * (as the anonymous function will do) is blocked by many browsers
         * (safari: hard, firefox: asks the user for for permission)
         */
        window.open("about:blank", IMAGE_EXPORT_WINDOW_NAME);
        rxport.toRasterURI(
            document,
            window.__svg,
            pType,
            function(pRasterURI){
                window.open(pRasterURI, IMAGE_EXPORT_WINDOW_NAME);
            }
        );
    }

    function vectorExport() {
        window.open(
            xport.toVectorURI(
                dq.webkitNamespaceBugWorkaround(window.__svg.innerHTML)
            ),
            IMAGE_EXPORT_WINDOW_NAME
        );
    }

    return {
        svgOnDblClick: function() {
            vectorExport();
            gaga.g('send', 'event', 'show_svg_base64', 'svg dblcick');
        },
        svgOnClick: function() {
            vectorExport();
            gaga.g('send', 'event', 'show_svg_base64', 'button');
        },
        pngOnClick: function() {
            rasterExport("image/png");
            gaga.g('send', 'event', 'show_png_base64', 'button');
        },
        jpegOnClick: function() {
            rasterExport("image/jpeg");
            gaga.g('send', 'event', 'show_jpeg_base64', 'button');
        },
        htmlOnClick: function() {
            window.open(
                xport.toHTMLSnippetURI(
                    uistate.getSource(),
                    uistate.getLanguage(),
                    {
                        withLinkToEditor: uistate.getLinkToInterpeter(),
                        mirrorEntities: uistate.getMirrorEntities(),
                        verticalLabelAlignment: uistate.getVerticalLabelAlignment(),
                        namedStyle: uistate.getStyle()
                    }
                )
            );
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
            window.history.replaceState(
                {},
                "",
                xport.toLocationString(window.location, uistate.getSource(), uistate.getLanguage())
            );
            gaga.g('send', 'event', 'show_url', 'button');
        },
        animOnClick: function() {
            try {
                animctrl.initialize(uistate.getAST(), uistate.getMirrorEntities());
                // dq.ss(window.__animscreen).show();
            } catch (e) {
                // do nothing
            }
            gaga.g('send', 'event', 'show_anim', 'button');
        },
        errorOnClick: function() {
            uistate.errorOnClick();
            gaga.g('send', 'event', 'link', "error");
        },
        renderOptionsOnClick: function (){
            gactions.togglePanel(
                window.__render_options_panel,
                function(){ gaga.g('send', 'event', 'renderoptions.open', 'button'); },
                function(){ gaga.g('send', 'event', 'renderoptions.close', 'button'); }
            );
        },
        closeRenderOptions: function(){
            gactions.hideAllPanels();
            gaga.g('send', 'event', 'renderoptions.close', 'button');
        },
        optionMirrorEntitiesOnClick: function(pEvent) {
            uistate.setMirrorEntities(pEvent.target.checked);
            uistate.requestRender();
            store.saveSettings(uistate);
            gaga.g('send', 'event', 'renderoptions.mirrorentities', pEvent.target.checked);
        },
        optionVerticalLabelAlignmentOnChange: function(pEvent) {
            uistate.setVerticalLabelAlignment(pEvent.target.value);
            uistate.requestRender();
            store.saveSettings(uistate);
            gaga.g('send', 'event', 'renderoptions.verticalLabelAlignment', pEvent.target.value);
        },
        styleOnClick: function(pEvent) {
            uistate.setStyle(pEvent.target.value);
            uistate.requestRender();
            store.saveSettings(uistate);
            gaga.g('send', 'event', 'renderoptions.style', pEvent.target.value);
        },
        moreExportOptionsOnClick: function(){
            gactions.togglePanel(
                window.__output_panel,
                function(){ gaga.g('send', 'event', 'export.open', 'button'); },
                function(){ gaga.g('send', 'event', 'export.close', 'button'); }
            );
        },
        closeExportOptions: function(){
            gactions.hideAllPanels();
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
