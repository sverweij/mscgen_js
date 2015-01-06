/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./asttransform", "./dotmap", "../../utl/utensils"],
/**
 * Defines some functions to simplify a given abstract syntax tree.
 *
 * @exports node/flatten
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
function(transform, map, utl) {
    "use strict";

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
    }

    /*
     * assumes arc direction to be either LTR, both, or none
     * so arc.from exists.
     */
    function overrideColors(pArc, pEntities) {
        function getEntityIndex(pEntities, pNameKey) {
            // TODO: could benefit from cache or precalculation
            for (var i = 0; i < pEntities.length; i++) {
                if (pEntities[i].name === pNameKey) {
                    return i;
                }
            }
            return -1;
        }

        if (pArc && pArc.from) {
            var lEntityIndex = getEntityIndex(pEntities, pArc.from);
            if (lEntityIndex > -1) {
                overrideColorsFromThing(pArc, pEntities[lEntityIndex]);
            }
        }
    }

    function calcNumberOfRows(pArcRow) {
        var lRetval = pArcRow.arcs.length;
        pArcRow.arcs.forEach(function(pArcRow) {
            if (pArcRow[0].arcs) {
                lRetval += calcNumberOfRows(pArcRow[0]) + 1;
            }
        });
        return lRetval;
    }

    function unwindArcRow(pArcRow, pAST, pFrom, pTo, pDepth) {
        var lArcSpanningArc = {};
        if ("inline_expression" === map.getAggregate(pArcRow[0].kind)) {
            lArcSpanningArc = utl.deepCopy(pArcRow[0]);

            if (lArcSpanningArc) {
                if (lArcSpanningArc.arcs) {
                    lArcSpanningArc.numberofrows = calcNumberOfRows(lArcSpanningArc);
                    delete lArcSpanningArc.arcs;
                    pAST.arcs.push([lArcSpanningArc]);
                    pArcRow[0].arcs.forEach(function(pArcRow0) {
                        unwindArcRow(pArcRow0, pAST, lArcSpanningArc.from, lArcSpanningArc.to, pDepth + 1);
                        pArcRow0.forEach(function(pArc) {
                            overrideColorsFromThing(pArc, lArcSpanningArc);
                        });
                    });

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
                pArcRow.forEach(function(pArc) {
                    if ("emptyarc" === map.getAggregate(pArc.kind)) {
                        pArc.from = pFrom;
                        pArc.to = pTo;
                        pArc.depth = pDepth;
                    }
                });
            }
            pAST.arcs.push(pArcRow);
        }
    }

    function _unwind(pAST) {
        var lAST = {};
        gMaxDepth = 0;

        lAST.options = pAST.options ? utl.deepCopy(pAST.options) : undefined;
        lAST.entities = pAST.entities ? utl.deepCopy(pAST.entities) : undefined;
        lAST.arcs = [];

        if (pAST && pAST.arcs) {
            pAST.arcs.forEach(function(pArcRow) {
                unwindArcRow(pArcRow, lAST, undefined, undefined, 0);
            });
        }
        lAST.depth = gMaxDepth + 1;
        return lAST;
    }

    function explodeBroadcastArc(pEntities, pArc) {
        var lRetVal = [];
        pEntities.forEach(function(pEntity) {
            if (pArc.from !== pEntity.name) {
                pArc.to = pEntity.name;
                lRetVal.push(utl.deepCopy(pArc));
            }

        });
        return lRetVal;
    }

    function _explodeBroadcasts(pAST) {
        if (pAST.entities && pAST.arcs) {
            var lExplodedArcsAry = [];
            var lOriginalBroadcastArc = {};
            pAST.arcs.forEach(function(pArcRow, pArcRowIndex) {
                pArcRow.forEach(function(pArc, pArcIndex) {
                    /* assuming swap has been done already and "*" is in no 'from'  anymore */
                    if (pArc.to === "*") {
                        /* save a clone of the broadcast arc attributes
                         * and remove the original bc arc
                         */
                        lOriginalBroadcastArc = utl.deepCopy(pArc);
                        delete pAST.arcs[pArcRowIndex][pArcIndex];
                        lExplodedArcsAry = explodeBroadcastArc(pAST.entities, lOriginalBroadcastArc);
                        pArcRow[pArcIndex] = lExplodedArcsAry.shift();
                        pAST.arcs[pArcRowIndex] = pArcRow.concat(lExplodedArcsAry);
                    }
                });
            });
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
        swapRTLArc : _swapRTLArc,
        /**
         * Flattens any recursion in the arcs of the given abstract syntax tree to make it
         * more easy to render.
         * - TODO: document this stuff
         *
         * @param {ast} pAST
         * @return {ast}
         */
        unwind : _unwind,
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
        explodeBroadcasts : _explodeBroadcasts,
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
