/*
 * Simplifies an AST:
 *    - entities without a label get one (the name of the label)
 *    - arc directions get unified to always go forward
 *      (e.g. for a <- b swap entities and reverse direction so it becomes a -> b)
 *    - explodes broadcast arcs (TODO)
 *    - distributes arc*color from the entities to the affected arcs
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./asttransform", "./dotmap"], function(transform, map) {

    function nameAsLabel(pEntity) {
        var lEntity = pEntity;

        if (lEntity.label === undefined) {
            lEntity.label = lEntity.name;
        }
        return lEntity;
    }

    function _swapRTLArc(pArc) {
        var lRTLkinds = {
            "<-" : "->",
            "<=" : "=>",
            "<<=" : "=>>",
            "<<" : ">>",
            "<:" : ":>",
            "x-" : "-x"
        };
        var lArc = pArc;

        if (lArc.kind && lRTLkinds[lArc.kind]) {
            lArc.kind = lRTLkinds[lArc.kind];

            var lTmp = lArc.from;
            lArc.from = lArc.to;
            lArc.to = lTmp;
        }

        return lArc;
    }

    /*
     * assumes arc direction to be either LTR, both, or none
     * so arc.from exists.
     */
    function overrideColors(pArc, pEntities) {
        function getEntityIndex(pEntities, pNameKey) {
            var i;
            // TODO: could benefit from cache or precalculation
            for ( i = 0; i < pEntities.length; i++) {
                if (pEntities[i].name === pNameKey) {
                    return i;
                }
            }
            return -1;
        }

        var lArc = pArc;
        if (lArc && lArc.from) {
            var lEntityIndex = getEntityIndex(pEntities, lArc.from);
            if (lEntityIndex > -1) {
                if (!(lArc.linecolor) && pEntities[lEntityIndex].arclinecolor) {
                    lArc.linecolor = pEntities[lEntityIndex].arclinecolor;
                }
                if (!(lArc.textcolor) && pEntities[lEntityIndex].arctextcolor) {
                    lArc.textcolor = pEntities[lEntityIndex].arctextcolor;
                }
                if (!(lArc.textbgcolor) && pEntities[lEntityIndex].arctextbgcolor) {
                    lArc.textbgcolor = pEntities[lEntityIndex].arctextbgcolor;
                }
            }
        }
        return lArc;
    }

    function calcNumberOfArcs(pArcRow) {
        var lRetval = pArcRow.arcs.length;
        for (var i = 0; i < pArcRow.arcs.length; i++) {
            if ("arcspanning" === map.getAggregate(pArcRow.arcs[i][0].kind)) {
                lRetval += calcNumberOfArcs(pArcRow.arcs[i][0]);
            }
        }
        return lRetval;
    }

    function unwindArcRow(pArcRow, pAST, pFrom, pTo) {
        var lArcCount;
        var lArcSpanningArc = {};
        if ("arcspanning" === map.getAggregate(pArcRow[0].kind)) {
            lArcSpanningArc = JSON.parse(JSON.stringify(pArcRow[0]));

            if (lArcSpanningArc) {
                if (lArcSpanningArc.arcs) {
                    lArcSpanningArc.numberofarcs = calcNumberOfArcs(lArcSpanningArc).toString(10);
                    delete lArcSpanningArc.arcs;
                    pAST.arcs.push([lArcSpanningArc]);
                    for ( lArcCount = 0; lArcCount < pArcRow[0].arcs.length; lArcCount++) {
                        unwindArcRow(pArcRow[0].arcs[lArcCount], pAST, lArcSpanningArc.from, lArcSpanningArc.to);
                    }
                } else {
                    pAST.arcs.push([lArcSpanningArc]);
                }
            }
        } else {
            if (pFrom && pTo) {
                for (var i = 0; i < pArcRow.length; i++) {
                    if ("emptyarc" === map.getAggregate(pArcRow[i].kind)) {
                        pArcRow[i].from = pFrom;
                        pArcRow[i].to = pTo;
                    }
                }
            }
            pAST.arcs.push(pArcRow);
        }
    }

    function _unwind(pAST) {
        var lRowCount;
        var lAST = {};

        lAST.options = pAST.options ? JSON.parse(JSON.stringify(pAST.options)) : undefined;
        lAST.entities = pAST.entities ? JSON.parse(JSON.stringify(pAST.entities)) : undefined;
        lAST.arcs = [];

        if (pAST && pAST.arcs) {
            for ( lRowCount = 0; lRowCount < pAST.arcs.length; lRowCount++) {
                unwindArcRow(pAST.arcs[lRowCount], lAST);
            }
        }
        return lAST;
    }

    return {
        swapRTLArc : function(pArc) {
            return _swapRTLArc(pArc);
        },
        unwind : function(pAST) {
            return _unwind(pAST);
        },
        flatten : function(pAST) {
            return transform.transform(_unwind(pAST), [nameAsLabel], [_swapRTLArc, overrideColors]);
        },
        dotFlatten : function(pAST) {
            return transform.transform(pAST, [nameAsLabel], [_swapRTLArc, overrideColors]);
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
