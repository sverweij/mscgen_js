/*
 * Simplifies an AST:
 *    - entities without a label get one (the name of the label)
 *    - unify directions (e.g. for a <- b swap entities and reverse direction so it becomes a -> b)
 *    - explode broadcast arcs
 *    - distribute arc*color from the entities to the affected arcs
 *    - add direction attribute to arcs
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {

    function flattenEntities(pEntities, pFunctionAry) {
        var i, j;
        var lEntities = pEntities;
        if (lEntities) {
            for ( i = 0; i < lEntities.length; i++) {
                if (pFunctionAry) {
                    for ( j = 0; j < pFunctionAry.length; j++) {
                        lEntities[i] = pFunctionAry[j](lEntities[i]);
                    }
                }
            }
        }
        return lEntities;
    }

    function flattenArcs(pEntities, pArcRows, pRowFunctionAry, pFunctionAry) {
        var lRowCount, lArcCount, lRowFuncCount, lFuncCount;
        var lArcRows = pArcRows;
        
        if (pEntities && lArcRows) {
            for ( lRowCount = 0; lRowCount < lArcRows.length; lRowCount++) {
                if (pRowFunctionAry) {
                    for ( lRowFuncCount = 0; lRowFuncCount < pRowFunctionAry.length; lRowFuncCount++) {
                        lArcRows[lRowCount] = pRowFunctionAry[lRowFuncCount](pEntities, lArcRows[lRowCount]);
                    }
                }
                if (pFunctionAry) {
                    for ( lArcCount = 0; lArcCount < lArcRows[lRowCount].length; lArcCount++) {
                        for ( lFuncCount = 0; lFuncCount < pFunctionAry.length; lFuncCount++) {
                            lArcRows[lRowCount][lArcCount] =
                                pFunctionAry[lFuncCount](pEntities, lArcRows[lRowCount][lArcCount]);
                        }
                    }
                }
            }
        }
        return lArcRows;
    }

    function nameAsLabel(pEntity) {
        var lEntity = pEntity;
        
        if (lEntity.label === undefined) {
            lEntity.label = lEntity.name;
        }
        return lEntity;
    }

    function swapRTLArc(pEntities, pArc) {
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
    function overrideColors(pEntities, pArc) {
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

    function explodeArc(pEntities, pArc) {
        var lArc = pArc;
        if (lArc && lArc.from && lArc.to && lArc.to === "*"){
            // for each entity (except pArc.from) insert a new, parallel arc in the current arc row
            // If there is a label, insert it once. Simple hack could be to insert a ||| with the label,
            //    possibly extended by an endline
        }
        return lArc;

    }

    function _flatten(pAST) {
        var fa = [nameAsLabel];
        var lAST = pAST;
        var lEntityFunctions = [nameAsLabel];
        lEntityFunctions.concat(pEntityFunctions);
        
        lAST.entities = flattenEntities(lAST.entities, lEntityFunctions);

        lAST.arcs = flattenArcs(pAST.entities, pAST.arcs, null, [swapRTLArc, explodeArc, overrideColors]);
        return lAST;
    }

    return {
        flatten : function(pAST) {
            return _flatten(pAST);
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
