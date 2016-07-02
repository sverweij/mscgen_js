define([
    "./uistate",
    "../utl/store",
    "../utl/gaga",
    "../lib/mscgenjs-core/render/text/colorize",
    "./general-actions"
],
function(uistate, store, gaga, colorize, gactions) {
    "use strict";

    function _applyColorScheme(pSchemeName, pForce){
        uistate.manipulateSource(function(pAST){
            return colorize.applyScheme(pAST, pSchemeName, pForce);
        });
        gactions.hideAllPanels();
        gaga.g('send', 'event', 'color.' + pSchemeName + (pForce ? "_force" : ""), 'button');
    }

    function _switchLanguage(pLanguage){
        uistate.switchLanguage(pLanguage);
        gaga.g('send', 'event', 'toggle_ms_genny', pLanguage);
    }

    return {
        autorenderOnClick: function() {
            uistate.setAutoRender(!(uistate.getAutoRender()));
            uistate.requestRender();
            uistate.showAutorenderState(uistate.getAutoRender());
            gaga.g('send', 'event', 'toggle_autorender', 'checkbox');
        },
        languageMsGennyOnClick: function() { _switchLanguage("msgenny"); },
        languageMscGenOnClick: function() { _switchLanguage("mscgen"); },
        languageJSONOnClick: function() { _switchLanguage("json"); },
        colorAutoOnClick: function() { _applyColorScheme("auto", false); },
        colorAutoFOnClick: function() { _applyColorScheme("auto", true); },
        colorMinimalOnClick: function(){ _applyColorScheme("minimal", false); },
        colorMinimalFOnClick: function(){ _applyColorScheme("minimal", true); },
        colorRoseOnClick: function(){ _applyColorScheme("rosy", false); },
        colorRoseFOnClick: function(){ _applyColorScheme("rosy", true); },
        colorBlueyOnClick: function(){ _applyColorScheme("bluey", false); },
        colorBlueyFOnClick: function(){ _applyColorScheme("bluey", true); },
        uncolorizeOnClick: function() {
            uistate.manipulateSource(colorize.uncolor);
            gactions.hideAllPanels();
            gaga.g('send', 'event', 'color.remove', 'button');
        },
        renderOnClick: function() {
            uistate.render(uistate.getSource(), uistate.getLanguage());
            gaga.g('send', 'event', 'render', 'button');
        },
        samplesOnChange: function () {
            uistate.setSample(window.__samples.value);
            gaga.g('send', 'event', 'selectexample', window.__samples.value);
        },
        saveOnClick: function() {
            store.save(uistate);
            gaga.g('send', 'event', 'save', 'button');
        },
        loadOnClick: function(){
            store.load(uistate);
            gaga.g('send', 'event', 'load', 'button');
        },
        moreColorSchemesOnClick: function(){
            gactions.togglePanel(
                window.__color_panel,
                function(){ gaga.g('send', 'event', 'more_color_schemes.open', 'button'); },
                function(){ gaga.g('send', 'event', 'more_color_schemes.close', 'button'); }
            );
        },
        closeColorPanel: function(){
            gactions.hideAllPanels();
            gaga.g('send', 'event', 'color.close', 'button');
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
