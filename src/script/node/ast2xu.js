/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as an mscgen program.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./dotmap", "./astconvutls"], function(map, utl) {

    var INDENT = "  ";
    var SP = " ";
    var EOL = "\n";
    var gMinimal = false;

    function init(pMinimal) {
        if (true === pMinimal) {
            gMinimal = true;
            INDENT = "";
            SP = "";
            EOL = "";
        } else {
            gMinimal = false;
            INDENT = "  ";
            SP = " ";
            EOL = "\n";
        }
    }

    function _renderAST(pAST, pMinimal) {
        init(pMinimal);
        var lRetVal = "msc" + SP + "{" + EOL;
        if (pAST) {
            if (pAST.precomment) {
                lRetVal = utl.renderComments(pAST.precomment);
                lRetVal += "msc" + SP + "{" + EOL;
            }
            if (pAST.options) {
                lRetVal += renderOptions(pAST.options) + EOL;
            }
            if (pAST.entities) {
                lRetVal += renderEntities(pAST.entities) + EOL;
            }
            if (pAST.arcs) {
                lRetVal += renderArcLines(pAST.arcs, INDENT);
            }
            if (pAST.postcomment) {
                lRetVal += "}" + EOL;
                lRetVal += utl.renderComments(pAST.postcomment);
            } else {
                lRetVal += "}";
            }
        }
        return lRetVal;
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
            lRetVal += INDENT + lOpts[i] + "," + EOL;
        }
        lRetVal += INDENT + lOpts[lOpts.length - 1] + ";" + EOL;
        return lRetVal;

    }

    function renderAttributes(pThing) {
        var lAttrs = [];
        var lRetVal = "";
        utl.pushAttribute(lAttrs, pThing.label, "label");
        utl.pushAttribute(lAttrs, pThing.idurl, "idurl");
        utl.pushAttribute(lAttrs, pThing.id, "id");
        utl.pushAttribute(lAttrs, pThing.url, "url");
        utl.pushAttribute(lAttrs, pThing.linecolor, "linecolor");
        utl.pushAttribute(lAttrs, pThing.textcolor, "textcolor");
        utl.pushAttribute(lAttrs, pThing.textbgcolor, "textbgcolor");
        utl.pushAttribute(lAttrs, pThing.arclinecolor, "arclinecolor");
        utl.pushAttribute(lAttrs, pThing.arctextcolor, "arctextcolor");
        utl.pushAttribute(lAttrs, pThing.arctextbgcolor, "arctextbgcolor");
        utl.pushAttribute(lAttrs, pThing.arcskip, "arcskip");

        if (lAttrs.length > 0) {
            var i = 0;
            lRetVal = SP + "[";
            for ( i = 0; i < lAttrs.length - 1; i++) {
                lRetVal += lAttrs[i] + "," + SP;
            }
            lRetVal += lAttrs[lAttrs.length - 1];
            lRetVal += "]";
        }

        return lRetVal;
    }

    function renderEntity(pEntity) {
        var lRetVal = "";
        lRetVal += utl.renderEntityName(pEntity.name);
        lRetVal += renderAttributes(pEntity);
        return lRetVal;
    }

    function renderEntities(pEntities) {
        var lRetVal = "";
        var i = 0;
        if (pEntities.length > 0) {
            for ( i = 0; i < pEntities.length - 1; i++) {
                lRetVal += INDENT + renderEntity(pEntities[i]) + "," + EOL;
            }
            lRetVal += INDENT + renderEntity(pEntities[pEntities.length - 1]) + ";" + EOL;
        }
        return lRetVal;
    }

    function renderKind(pKind) {
        if (true === gMinimal) {
            if ("box" === map.getAggregate(pKind)) {
                return " " + pKind + " ";
            }
        }
        return pKind;
    }

    function renderArc(pArc, pIndent) {
        var lRetVal = "";
        if (pArc.from) {
            lRetVal += utl.renderEntityName(pArc.from) + SP;
        }
        if (pArc.kind) {
            lRetVal += renderKind(pArc.kind);
        }
        if (pArc.to) {
            lRetVal += SP + utl.renderEntityName(pArc.to);
        }
        if (pArc.arcs) {
            lRetVal += renderAttributes(pArc);
            lRetVal += " {\n";
            lRetVal += renderArcLines(pArc.arcs, pIndent + INDENT);
            lRetVal += pIndent + "}";
        } else {
            lRetVal += renderAttributes(pArc);
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
                        lRetVal += pIndent + renderArc(pArcs[i][j], pIndent) + "," + EOL;
                    }
                    lRetVal += pIndent + renderArc(pArcs[i][pArcs[i].length - 1], pIndent) + ";" + EOL;
                }
            }
        }
        return lRetVal;
    }

    return {
        render : function(pAST, pMinimal) {
            return _renderAST(pAST, pMinimal);
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
