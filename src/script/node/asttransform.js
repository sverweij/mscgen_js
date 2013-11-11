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

    function transformEntities(pEntities, pFunctionAry) {
        var i, j;
        var lEntities = pEntities;
        var bla = [];

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
                if (pFunctionAry) {
                    for ( lArcCount = 0; lArcCount < lArcRows[lRowCount].length; lArcCount++) {
                        for ( lFuncCount = 0; lFuncCount < pFunctionAry.length; lFuncCount++) {
                            lArcRows[lRowCount][lArcCount] = pFunctionAry[lFuncCount](lArcRows[lRowCount][lArcCount], pEntities, lArcRows[lRowCount]);
                        }
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
