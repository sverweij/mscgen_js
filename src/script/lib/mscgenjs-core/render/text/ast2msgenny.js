/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as a simplified mscgen (ms genny)program.
 */

/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    "use strict";

    var ast2thing = require("./ast2thing");

    var EOL = "\n";

    function renderMsGennyString(pString) {
        return "\"" + pString + "\"";
    }

    function entityNameIsQuotable(pString) {
        var lMatchResult = pString.match(/[^;, "\t\n\r=\-><:{*]+/gi);
        if (Boolean(lMatchResult)) {
            return lMatchResult.length !== 1;
        } else {
            return pString !== "*";
        }
    }

    function renderEntityName(pString) {
        return entityNameIsQuotable(pString) ? "\"" + pString + "\"" : pString;
    }

    function renderAttribute(pAttribute) {
        var lRetVal = "";
        if (pAttribute.name && pAttribute.value) {
            lRetVal += " : " + renderMsGennyString(pAttribute.value);
        }
        return lRetVal;
    }

    return {
        render : function(pAST) {
            return ast2thing.render(pAST, {
                "renderAttributefn" : renderAttribute,
                "renderEntityNamefn" : renderEntityName,
                "entity" : {
                    "opener" : "",
                    "separator" : "," + EOL,
                    "closer" : ";" + EOL + EOL
                }
            });
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
