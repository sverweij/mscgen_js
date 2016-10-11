define(function(require) {
    "use strict";

    var mscgenjs         = require("../lib/mscgenjs-core/main/index");
    var dq               = require("../utl/domutl");
    var sampleListReader = require("./sampleListReader");

    function namedStyle2Div(pNamedStyle) {
        return ((pNamedStyle.experimental ? '<div class="debug" style="display:none;">' : '<div>') +
            '<input id="__option_style_${pNamedStyle.name}" type="radio" name="stylerg" value="${pNamedStyle.name}">' +
            ' <label for="__option_style_${pNamedStyle.name}">${pNamedStyle.description}</label>' +
        '</div>')
        .replace(/\${pNamedStyle.name}/g, pNamedStyle.name)
        .replace(/\${pNamedStyle.description}/g, pNamedStyle.description);
    }

    function initSamples(pDebug) {
        dq.ajax(
            "samples/interpreter-samples.json",
            function(pResult){
                try {
                    window.__samples.innerHTML =
                        '<option value="none" selected="">select an example...</option>' +
                        sampleListReader.toOptionList(
                            JSON.parse(pResult.target.response),
                            pDebug
                        );
                    dq.ss(window.__samples).show();
                } catch (e) {
                    // quietly ignore
                }
            },
            function(){
                // quietly ignore
            }
        );
    }

    function initNamedStyles() {
        window.__named_styles.innerHTML =
            mscgenjs.getAllowedValues().namedStyle.reduce(function(pAll, pNamedStyle){
                return pAll + namedStyle2Div(pNamedStyle);
            },
            '<div>' +
                '<input id="__option_style_none" type="radio" name="stylerg" value="none" checked>' +
                ' <label for="__option_style_none">none</label>' +
            '</div>');

    }

    return {
        initSamples: initSamples,
        initNamedStyles: initNamedStyles
    };
}); // define
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
