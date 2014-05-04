/* Assigns grayscales to entities based on the number of arcs
 * - the entites with the highest number of incoming/
 *   outgoing arcs gets black (#000000) as line and text color
 * - the entities with the lowest number of incoming/ outgoing
 *   arcs gets a light shade of grey (#EEEEEE) as color
 * - the program assigns the entities with numbers in a color
 *   in between
 *
 * - the program counts all arcs, except
 *   - boxes (note, box, abox, rbox)
 *   - self reference arcs
 * - the program counts incoming and outgoing arcs separately
 * - the program counts bi directional and no-directional counts
 *   as incoming _and_ outgoing
 * - the program
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../asttransform", "./metrics"], function(transform, metrics) {
    var gEntityCounts = {};
    var gSmallest = 0;
    var gLargest = 0;

    function calculateColor(pValue, pMin, pMax) {
        var lTargetRange = 0xAA - 0x00;
        var lRelativeValue = 0;
        if (pMax !== pMin) {
            lRelativeValue = 1.0 - ((pValue - pMin) / (pMax - pMin));
        }
        var lColorValue = Math.round(lTargetRange * lRelativeValue).toString(16);
        return "#" + lColorValue + lColorValue + lColorValue;
    }

    function getColor(pEntityName) {
        if (gEntityCounts[pEntityName] && (undefined !== gEntityCounts[pEntityName].inoutcount)) {
            return calculateColor(gEntityCounts[pEntityName].inoutcount, gSmallest, gLargest);
        } else {
            return null;
        }
    }

    function getIOColor(pEntityName) {
        if (gEntityCounts[pEntityName]) {
            var lDiff = gEntityCounts[pEntityName].incount - gEntityCounts[pEntityName].outcount;

            if (lDiff === 0) {
                return "black";
            } else if (lDiff > 0) {
                return "blue";
            } else {
                return "red";
            }
        } else {
            return null;
        }
    }

    function greyCountEntity(pEntity) {
        var lEntity = pEntity;
        var lColor = getColor(pEntity.name);

        if (lColor !== null) {
            lEntity.linecolor = lColor;
            lEntity.textcolor = lColor;
            lEntity.arclinecolor = lColor;
            lEntity.arctextcolor = lColor;
            if (!lEntity.label) {
                lEntity.label = lEntity.name;
            }
            lEntity.label += "\\n(" + gEntityCounts[pEntity.name].inoutcount + ")";
        }

        return lEntity;
    }

    function inoutWeighEntity(pEntity) {
        var lEntity = pEntity;
        var lColor = getIOColor(pEntity.name);
        if (lColor !== null) {
            lEntity.linecolor = lColor;
            if (!lEntity.label) {
                lEntity.label = lEntity.name;
            }
            lEntity.label += "\\n( +" + gEntityCounts[pEntity.name].incount + ", -" + gEntityCounts[pEntity.name].outcount + ")";
        }
        return lEntity;
    }

    return {
        greyweigh : function(pAST) {
            var lStats = metrics.getStats(pAST);
            gEntityCounts = lStats.entityStats;
            gSmallest = lStats.minInOutCount;
            gLargest = lStats.maxInOutCount;
            return transform.transform(pAST, [greyCountEntity]);

        },
        inoutweigh : function(pAST) {
            var lStats = metrics.getStats(pAST);
            gEntityCounts = lStats.entityStats;
            return transform.transform(pAST, [inoutWeighEntity]);
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
