/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
    var allowedValues    = require("./allowedvalues");

    function normalizeValueFromValidValues(pValue, pValidValues, pDefault) {
        var lRetval = pDefault;

        if (pValidValues.some(
            function(pValidValue){
                return pValidValue === pValue;
            }
        )){
            lRetval = pValue;
        }

        return lRetval;
    }

    function normalizeVerticalAlignment(pVerticalAlignment) {
        return normalizeValueFromValidValues(
            pVerticalAlignment,
            allowedValues.regularArcTextVerticalAlignment.map(function(pObject) { return pObject.name; }),
            "middle"
        );
    }

    function normalizeInputType(pInputType) {
        return normalizeValueFromValidValues(
            pInputType,
            allowedValues.inputType.map(function(pObject) { return pObject.name; }),
            "mscgen"
        );
    }

    function booleanize(pValue, pDefault) {
        return typeof pValue === 'boolean' ? pValue : pDefault;
    }

    return function(pOptions, pScript) {
        pOptions = pOptions || {};
        var lIncludeSource = booleanize(pOptions.includeSource, true);

        return {
            inputType              : normalizeInputType(pOptions.inputType),
            elementId              : pOptions.elementId || "__svg",
            window                 : pOptions.window || window,
            includeSource          : lIncludeSource,
            source                 : lIncludeSource ? pScript : null,
            styleAdditions         : pOptions.styleAdditions || null,
            additionalTemplate     : pOptions.additionalTemplate || null,
            mirrorEntitiesOnBottom : booleanize(pOptions.mirrorEntitiesOnBottom, false),
            regularArcTextVerticalAlignment: normalizeVerticalAlignment(pOptions.regularArcTextVerticalAlignment)
        };
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
