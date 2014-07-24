/* Counts the number of incoming, outgoing arcs
 * - the program counts all arcs, except
 *   - boxes (note, box, abox, rbox)
 *   - self reference arcs
 * - the program counts incoming and outgoing arcs separately
 * - the program counts bi directional and no-directional counts
 *   as incoming _and_ outgoing
 *
 * returns an object with stats on the given AST (guaranteed)
 *  - entityCount     - the number of entities
 *  - minInOutCount   - the lowest number of arcs going in and out of  any entity
 *  - maxInOutCount   - the highest number of arcs going in and out of any entity
 *  - avgInCount      - the average number of arcs going into entities 
 *  - avgOutCount     - the average number of arcs going out of entities
 *  - avgInOutCount   - the average number of arcs going in and out of entities
 *  - totalInCount    - the total number of af arcs going into entities
 *  - totalOutCount   - the total number of af arcs going out of entities
 *  - totalInOutCount - the total number of af arcs going into and out of entities
 *  - entityStats; for each entity in the given AST:
 *      - incount    - the number of incoming arcs
 *      - outcount   - the number of outgoing arcs
 *      - inoutcount - the number of incoming + outgoing arcs
 *
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../asttransform", "../dotmap", "../flatten"], function(transform, map, flat) {
    var gEntityCounts = {};
    var gStats = {};

    function init() {
        gEntityCounts = {};
        gStats = {
            entityCount : 0, //
            minArcInCount : 0,
            minArcOutCount : 0,
            minInOutCount : 100000, //
            avgInCount : 0, //
            avgOutCount : 0, //
            avgInOutCount : 0, //
            maxArcInCount : 0,
            maxArcOutCount : 0,
            maxInOutCount : 0, //
            totalInCount : 0, //
            totalOutCount : 0, //
            totalInOutCount : 0, //
            entityStats : {}
        };
    }

    function incCount(pEntity, pCounter, pIncrement) {
        if (pEntity && (undefined !== pIncrement)) {
            if (!gEntityCounts[pEntity]) {
                gEntityCounts[pEntity] = {};
            }
            if (gEntityCounts[pEntity][pCounter]) {
                gEntityCounts[pEntity][pCounter] += pIncrement;
            } else {
                gEntityCounts[pEntity][pCounter] = pIncrement;
            }
        }

    }

    function incInCount(pEntity, pIncrement) {
        incCount(pEntity, "incount", pIncrement);
        gStats.totalInCount += pIncrement;
        gStats.totalInOutCount += pIncrement;
    }

    function incOutCount(pEntity, pIncrement) {
        incCount(pEntity, "outcount", pIncrement);
        gStats.totalOutCount += pIncrement;
        gStats.totalInOutCount += pIncrement;
    }

    function updateEntityWeight(pArc) {
        var lAggregate = map.getAggregate(pArc.kind);
        if ((pArc.from && pArc.to) && (pArc.from !== pArc.to)) {
            if ("directional" === lAggregate) {
                if ("*" === pArc.to) {
                    /* pre-compensate for broad cast distribution count: */
                    incInCount(pArc.from, -1);
                    incOutCount(pArc.from, gStats.entityCount - 1);
                    incInCount(pArc.to, 1);
                } else {
                    incOutCount(pArc.from, 1);
                    incInCount(pArc.to, 1);
                }
            } else if (("bidirectional" === lAggregate) || ("nondirectional" === lAggregate)) {
                incOutCount(pArc.from, 1);
                incOutCount(pArc.to, 1);
                incInCount(pArc.from, 1);
                incInCount(pArc.to, 1);
            }
        }
        return pArc;
    }

    function updateRange(pEntity) {
        if (gEntityCounts[pEntity.name]) {
            if (gEntityCounts[pEntity.name].inoutcount < gStats.minInOutCount) {
                gStats.minInOutCount = gEntityCounts[pEntity.name].inoutcount;
            }
            if (gEntityCounts[pEntity.name].inoutcount > gStats.maxInOutCount) {
                gStats.maxInOutCount = gEntityCounts[pEntity.name].inoutcount;
            }
        }
    }

    function distributeBroadCastCounts(pEntity) {
        incOutCount(pEntity.name, 0);
        incInCount(pEntity.name, 0);

        if (gEntityCounts["*"]) {
            incInCount(pEntity.name, gEntityCounts["*"].incount);
        }
        gEntityCounts[pEntity.name].inoutcount = gEntityCounts[pEntity.name].incount + gEntityCounts[pEntity.name].outcount;
        updateRange(pEntity);
        return pEntity;
    }

    return {
        getStats : function(pAST) {
            init();
            gStats.entityCount = pAST.entities.length;
            var lAST = transform.transform(pAST, [], [flat.swapRTLArc, updateEntityWeight]);
            lAST = transform.transform(lAST, [distributeBroadCastCounts]);
            if (gEntityCounts["*"]) {
                gStats.totalInCount -= gEntityCounts["*"].incount;
                gStats.totalInOutCount -= gEntityCounts["*"].incount;
                delete gEntityCounts["*"];
            }

            if (gStats.entityCount !== 0) {
                gStats.avgInCount = gStats.totalInCount / gStats.entityCount;
                gStats.avgOutCount = gStats.totalOutCount / gStats.entityCount;
                gStats.avgInOutCount = gStats.totalInOutCount / gStats.entityCount;
            }
            gStats.entityStats = gEntityCounts;

            return gStats;
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
