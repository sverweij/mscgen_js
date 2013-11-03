/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as a simplified mscgen (ms genny)program.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define ([],function() {

    function _renderAST(pAST) {
        var lRetVal = "";
        if (pAST) {
            if (pAST.options) {
                lRetVal += renderOptions(pAST.options) + "\n";
            }
            if (pAST.entities) {
                lRetVal += renderEntities(pAST.entities) + "\n";
            }
            if (pAST.arcs) {
                lRetVal += renderArcLines(pAST.arcs);
            }
        }
        return lRetVal;
    }

    function renderEntityName(pString) {
        function isQuoatable(pString) {
            var lMatchResult = pString.match(/[a-z0-9]+/gi);
            if (lMatchResult) {
                return lMatchResult.length != 1;
            } else {
                return true;
            }
        }

        return isQuoatable(pString) ? "\"" + pString + "\"" : pString;
    }

    function renderMsGennyString(pString) {
        function isQuoatable(pString) {
            var lMatchResult = pString.match(/[;,]/);
            if (lMatchResult) {
                return lMatchResult.length === 1;
            } else {
                return false;
            }
        }

        return isQuoatable(pString) ? "\"" + pString + "\"" : pString;
    }

    function pushAttribute(pArray, pAttr, pString) {
        if (pAttr) {
            pArray.push(pString + "=\"" + pAttr + "\"");
        }
    }

    function renderOptions(pOptions) {
        var lOpts = [];
        var lRetVal = "";
        var i = 0;

        pushAttribute(lOpts, pOptions.hscale, "hscale");
        pushAttribute(lOpts, pOptions.width, "width");
        pushAttribute(lOpts, pOptions.arcgradient, "arcgradient");
        pushAttribute(lOpts, pOptions.wordwraparcs, "wordwraparcs");

        for ( i = 0; i < lOpts.length - 1; i++) {
            lRetVal += lOpts[i] + ",\n";
        }
        lRetVal += lOpts[lOpts.length - 1] + ";\n";
        return lRetVal;

    }

    function renderEntity(pEntity) {
        var lRetVal = "";
        lRetVal += renderEntityName(pEntity.name);
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

    function renderArc(pArc) {
        var lRetVal = "";
        if (pArc.from) {
            lRetVal += renderEntityName(pArc.from) + " ";
        }
        if (pArc.kind) {
            lRetVal += pArc.kind;
        }
        if (pArc.to) {
            lRetVal += " " + renderEntityName(pArc.to);
        }
        if (pArc.label) {
            lRetVal += " : " + renderMsGennyString(pArc.label);
        }
        return lRetVal;
    }

    function renderArcLines(pArcs) {
        var lRetVal = "";
        var i = 0;
        var j = 0;

        if (pArcs.length > 0) {
            for ( i = 0; i < pArcs.length; i++) {
                if (pArcs[i].length > 0) {
                    for ( j = 0; j < pArcs[i].length - 1; j++) {
                        lRetVal += renderArc(pArcs[i][j]) + ",\n";
                    }
                    lRetVal += renderArc(pArcs[i][pArcs[i].length - 1]) + ";\n";
                }
            }
        }
        return lRetVal;
    }

    var result = {
        render : function(pAST) {
            return _renderAST(pAST);
        }
    };

    return result;
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
