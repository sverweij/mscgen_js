/*
 * Transforms an AST using the given functions that
 * operate on entities, arcs and arc rows respectively
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    /**
     *
     * @exports node/asttransform
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */
    "use strict";

    function transformEntities(pEntities, pFunctionAry) {
        var i, j;
        var lEntities = pEntities;

        if (lEntities && pFunctionAry) {
            for ( i = 0; i < lEntities.length; i++) {
                for ( j = 0; j < pFunctionAry.length; j++) {
                    lEntities[i] = pFunctionAry[j](lEntities[i]);
                }
            }
        }
        return lEntities;
    }

    function transformArcs(pEntities, pArcRows, pRowFunctionAry, pFunctionAry) {
        var lRowCount, lArcCount, lRowFuncCount, lFuncCount;
        var lArcRows = pArcRows;

        if (pEntities && lArcRows && (pRowFunctionAry || pFunctionAry)) {
            for ( lRowCount = 0; lRowCount < lArcRows.length; lRowCount++) {
                if (pRowFunctionAry) {
                    for ( lRowFuncCount = 0; lRowFuncCount < pRowFunctionAry.length; lRowFuncCount++) {
                        lArcRows[lRowCount] = pRowFunctionAry[lRowFuncCount](lArcRows[lRowCount], pEntities);
                    }
                }

                for ( lArcCount = 0; lArcCount < lArcRows[lRowCount].length; lArcCount++) {
                    if (pFunctionAry) {
                        for ( lFuncCount = 0; lFuncCount < pFunctionAry.length; lFuncCount++) {
                            lArcRows[lRowCount][lArcCount] = pFunctionAry[lFuncCount](lArcRows[lRowCount][lArcCount], pEntities, lArcRows[lRowCount]);
                        }
                    }
                    if (lArcRows[lRowCount][lArcCount].arcs) {
                        transformArcs(pEntities, lArcRows[lRowCount][lArcCount].arcs, pRowFunctionAry, pFunctionAry);
                    }
                }

            }
        }
        return lArcRows;
    }

    function _transform(pAST, pEnityTransforms, pArcTransforms, pArcRowTransforms) {
        var lAST = pAST;
        lAST.entities = transformEntities(lAST.entities, pEnityTransforms);

        lAST.arcs = transformArcs(pAST.entities, pAST.arcs, pArcRowTransforms, pArcTransforms);
        return lAST;
    }

    return {
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
        transform : function(pAST, pEnityTransforms, pArcTransforms, pArcRowTransforms) {
            return _transform(pAST, pEnityTransforms, pArcTransforms, pArcRowTransforms);
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
