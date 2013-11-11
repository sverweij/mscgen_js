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

define(["./asttransform"], function(transform) {

    function nameAsLabel(pEntity) {
        var lEntity = pEntity;

        if (lEntity.label === undefined) {
            lEntity.label = lEntity.name;
        }
        return lEntity;
    }
    
    function swapRTLArc(pArc) {
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

    function explodeArc(pArc) {
        var lArc = pArc;
        if (lArc && lArc.from && lArc.to && lArc.to === "*") {
            // for each entity (except pArc.from) insert a new, parallel arc in the current arc row
            // If there is a label, insert it once. Simple hack could be to insert a ||| with the label,
            //    possibly extended by an endline
        }
        return lArc;

    }


    return {
        flatten : function(pAST) {
            return transform.transform(pAST, [nameAsLabel], [swapRTLArc, explodeArc, overrideColors]);
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
