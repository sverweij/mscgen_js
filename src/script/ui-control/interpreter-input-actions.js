/* jshint browser:true */
/* global define */
define(["./interpreter-uistate",
        "../utl/gaga"
        ],
        function(
            uistate,
            gaga) {
    "use strict";


    return {
        autorenderOnClick: function() {
            uistate.setAutoRender(!(uistate.getAutoRender()));
            if (uistate.getAutoRender()) {
                uistate.render (uistate.getSource(), uistate.getLanguage());
            }
            uistate.showAutorenderState (uistate.getAutoRender());
            gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
        },
        languageMsGennyOnClick: function() {
            uistate.switchLanguage("msgenny");
            gaga.g('send', 'event', 'toggle_ms_genny', 'msgenny');
        },
        languageMscGenOnClick: function() {
            uistate.switchLanguage("mscgen");
            gaga.g('send', 'event', 'toggle_ms_genny', 'mscgen');
        },
        languageJSONOnClick: function() {
            uistate.switchLanguage("json");
            gaga.g('send', 'event', 'toggle_ms_genny', 'json');
        },
        colorizeOnClick: function() {
            uistate.colorizeOnClick();
            gaga.g('send', 'event', 'colorize', 'button');
        },
        uncolorizeOnClick: function() {
            uistate.unColorizeOnClick();
            gaga.g('send', 'event', 'uncolorize', 'button');
        },
        renderOnClick: function() {
            uistate.render(uistate.getSource(), uistate.getLanguage());
            gaga.g('send', 'event', 'render', 'button');
        },
        samplesOnChange: function () {
            uistate.setSample(window.__samples.value);
            gaga.g('send', 'event', 'selectexample', window.__samples.value);
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
