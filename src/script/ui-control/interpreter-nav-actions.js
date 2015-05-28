/* global define */
/* jshint browser:true */
define(["./interpreter-uistate",
        "./controller-animator",
        "./controller-exporter",
        "../utl/domquery",
        "../utl/gaga"
        ],
        function(
            uistate,
            animctrl,
            xport,
            dq,
            gaga) {
    "use strict";

    var ESC_KEY   = 27;

    return {
        closeCheatSheet: function() {
            dq.SS(window.__cheatsheet).hide();
            gaga.g('send', 'event', 'close_source_lightbox', 'button');
        },
        closeEmbedSheet: function() {
            dq.SS(window.__embedsheet).hide();
            gaga.g('send', 'event', 'close_embedsheet', 'button');
        },
        closeAboutSheet: function() {
            dq.SS(window.__aboutsheet).hide();
            gaga.g('send', 'event', 'close_aboutsheet', 'button');
        },
        helpMeOnClick: function() {
            dq.SS(window.__embedsheet).hide();
            dq.SS(window.__cheatsheet).toggle();
            dq.SS(window.__aboutsheet).hide();
            gaga.g('send', 'event', 'link', "helpme");
        },
        embedMeOnClick: function() {
            dq.SS(window.__cheatsheet).hide();
            window.__embedsnippet.textContent = xport.toHTMLSnippet(uistate.getSource(), uistate.getLanguage(), uistate.getLinkToInterpeter());
            dq.SS(window.__embedsheet).toggle();
            dq.SS(window.__aboutsheet).hide();
            gaga.g('send', 'event', 'link', "embedme");
        },
        linkToInterpreterOnClick: function() {
            uistate.setLinkToInterpeter(!(uistate.getLinkToInterpeter()));
            window.__embedsnippet.textContent = 
                    xport.toHTMLSnippet(uistate.getSource(), uistate.getLanguage(), uistate.getLinkToInterpeter());
            uistate.showAutorenderState (uistate.getAutoRender());
            gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
        },
        aboutOnClick: function() {
            dq.SS(window.__embedsheet).hide();
            dq.SS(window.__cheatsheet).hide();
            dq.SS(window.__aboutsheet).toggle();
            gaga.g('send', 'event', 'link', "about");
        },
        keyDown: function (e) {
           if(ESC_KEY === e.keyCode) {
                dq.SS(window.__cheatsheet).hide();
                dq.SS(window.__embedsheet).hide();
                dq.SS(window.__aboutsheet).hide();
                animctrl.close();
           }
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
