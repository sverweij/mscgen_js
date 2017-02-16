/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

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
        getClass : function(pKey) { return KIND2CLASS[pKey] || pKey; },
        getAggregateClass : function(pKey) { return KIND2AGGREGATECLASS[pKey] || pKey; }
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
