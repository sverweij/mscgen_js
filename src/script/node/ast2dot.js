/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as an graphviz dot script.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./flatten", "./textutensils", "./dotmap"], function(flatten, txt, map) {

    var INDENT = "  ";
    var gCounter = 0;

    function _renderAST(pAST) {
        var lRetVal = "graph {\n";
        lRetVal += INDENT + 'rankdir=LR\n';
        lRetVal += INDENT + 'splines=true\n';
        lRetVal += INDENT + 'ordering=out\n';
        lRetVal += INDENT + 'fontname="Helvetica"\n';
        lRetVal += INDENT + 'fontsize="9"\n';
        lRetVal += INDENT + 'node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n';
        lRetVal += INDENT + 'edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n';
        lRetVal += "\n";

        var lAST = flatten.dotFlatten(pAST);

        if (lAST) {
            if (lAST.entities) {
                lRetVal += renderEntities(lAST.entities) + "\n";
            }
            if (lAST.arcs) {
                gCounter = 0;
                lRetVal += renderArcLines(lAST.arcs, "");
            }
        }
        return lRetVal += "}";
    }

    function renderString(pString) {
        var lStringAry = txt.wrap(pString.replace(/\"/g, "\\\""), 40);
        var lString = "";

        for (var i = 0; i < lStringAry.length - 1; i++) {
            lString += lStringAry[i] + "\n";
        }
        lString += lStringAry[lStringAry.length - 1];
        return lString;
    }

    function renderEntityName(pString) {
        return "\"" + pString + "\"";
    }

    function pushAttribute(pArray, pAttr, pString) {
        if (pAttr) {
            pArray.push(pString + "=\"" + renderString(pAttr) + "\"");
        }
    }

    function translateAttributes(pThing) {
        var lAttrs = [];
        pushAttribute(lAttrs, pThing.label, "label");
        // pushAttribute(lAttrs, pThing.idurl, "idurl");
        // pushAttribute(lAttrs, pThing.id, "id");
        // pushAttribute(lAttrs, pThing.url, "url");
        pushAttribute(lAttrs, pThing.linecolor, "color");
        pushAttribute(lAttrs, pThing.textcolor, "fontcolor");
        pushAttribute(lAttrs, pThing.textbgcolor, "fillcolor");
        return lAttrs;
    }

    function renderAttributeBlock(pAttrs) {
        var lRetVal = [];
        if (pAttrs.length > 0) {
            var i = 0;
            lRetVal = " [";
            for ( i = 0; i < pAttrs.length - 1; i++) {
                lRetVal += pAttrs[i] + ", ";
            }
            lRetVal += pAttrs[pAttrs.length - 1];
            lRetVal += "]";
        }

        return lRetVal;
    }

    function renderEntity(pEntity) {
        var lRetVal = "";
        lRetVal += renderEntityName(pEntity.name);
        lRetVal += renderAttributeBlock(translateAttributes(pEntity));
        return lRetVal;
    }

    function renderEntities(pEntities) {
        var lRetVal = "";
        var i = 0;
        if (pEntities.length > 0) {
            for ( i = 0; i < pEntities.length; i++) {
                lRetVal += INDENT + renderEntity(pEntities[i]) + ";\n";
            }
        }
        return lRetVal;
    }

    function counterizeArc(pArc, pCounter) {
        var lArc = pArc;
        if (lArc.label) {
            lArc.label = "(" + pCounter + ") " + lArc.label;
        } else {
            lArc.label = "(" + pCounter + ")";
        }
        return lArc;
    }

    function renderArc(pArc, pCounter, pIndent) {
        var lRetVal = "";
        var lArc = pArc;
        //JSON.parse(JSON.stringify(pArc));
        var lAttrs = [];
        var lAggregatedKind = map.getAggregate(pArc.kind);

        if (lAggregatedKind === "box") {
            var lBoxName = "box" + pCounter.toString();
            lRetVal += lBoxName;
            lAttrs = translateAttributes(lArc);
            pushAttribute(lAttrs, map.getStyle(pArc.kind), "style");
            pushAttribute(lAttrs, map.getShape(pArc.kind), "shape");

            lRetVal += renderAttributeBlock(lAttrs) + "\n" + INDENT + pIndent;

            lAttrs = [];
            pushAttribute(lAttrs, "dotted", "style");
            pushAttribute(lAttrs, "none", "dir");

            lRetVal += lBoxName + " -- {" + renderEntityName(lArc.from) + "," + renderEntityName(lArc.to) + "}";
            lRetVal += renderAttributeBlock(lAttrs);
        } else {
            lArc = counterizeArc(pArc, pCounter);
            lAttrs = translateAttributes(lArc);
            pushAttribute(lAttrs, map.getStyle(pArc.kind), "style");
            switch(lAggregatedKind) {
                case ("directional") :
                    {
                        pushAttribute(lAttrs, map.getArrow(pArc.kind), "arrowhead");
                    }
                    break;
                case("bidirectional"):
                    {
                        pushAttribute(lAttrs, map.getArrow(pArc.kind), "arrowhead");
                        pushAttribute(lAttrs, map.getArrow(pArc.kind), "arrowtail");
                        pushAttribute(lAttrs, "both", "dir");
                    }
                    break;
                case ("nondirectional"):
                    {
                        pushAttribute(lAttrs, "none", "dir");
                    }
                    break;
            }
            if (!pArc.arcs) {
                lRetVal += renderEntityName(lArc.from) + " ";
                lRetVal += "--";
                lRetVal += " " + renderEntityName(lArc.to);
                lRetVal += renderAttributeBlock(lAttrs);
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
                    for ( j = 0; j < pArcs[i].length; j++) {
                        if (pArcs[i][j].from && pArcs[i][j].kind && pArcs[i][j].to) {
                            lRetVal += INDENT + pIndent + renderArc(pArcs[i][j], ++gCounter, pIndent) + "\n";
                            if (pArcs[i][j].arcs) {
                                lRetVal += INDENT + pIndent + "subgraph cluster_" + gCounter.toString() + '{';
                                if (pArcs[i][j].label) {
                                    lRetVal += "\n" + INDENT + pIndent + ' label="' + pArcs[i][j].kind + ": " + pArcs[i][j].label + '" labeljust="l" \n';
                                }
                                lRetVal += renderArcLines(pArcs[i][j].arcs, pIndent + INDENT);
                                lRetVal += INDENT + pIndent + "}\n";
                            }
                        }
                    }
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
