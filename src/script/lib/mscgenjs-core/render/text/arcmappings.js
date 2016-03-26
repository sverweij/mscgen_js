/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    /**
     * Defines several mappings of arckinds to agregations
     *
     * @exports node/arcmappings
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
        "note" : "note"
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
        "<-" : "directional",
        "<=" : "directional",
        "<<=" : "directional",
        "<<" : "directional",
        "<:" : "directional",
        "x-" : "directional",
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

    var KIND2NORMALIZEDKIND = {
        "<-" : "->",
        "<=" : "=>",
        "<<=" : "=>>",
        "<<" : ">>",
        "<:" : ":>",
        "x-" : "-x"
    };

    var KIND2CLASS = {
        "|||"   : "empty-row",
        "..."   : "omitted-row",
        "---"   : "comment-row",
        "->"    : "signal",
        "=>"    : "method",
        "=>>"   : "callback",
        ">>"    : "return",
        ":>"    : "emphasised",
        "-x"    : "lost",
        "<-"    : "signal",
        "<="    : "method",
        "<<="   : "callback",
        "<<"    : "return",
        "<:"    : "emphasised",
        "x-"    : "lost",
        "<->"   : "signal",
        "<=>"   : "method",
        "<<=>>" : "callback",
        "<<>>"  : "return",
        "<:>"   : "emphasised",
        "--"    : "signal",
        "=="    : "method",
        ".."    : "return",
        "::"    : "emphasised"
    };

    var KIND2AGGREGATECLASS = {
        "|||" : "empty",
        "..." : "empty",
        "---" : "empty",
        "->" : "directional",
        "=>" : "directional",
        "=>>" : "directional",
        ">>" : "directional",
        ":>" : "directional",
        "-x" : "directional",
        "<-" : "directional",
        "<=" : "directional",
        "<<=" : "directional",
        "<<" : "directional",
        "<:" : "directional",
        "x-" : "directional",
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

    return {
        getArrow : function(pKey) { return KIND2ARROW[pKey]; },
        getShape : function(pKey) { return KIND2SHAPE[pKey]; },
        getStyle : function(pKey) { return KIND2STYLE[pKey]; },
        getAggregate : function(pKey) { return KIND2AGGREGATE[pKey]; },
        getClass : function(pKey) { return KIND2CLASS[pKey]||pKey; },
        getAggregateClass : function(pKey) { return KIND2AGGREGATECLASS[pKey]||pKey; },
        getNormalizedKind : function(pKey) { return KIND2NORMALIZEDKIND[pKey]||pKey; }
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
