/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(
/**
 * Defines some functions to simplify a given abstract syntax tree.
 *
 * @exports node/flatten
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
    function(require) {
        "use strict";

        var asttransform     = require("./asttransform");
        var aggregatekind    = require("./aggregatekind");
        var normalizekind    = require("./normalizekind");
        var normalizeoptions = require("./normalizeoptions");
        var _                = require("../../lib/lodash/lodash.custom");
        var escape           = require("../textutensils/escape");

        var gMaxDepth = 0;

        function nameAsLabel(pEntity) {
            if (typeof pEntity.label === 'undefined') {
                pEntity.label = pEntity.name;
            }
        }

        function unescapeLabels(pArcOrEntity){
            if (Boolean(pArcOrEntity.label)) {
                pArcOrEntity.label = escape.unescapeString(pArcOrEntity.label);
            }
            if (Boolean(pArcOrEntity.id)){
                pArcOrEntity.id = escape.unescapeString(pArcOrEntity.id);
            }
        }

        function emptyStringForNoLabel(pArc){
            pArc.label = Boolean(pArc.label) ? pArc.label : "";
        }

        function _swapRTLArc(pArc) {
            if (pArc.kind && (normalizekind(pArc.kind) !== pArc.kind)) {
                pArc.kind = normalizekind(pArc.kind);

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
            if (pArc && pArc.from) {
                var lMatchingEntities = pEntities.filter(function(pEntity){
                    return pEntity.name === pArc.from;
                });
                if (lMatchingEntities.length > 0) {
                    overrideColorsFromThing(pArc, lMatchingEntities[0]);
                }
            }
        }
        function calcNumberOfRows(pInlineExpression) {
            return pInlineExpression.arcs.reduce(function(pSum, pArc){
                return pSum + (Boolean(pArc[0].arcs) ? calcNumberOfRows(pArc[0]) + 1 : 0);
            }, pInlineExpression.arcs.length);
        }

        function unwindArcRow(pArcRow, pDepth, pFrom, pTo) {
            var lRetval = [];
            var lArcRowToPush = [];
            var lUnWoundSubArcs = [];

            pArcRow.forEach(
                function(pArc){
                    if ("inline_expression" === aggregatekind(pArc.kind)) {
                        pArc.depth = pDepth;
                        pArc.isVirtual = true;
                        if (Boolean(pArc.arcs)) {
                            var lInlineExpression = _.cloneDeep(pArc);
                            lInlineExpression.numberofrows = calcNumberOfRows(lInlineExpression);
                            delete lInlineExpression.arcs;
                            lArcRowToPush.push(lInlineExpression);

                            pArc.arcs.forEach(
                                function(pSubArcRow) {
                                    lUnWoundSubArcs = lUnWoundSubArcs.concat(
                                        unwindArcRow(
                                            pSubArcRow,
                                            pDepth + 1,
                                            lInlineExpression.from,
                                            lInlineExpression.to
                                        )
                                    );
                                    pSubArcRow.forEach(function(pSubArc) {
                                        overrideColorsFromThing(pSubArc, lInlineExpression);
                                    });
                                }
                            );
                            if (pDepth > gMaxDepth) {
                                gMaxDepth = pDepth;
                            }
                        } else {
                            lArcRowToPush.push(pArc);
                        }
                        lUnWoundSubArcs.push([{
                            kind : "|||",
                            from : pArc.from,
                            to : pArc.to,
                            isVirtual : true
                        }]);
                    } else {
                        if ((pFrom && pTo) && ("emptyarc" === aggregatekind(pArc.kind))) {
                            pArc.from = pFrom;
                            pArc.to = pTo;
                            pArc.depth = pDepth;
                        }
                        lArcRowToPush.push(pArc);
                    }
                }
            );
            lRetval.push(lArcRowToPush);
            return lRetval.concat(lUnWoundSubArcs);
        }

        function _unwind(pAST) {
            var lAST = {};
            gMaxDepth = 0;

            if (Boolean(pAST.options)){
                lAST.options = _.cloneDeep(pAST.options);
            }
            if (Boolean(pAST.entities)){
                lAST.entities = _.cloneDeep(pAST.entities);
            }
            lAST.arcs = [];

            if (pAST && pAST.arcs) {
                pAST.arcs
                    .forEach(function(pArcRow) {
                        unwindArcRow(pArcRow, 0)
                            .forEach(function(pUnwoundArcRow){
                                lAST.arcs.push(pUnwoundArcRow);
                            });
                    });
            }
            lAST.depth = gMaxDepth + 1;
            return lAST;
        }

        function explodeBroadcastArc(pEntities, pArc) {
            return pEntities.filter(function(pEntity){
                return pArc.from !== pEntity.name;
            }).map(function(pEntity) {
                pArc.to = pEntity.name;
                return _.cloneDeep(pArc);
            });
        }

        function _explodeBroadcasts(pAST) {
            if (pAST.entities && pAST.arcs) {
                var lExplodedArcsAry = [];
                var lOriginalBroadcastArc = {};
                pAST.arcs.forEach(function(pArcRow, pArcRowIndex) {
                    pArcRow
                        .filter(function(pArc){
                        /* assuming swap has been done already and "*"
                           is in no 'from'  anymore */
                            return pArc.to === "*";
                        })
                        .forEach(function(pArc, pArcIndex) {
                        /* save a clone of the broadcast arc attributes
                         * and remove the original bc arc
                         */
                            lOriginalBroadcastArc = _.cloneDeep(pArc);
                            delete pAST.arcs[pArcRowIndex][pArcIndex];
                            lExplodedArcsAry = explodeBroadcastArc(pAST.entities, lOriginalBroadcastArc);
                            pArcRow[pArcIndex] = lExplodedArcsAry.shift();
                            pAST.arcs[pArcRowIndex] = pArcRow.concat(lExplodedArcsAry);
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
         *    - explodes broadcast arcs
         *    - flattens any recursion (see the {@linkcode unwind} function in
         *      in this module)
         *    - distributes arc*color from the entities to the affected arcs
         * @param {ast} pAST
         * @return {ast}
         */
            flatten : function(pAST) {
                pAST.options = normalizeoptions(pAST.options);
                return asttransform(
                    _unwind(pAST),
                    [nameAsLabel, unescapeLabels],
                    [_swapRTLArc, overrideColors, unescapeLabels, emptyStringForNoLabel]
                );
            },
            /**
         * Simplifies an AST same as the @link {flatten} function, but without flattening the recursion
         *
         * @param {ast} pAST
         * @return {ast}
         */
            dotFlatten : function(pAST) {
                return _explodeBroadcasts(
                    asttransform(
                        pAST,
                        [nameAsLabel],
                        [_swapRTLArc, overrideColors]
                    )
                );
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
