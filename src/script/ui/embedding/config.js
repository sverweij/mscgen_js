/* jshint nonstandard:true */
/* jshint node: true */
/* global mscgen_js_config */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([],function() {
    "use strict";

    var gConfig = {
        defaultLanguage : "mscgen",
        parentElementPrefix : "mscgen_js-parent_",
        clickable : false,
        clickURL : "https://sverweij.github.io/mscgen_js/",
        loadFromSrcAttribute: false
    };

    function mergeConfig (pConfigBase, pConfigToMerge){
        Object.getOwnPropertyNames(pConfigToMerge).forEach(function(pAttribute){
            pConfigBase[pAttribute] = pConfigToMerge[pAttribute];
        });
    }

    return {
        getConfig: function(){
            if ('undefined' !== typeof(mscgen_js_config) && mscgen_js_config &&
                'object' === typeof(mscgen_js_config)){
                mergeConfig(gConfig, mscgen_js_config);
            }
            return gConfig;
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
