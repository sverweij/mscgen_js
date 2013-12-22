/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define([], function() {
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
        "alt" : "arcspanning",
        "else" : "arcspanning",
        "opt" : "arcspanning",
        "break" : "arcspanning",
        "par" : "arcspanning",
        "seq" : "arcspanning",
        "strict" : "arcspanning",
        "neg" : "arcspanning",
        "critical" : "arcspanning",
        "ignore" : "arcspanning",
        "consider" : "arcspanning",
        "assert" : "arcspanning",
        "loop" : "arcspanning",
        "ref" : "arcspanning",
        "exc" : "arcspanning"
    };
    function _determineArcClass(pKind, pFrom, pTo) {
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
        var lRetval = "";
        if (pKind && arc2class[pKind]) {
            lRetval = arc2class[pKind];
            if (pFrom && pTo) {
                if (pFrom >= pTo) {
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
        determineArcClass : function(pKind, pFrom, pTo) {
            return _determineArcClass(pKind, pFrom, pTo);
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
