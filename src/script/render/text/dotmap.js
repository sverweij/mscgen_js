/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    /**
     * Defines several mappings of arckinds to agregations
     *
     * @exports node/dotmap
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */
    var KIND2ARROW = {
        "->" : "rvee",
        "<->" : "rvee",
        "=>" : "normal",
        "<=>" : "normal",
        "-x" : "oinvonormal"
    };
    var KIND2SHAPE = {
        "box" : "box",
        "abox" : "hexagon",
        "rbox" : "box",
        "note" : "note",
    };
    var KIND2STYLE = {
        ">>" : "dashed",
        "<<>>" : "dashed",
        ".." : "dashed",
        ":>" : "bold",
        "<:>" : "bold",
        "::" : "bold",
        "rbox" : "rounded"
    };
    var KIND2AGGREGATE = {
        "|||" : "emptyarc",
        "..." : "emptyarc",
        "---" : "emptyarc",
        "->" : "directional",
        "=>" : "directional",
        "=>>" : "directional",
        ">>" : "directional",
        ":>" : "directional",
        "-x" : "directional",
        "note" : "box",
        "box" : "box",
        "abox" : "box",
        "rbox" : "box",
        "<->" : "bidirectional",
        "<=>" : "bidirectional",
        "<<=>>" : "bidirectional",
        "<<>>" : "bidirectional",
        "<:>" : "bidirectional",
        "--" : "nondirectional",
        "==" : "nondirectional",
        ".." : "nondirectional",
        "::" : "nondirectional",
        "alt" : "inline_expression",
        "else" : "inline_expression",
        "opt" : "inline_expression",
        "break" : "inline_expression",
        "par" : "inline_expression",
        "seq" : "inline_expression",
        "strict" : "inline_expression",
        "neg" : "inline_expression",
        "critical" : "inline_expression",
        "ignore" : "inline_expression",
        "consider" : "inline_expression",
        "assert" : "inline_expression",
        "loop" : "inline_expression",
        "ref" : "inline_expression",
        "exc" : "inline_expression"
    };
    var arc2class = {
        "->" : "signal",
        "<->" : "signal-both",
        "=>" : "method",
        "<=>" : "method-both",
        ">>" : "returnvalue",
        "<<>>" : "returnvalue-both",
        ".." : "dotted",
        "=>>" : "callback",
        "<<=>>" : "callback-both",
        ":>" : "emphasised",
        "<:>" : "emphasised-both",
        "::" : "double",
        "-x" : "lost"
    };
    function _determineArcClass(pKind, pFrom, pTo) {
        var lRetval = "";
        if (pKind && arc2class[pKind]) {
            lRetval = arc2class[pKind];
            if (pFrom && pTo && (pFrom >= pTo)) {
                if (lRetval === "signal") {
                    lRetval = "signal-u";
                }
                if (lRetval === "signal-both") {
                    if (pFrom === pTo) {
                        lRetval = "signal-both-self";
                    } else {
                        lRetval = "signal-both-u";
                    }
                }
            }
        }
        return lRetval;
    }

    return {
        getArrow : function(pKey) {
            return KIND2ARROW[pKey];
        },
        getShape : function(pKey) {
            return KIND2SHAPE[pKey];
        },
        getStyle : function(pKey) {
            return KIND2STYLE[pKey];
        },
        getAggregate : function(pKey) {
            return KIND2AGGREGATE[pKey];
        },
        determineArcClass : _determineArcClass
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
