/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as a simplified mscgen (ms genny)program.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./astconvutls'], function(utl) {
    var INDENT = "  ";
    function _renderAST(pAST) {
        var lRetVal = "";
        if (pAST) {
            if (pAST.precomment) {
                lRetVal += utl.renderComments(pAST.precomment);
            }
            if (pAST.options) {
                lRetVal += renderOptions(pAST.options) + "\n";
            }
            if (pAST.entities) {
                lRetVal += renderEntities(pAST.entities) + "\n";
            }
            if (pAST.arcs) {
                lRetVal += renderArcLines(pAST.arcs, "");
            }
            if (pAST.postcomment) {
                lRetVal += utl.renderComments(pAST.postcomment);
            }
        }
        return lRetVal;
    }

    function renderMsGennyString(pString) {
        function isQuoatable(pString) {
            var lMatchResult = pString.match(/[;,{]/);
            if (lMatchResult) {
                return lMatchResult.length === 1;
            } else {
                return false;
            }
        }

        return isQuoatable(pString) ? "\"" + pString + "\"" : pString.trim();
    }

    function renderOptions(pOptions) {
        var lOpts = [];
        var lRetVal = "";
        var i = 0;

        utl.pushAttribute(lOpts, pOptions.hscale, "hscale");
        utl.pushAttribute(lOpts, pOptions.width, "width");
        utl.pushAttribute(lOpts, pOptions.arcgradient, "arcgradient");
        utl.pushAttribute(lOpts, pOptions.wordwraparcs, "wordwraparcs");
        utl.pushAttribute(lOpts, pOptions.watermark, "watermark");

        for ( i = 0; i < lOpts.length - 1; i++) {
            lRetVal += lOpts[i] + ",\n";
        }
        lRetVal += lOpts[lOpts.length - 1] + ";\n";
        return lRetVal;

    }

    function renderEntity(pEntity) {
        var lRetVal = "";
        lRetVal += utl.renderEntityName(pEntity.name);
        if (pEntity.label) {
            lRetVal += " : " + renderMsGennyString(pEntity.label);
        }
        return lRetVal;
    }

    function renderEntities(pEntities) {
        var lRetVal = "";
        var i = 0;
        if (pEntities.length > 0) {
            for ( i = 0; i < pEntities.length - 1; i++) {
                lRetVal += renderEntity(pEntities[i]) + ", ";
            }
            lRetVal += renderEntity(pEntities[pEntities.length - 1]) + ";\n";
        }
        return lRetVal;
    }

    function renderArc(pArc, pIndent) {
        var lRetVal = "";
        if (pArc.from) {
            lRetVal += utl.renderEntityName(pArc.from) + " ";
        }
        if (pArc.kind) {
            lRetVal += pArc.kind;
        }
        if (pArc.to) {
            lRetVal += " " + utl.renderEntityName(pArc.to);
        }
        if (pArc.arcs) {
            if (pArc.label) {
                lRetVal += " : " + renderMsGennyString(pArc.label);
            }
            lRetVal += " {\n";
            lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
            lRetVal += pIndent + "}";
        } else {
            if (pArc.label) {
                lRetVal += " : " + renderMsGennyString(pArc.label);
            }
        }
        return lRetVal;
    }

    function renderArcLines(pArcs, pIndent) {
        var lRetVal = "";
        var i = 0;
        var j = 0;

        if (pArcs.length > 0) {
            for ( i = 0; i < pArcs.length; i++) {
                if (pArcs[i].length > 0) {
                    for ( j = 0; j < pArcs[i].length - 1; j++) {
                        lRetVal += pIndent + renderArc(pArcs[i][j], pIndent) + ",\n";
                    }
                    lRetVal += pIndent + renderArc(pArcs[i][pArcs[i].length - 1], pIndent) + ";\n";
                }
            }
        }
        return lRetVal;
    }

    return {
        render : function(pAST) {
            return _renderAST(pAST);
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
