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


    function transformEntity(pEntity, pFunctionAry) {
        for (var i = 0; i < pFunctionAry.length; i++) {
            pEntity = pFunctionAry[i](pEntity);
        }
    }

    function transformEntities(pEntities, pFunctionAry) {
        if (pEntities && pFunctionAry) {
            for ( var i = 0; i < pEntities.length; i++) {
                transformEntity(pEntities[i], pFunctionAry);
            }
        }
    }
    
    function transformArc(pEntities, pArcRow, pArc, pFunctionAry) {
        if (pFunctionAry) {
            for (var lFuncCount = 0; lFuncCount < pFunctionAry.length; lFuncCount++) {
                pArc = pFunctionAry[lFuncCount](pArc, pEntities, pArcRow);
            }
        }
    }
    
    function transformArcRow(pEntities, pArcRow, pRowFunctionAry, pFunctionAry) {
        if (pRowFunctionAry) {
            for (var lRowFuncCount = 0; lRowFuncCount < pRowFunctionAry.length; lRowFuncCount++) {
                pArcRow = pRowFunctionAry[lRowFuncCount](pArcRow, pEntities);
            }
        }

        for (var lArcCount = 0; lArcCount < pArcRow.length; lArcCount++) {
            transformArc(pEntities, pArcRow, pArcRow[lArcCount], pFunctionAry);
            if (pArcRow[lArcCount].arcs) {
                transformArcRows(pEntities, pArcRow[lArcCount].arcs, pRowFunctionAry, pFunctionAry);
            }
        }
    }

    function transformArcRows(pEntities, pArcRows, pRowFunctionAry, pFunctionAry) {
        if (pEntities && pArcRows && (pRowFunctionAry || pFunctionAry)) {
            for ( var lRowCount = 0; lRowCount < pArcRows.length; lRowCount++) {
                transformArcRow(pEntities, pArcRows[lRowCount], pRowFunctionAry, pFunctionAry);
            }
        }
    }

    function _transform(pAST, pEnityTransforms, pArcTransforms, pArcRowTransforms) {
        transformEntities(pAST.entities, pEnityTransforms);
        transformArcRows(pAST.entities, pAST.arcs, pArcRowTransforms, pArcTransforms);
        return pAST;
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
