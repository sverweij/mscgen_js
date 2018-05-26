/*
 * Transforms an AST using the given functions that
 * operate on entities, arcs and arc rows respectively
 */

/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    function transformEntities(pEntities, pFunctionAry) {
        if (pEntities && pFunctionAry) {
            pEntities.forEach(function(pEntity) {
                pFunctionAry.forEach(function(pFunction) {
                    pFunction(pEntity);
                });
            });
        }
    }

    function transformArc(pEntities, pArcRow, pArc, pFunctionAry) {
        if (pFunctionAry) {
            pFunctionAry.forEach(function(pFunction) {
                pFunction(pArc, pEntities, pArcRow);
            });
        }
    }

    function transformArcRow(pEntities, pArcRow, pFunctionAry) {
        pArcRow.forEach(function(pArc){
            transformArc(pEntities, pArcRow, pArc, pFunctionAry);
            if (pArc.arcs) {
                transformArcRows(pEntities, pArc.arcs, pFunctionAry);
            }
        });
    }

    function transformArcRows(pEntities, pArcRows, pFunctionAry) {
        if (pEntities && pArcRows && pFunctionAry) {
            pArcRows.forEach(function(pArcRow) {
                transformArcRow(pEntities, pArcRow, pFunctionAry);
            });
        }
    }

    /**
     * Generic function for performing manipulations on abstract syntax trees. It takes a
     * series of functions as arguments and applies them to the entities, arcs and arc
     * rows in the syntax tree respectively.
     *
     * @param {ast} pAST - the syntax tree to transform
     * @param {Array} pEntityTransforms - an array of functions. Each function shall take
     * an entity as input an return the modified entity
     * @param {Array} pArcTransforms - an array of functions. Each function shall take
     * and arc and entities as input and return the modified arc
     * @param {Array} pArcRowTransforms - an array of functions. Each function shall take
     * an arc row and entities as input return the modified arc row
     * @return {ast} - the modified syntax tree
     */
    return function (pAST, pEnityTransforms, pArcTransforms) {
        transformEntities(pAST.entities, pEnityTransforms);
        transformArcRows(pAST.entities, pAST.arcs, pArcTransforms);
        return pAST;
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
