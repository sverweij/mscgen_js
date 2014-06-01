/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./asttransform", "./dotmap"],
/**
 * Defines some functions to simplify a given abstract syntax tree.
 *
 * @exports node/flatten
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
function(transform, map) {

    var gMaxDepth = 0;

    function nameAsLabel(pEntity) {
        if (pEntity.label === undefined) {
            pEntity.label = pEntity.name;
        }
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

        if (pArc.kind && lRTLkinds[pArc.kind]) {
            pArc.kind = lRTLkinds[pArc.kind];

            var lTmp = pArc.from;
            pArc.from = pArc.to;
            pArc.to = lTmp;
        }
        return pArc;
    }

    function overrideColorsFromThing(pArc, pThing) {
        if (!(pArc.linecolor) && pThing.arclinecolor) {
            pArc.linecolor = pThing.arclinecolor;
        }
        if (!(pArc.textcolor) && pThing.arctextcolor) {
            pArc.textcolor = pThing.arctextcolor;
        }
        if (!(pArc.textbgcolor) && pThing.arctextbgcolor) {
            pArc.textbgcolor = pThing.arctextbgcolor;
        }
        return pArc;
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

        if (pArc && pArc.from) {
            var lEntityIndex = getEntityIndex(pEntities, pArc.from);
            if (lEntityIndex > -1) {
                pArc = overrideColorsFromThing(pArc, pEntities[lEntityIndex]);
            }
        }
        return pArc;
    }

    function calcNumberOfRows(pArcRow) {
        var lRetval = pArcRow.arcs.length;
        for (var i = 0; i < pArcRow.arcs.length; i++) {
            if (pArcRow.arcs[i][0].arcs) {
                lRetval += calcNumberOfRows(pArcRow.arcs[i][0]) + 1;
            }
        }
        return lRetval;
    }

    function unwindArcRow(pArcRow, pAST, pFrom, pTo, pDepth) {
        var lArcSpanningArc = {};
        if ("inline_expression" === map.getAggregate(pArcRow[0].kind)) {
            lArcSpanningArc = JSON.parse(JSON.stringify(pArcRow[0]));

            if (lArcSpanningArc) {
                if (lArcSpanningArc.arcs) {
                    lArcSpanningArc.numberofrows = calcNumberOfRows(lArcSpanningArc);
                    delete lArcSpanningArc.arcs;
                    pAST.arcs.push([lArcSpanningArc]);
                    for (var lArcRowCount = 0; lArcRowCount < pArcRow[0].arcs.length; lArcRowCount++) {
                        unwindArcRow(pArcRow[0].arcs[lArcRowCount], pAST, lArcSpanningArc.from, lArcSpanningArc.to, pDepth + 1);
                        for (var lArcCount = 0; lArcCount < pArcRow[0].arcs[lArcRowCount].length; lArcCount++) {
                            overrideColorsFromThing(pArcRow[0].arcs[lArcRowCount][lArcCount], lArcSpanningArc);
                        }
                    }
                    lArcSpanningArc.depth = pDepth;
                    if (pDepth > gMaxDepth) {
                        gMaxDepth = pDepth;
                    }
                    pAST.arcs.push([{
                        kind : "|||",
                        from : lArcSpanningArc.from,
                        to : lArcSpanningArc.to
                        // label : lArcSpanningArc.depth.toString()
                        // label : lArcSpanningArc.kind.toUpperCase() + " end"
                    }]);
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
                        pArcRow[i].depth = pDepth;
                    }
                }
            }
            pAST.arcs.push(pArcRow);
        }
    }

    function _unwind(pAST) {
        var lRowCount;
        var lAST = {};
        gMaxDepth = 0;

        lAST.options = pAST.options ? JSON.parse(JSON.stringify(pAST.options)) : undefined;
        lAST.entities = pAST.entities ? JSON.parse(JSON.stringify(pAST.entities)) : undefined;
        lAST.arcs = [];

        if (pAST && pAST.arcs) {
            for ( lRowCount = 0; lRowCount < pAST.arcs.length; lRowCount++) {
                unwindArcRow(pAST.arcs[lRowCount], lAST, undefined, undefined, 0);
            }
        }
        lAST.depth = gMaxDepth + 1;
        return lAST;
    }

    function explodeBroadcastArc(pEntities, pArc) {
        var lRetVal = [];
        for (var lEntityIndex = 0; lEntityIndex < pEntities.length; lEntityIndex++) {
            if (pArc.from !== pEntities[lEntityIndex].name) {
                pArc.to = pEntities[lEntityIndex].name;
                lRetVal.push(JSON.parse(JSON.stringify(pArc)));
            }
        }
        return lRetVal;
    }

    function _explodeBroadcasts(pAST) {
        if (pAST.entities && pAST.arcs) {
            var lExplodedArcsAry = [];
            var lOriginalBroadcastArc = {};
            for (var lArcRowIndex = 0; lArcRowIndex < pAST.arcs.length; lArcRowIndex++) {
                for (var lArcIndex = 0; lArcIndex < pAST.arcs[lArcRowIndex].length; lArcIndex++) {
                    /* assuming swap has been done already and "*" is in no 'from'  anymore */
                    if (pAST.arcs[lArcRowIndex][lArcIndex].to === "*") {
                        /* save a clone of the broadcast arc attributes
                         * and remove the original bc arc
                         */
                        lOriginalBroadcastArc = JSON.parse(JSON.stringify(pAST.arcs[lArcRowIndex][lArcIndex]));
                        delete pAST.arcs[lArcRowIndex][lArcIndex];
                        lExplodedArcsAry = explodeBroadcastArc(pAST.entities, lOriginalBroadcastArc);
                        pAST.arcs[lArcRowIndex][lArcIndex] = lExplodedArcsAry.shift();
                        pAST.arcs[lArcRowIndex] = pAST.arcs[lArcRowIndex].concat(lExplodedArcsAry);
                    }
                }
            }
        }
        return pAST;
    }

    return {
        /**
         * If the arc is "facing backwards" (right to left) this function sets the arc
         * kind to the left to right variant (e.g. <= becomes =>) and swaps the operands
         * resulting in an equivalent (b << a becomes a >> b).
         *
         * If the arc is facing forwards or is symetrical, it is left alone.
         *
         * @param {arc} pArc
         * @return {arc}
         */
        swapRTLArc : function(pArc) {
            return _swapRTLArc(pArc);
        },
        /**
         * Flattens any recursion in the arcs of the given abstract syntax tree to make it
         * more easy to render.
         * - TODO: document this stuff
         *
         * @param {ast} pAST
         * @return {ast}
         */
        unwind : function(pAST) {
            return _unwind(pAST);
        },
        /**
         * expands "broadcast" arcs to its individual counterparts
         * Example in mscgen:
         * msc{
         *     a,b,c,d;
         *     a -> *;
         * }
         * output:
         * msc {
         *     a,b,c,d;
         *     a -> b, a -> c, a -> d;
         * }
         */
        explodeBroadcasts : function(pAST) {
            return _explodeBroadcasts(pAST);
        },
        /**
         * Simplifies an AST:
         *    - entities without a label get one (the name of the label)
         *    - arc directions get unified to always go forward
         *      (e.g. for a <- b swap entities and reverse direction so it becomes a -> b)
         *    - explodes broadcast arcs (TODO)
         *    - flattens any recursion (see the {@linkcode unwind} function in
         *      in this module)
         *    - distributes arc*color from the entities to the affected arcs
         * @param {ast} pAST
         * @return {ast}
         */
        flatten : function(pAST) {
            return transform.transform(_unwind(pAST), [nameAsLabel], [_swapRTLArc, overrideColors]);
        },
        /**
         * Simplifies an AST same as the @link {flatten} function, but without flattening the recursion
         *
         * @param {ast} pAST
         * @return {ast}
         */
        dotFlatten : function(pAST) {
            return _explodeBroadcasts(transform.transform(pAST, [nameAsLabel], [_swapRTLArc, overrideColors]));
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
