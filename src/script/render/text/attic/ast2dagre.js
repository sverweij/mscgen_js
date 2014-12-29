/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as an dagre object
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* global dagreD3 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./flatten", /* "./textutensils", */ "./dotmap", "../../lib/dagre/dagred3", ../utl/utensils], function(flatten, /*txt,*/ map, dagred3, utl) {
    // require("../../lib/dagre/dagred3");
    
    var gCounter = 0;
    var gDiGraph;


    function _renderAST(pAST) {
        gDiGraph = new dagreD3.Digraph();

        var lAST = flatten.dotFlatten(pAST);

        if (lAST) {
            if (lAST.entities) {
                renderEntities(lAST.entities);
            }
            if (lAST.arcs) {
                gCounter = 0;
                renderArcLines(lAST.arcs);
            }
        }
        return gDiGraph;

    }

    /*
    function renderString(pString) {
        var lStringAry = txt.wrap(pString.replace(/\"/g, "\\\""), 40);
        var lString = "";

        for (var i = 0; i < lStringAry.length - 1; i++) {
            lString += lStringAry[i] + "\n";
        }
        lString += lStringAry[lStringAry.length - 1];
        return lString;
    }
    
    
    function pushAttribute(pArray, pAttr, pString) {
        if (pAttr) {
            pArray.push(pString + "=\"" + renderString(pAttr) + "\"");
        }
    }
    
    function translateAttributes(pThing) {
        var lAttrs = [];
        pushAttribute(lAttrs, pThing.label, "label");
        pushAttribute(lAttrs, pThing.linecolor, "color");
        pushAttribute(lAttrs, pThing.textcolor, "fontcolor");
        pushAttribute(lAttrs, pThing.textbgcolor, "fillcolor");
        return lAttrs;
    }
    */

    function renderEntities(pEntities) {
        var i = 0;
        if (pEntities.length > 0) {
            for ( i = 0; i < pEntities.length; i++) {
                gDiGraph.addNode(pEntities[i].name, {
                    label : pEntities[i].label
                });
            }
        }
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

    function renderArc(pArc, pCounter) {
        var lArc = pArc;
        //utl.deepCopy(pArc);
        var lAggregatedKind = map.getAggregate(pArc.kind);

        if (lAggregatedKind === "box") {
            // var lBoxName = "box" + pCounter.toString();
            // TODO - nice things with boxes
        } else {
            lArc = counterizeArc(pArc, pCounter);
            if (!pArc.arcs) {
                gDiGraph.addEdge(null, lArc.from, lArc.to, {
                    label : lArc.label
                });
            }
        }
    }

    function renderArcLines(pArcs) {
        var i = 0;
        var j = 0;

        if (pArcs.length > 0) {
            for ( i = 0; i < pArcs.length; i++) {
                if (pArcs[i].length > 0) {
                    for ( j = 0; j < pArcs[i].length; j++) {
                        if (pArcs[i][j].from && pArcs[i][j].kind && pArcs[i][j].to) {
                            renderArc(pArcs[i][j], ++gCounter);
                            if (pArcs[i][j].arcs) {
                                // TODO - create a nice subgraph cluster and ...
                                /// render the arc lines within that subgraph
                                renderArcLines(pArcs[i][j].arcs);
                            }
                        }
                    }
                }
            }
        }
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
