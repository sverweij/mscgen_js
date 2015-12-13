/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as an mscgen program that can be pasted directly into a c-style comment,
 * in a fashion doxygen can pick it up.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./arcmappings", "./textutensils", "./ast2thing"], function(map, utl, thing) {
    "use strict";

    var INDENT = "  ";
    var SP = " ";
    var EOL = "\n";
    var LINE_PREFIX = " * ";

    function renderKind(pKind) {
        if ("inline_expression" === map.getAggregate(pKind)) {
            return "--";
        }
        return pKind;
    }

    function renderAttribute(pAttribute) {
        var lRetVal = "";
        /* istanbul ignore else */
        if (pAttribute.name && pAttribute.value) {
            lRetVal += pAttribute.name + "=\"" + utl.escapeString(pAttribute.value) + "\"";
        }
        return lRetVal;
    }

    function renderComments() {
        /* rendering comments within comments, that are eventually output
         * to doxygen html - don't think that's going to be necessary
         * or desired functionality. If it is remember to be able to
         * - have a solution for nested comments (otherwise: interesting results)
         * - have a solution for comments that have an other meaning (# this is
         *    a comment -> doxygen translates this as markdown title)
         * - handling languages different from c/ java/ d that have alternative
         *   comment/ documentation sections
         */
        return "";
    }

    return {
        render : function(pAST) {
            return thing.render(pAST, {
                "renderCommentfn" : renderComments,
                "renderAttributefn" : renderAttribute,
                "renderKindfn" : renderKind,
                "supportedOptions" : ["hscale", "width", "arcgradient", "wordwraparcs"],
                "supportedEntityAttributes" : ["label", "idurl", "id", "url", "linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip"],
                "supportedArcAttributes" : ["label", "idurl", "id", "url", "linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor", "arcskip"],
                "program" : {
                    "opener" : LINE_PREFIX + "\\msc" + EOL,
                    "closer" : LINE_PREFIX + "\\endmsc"
                },
                "option" : {
                    "opener" : LINE_PREFIX + INDENT,
                    "separator" : "," + EOL + LINE_PREFIX + INDENT,
                    "closer" : ";" + EOL + LINE_PREFIX + EOL
                },
                "entity" : {
                    "opener": LINE_PREFIX + INDENT,
                    "separator" : "," + EOL + LINE_PREFIX + INDENT,
                    "closer" : ";" + EOL + LINE_PREFIX + EOL
                },
                "attribute" : {
                    "opener" : SP + "[",
                    "separator" : "," + SP,
                    "closer" : "]",

                },
                "arcline" : {
                    "opener" : LINE_PREFIX + INDENT,
                    "separator" : "," + EOL + LINE_PREFIX + INDENT,
                    "closer" : ";" + EOL
                },
                "inline" : {
                    "opener" : ";" + EOL,
                    "closer" : LINE_PREFIX + "#"
                },
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
