/* eslint-env node */
/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    var STORAGE_KEY = "state";

    function localStorageOK (){
        return (typeof localStorage !== 'undefined');
    }

    function getState(){
        if (localStorageOK()){
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY));
            } catch (e){
                // silently swallow
            }
        }
        return null;
    }

    function setState(pState) {
        if (localStorageOK()){
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(pState)
            );
        }
    }

    function save(pState, pSourceToo){
        var lSourceToo = typeof pSourceToo === "undefined" ? true : pSourceToo;
        var lState = {
            autorender     : pState.getAutoRender(),
            debug          : pState.getDebug(),
            mirrorEntities : pState.getMirrorEntities(),
            namedStyle     : pState.getStyle()
        };

        if (lSourceToo) {
            lState.language = pState.getLanguage();
            lState.source  = pState.getSource();
        }

        setState(lState);
    }

    function load(pState, pSourceToo){
        var lState = getState();
        var lSourceToo = typeof pSourceToo === "undefined" ? true : pSourceToo;

        if (Boolean(lState)){
            pState.setAutoRender(lState.autorender);
            pState.setDebug(lState.debug);
            pState.setMirrorEntities(lState.mirrorEntities);
            pState.setStyle(lState.namedStyle);

            if (lSourceToo) {
                if (Boolean(lState.language)) {
                    pState.setLanguage(lState.language);
                }
                if (Boolean(lState.source)) {
                    pState.setSource(lState.source);
                }
            }
        }
    }

    function loadSettings(pState) {
        load(pState, false);
    }

    function saveSettings(pState) {
        save(pState, false);
    }

    return {
        save: save,
        load: load,
        saveSettings: saveSettings,
        loadSettings: loadSettings
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
