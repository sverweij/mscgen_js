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
 * @license GPLv3
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
function(transform, map) {

    var gMaxDepth = 0;

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

    function overrideColorsFromThing(pArc, pThing) {
        var lArc = pArc;

        if (!(lArc.linecolor) && pThing.arclinecolor) {
            lArc.linecolor = pThing.arclinecolor;
        }
        if (!(lArc.textcolor) && pThing.arctextcolor) {
            lArc.textcolor = pThing.arctextcolor;
        }
        if (!(lArc.textbgcolor) && pThing.arctextbgcolor) {
            lArc.textbgcolor = pThing.arctextbgcolor;
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
                lArc = overrideColorsFromThing(pArc, pEntities[lEntityIndex]);
            }
        }
        return lArc;
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
        if ("arcspanning" === map.getAggregate(pArcRow[0].kind)) {
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

    function _explodeBroadcasts(pAST) {
        if (pAST.entities && pAST.arcs) {
            var lArcRowIndex = 0;
            var lArcIndex = 0;
            for (lArcRowIndex in pAST.arcs) {
                for (lArcIndex in pAST.arcs[lArcRowIndex]) {
                    /* assuming swap has been done already and "*" is in no 'from'  anymore */
                    if (pAST.arcs[lArcRowIndex][lArcIndex].to === "*") {
                        /* save a clone of the broadcast arc attributes
                         * and remove the original bc arc
                         */
                        var lOriginalBroadcastArc = JSON.parse(JSON.stringify(pAST.arcs[lArcRowIndex][lArcIndex]));
                        delete pAST.arcs[lArcRowIndex][lArcIndex];
                        var lRatchet = true;
                        var lEntityIndex = 0;
                        for (lEntityIndex in pAST.entities) {
                            if (lOriginalBroadcastArc.from !== pAST.entities[lEntityIndex].name) {
                                lOriginalBroadcastArc.to = pAST.entities[lEntityIndex].name;
                                if (lRatchet) {
                                    lRatchet = false;
                                    pAST.arcs[lArcRowIndex][lArcIndex] = JSON.parse(JSON.stringify(lOriginalBroadcastArc));
                                } else {
                                    pAST.arcs[lArcRowIndex].push(JSON.parse(JSON.stringify(lOriginalBroadcastArc)));
                                }
                            }
                        }

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
