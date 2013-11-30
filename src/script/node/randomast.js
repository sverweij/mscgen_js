/*
 * Generates a random ast
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./randomutensils"], function(utl) {

    function _run() {
        var lAST = {};
        if (utl.genRandomBool(0.2)) {
            lAST.options = genRandomOptions();
        }
        lAST.entities = genRandomEntities();
        lAST.arcs = genRandomArcRows(lAST.entities);
        return lAST;
    }

    function genRandomOptions() {
        var lRetval = {};

        if (utl.genRandomBool()) {
            lRetval.hscale = utl.genRandomReal(0.2, 2.0).toString();
        }
        if (utl.genRandomBool()) {
            lRetval.width = utl.genRandomNumber(400, 1481).toString();
        }
        if (utl.genRandomBool()) {
            lRetval.arcgradient = utl.genRandomNumber(0, 24).toString();
        }
        if (utl.genRandomBool()) {
            lRetval.wordwraparcs = utl.genRandomBool().toString();
        }
        return lRetval;
    }

    function genRandomEntities() {
        var lRetval = [];
        var lEntity = {};

        var lNoEntities = utl.genRandomNumber(1, 13);

        for (var i = 0; i < lNoEntities; i++) {
            lEntity = {};
            lEntity.name = utl.genRandomString(10);
            lEntity.label = utl.genRandomSentence(3);
            lRetval.push(lEntity);
        }
        return lRetval;
    }

    function genRandomArc(pEntities) {
        var lArcKinds = ["->", "=>", "=>>", ">>", ":>", "<-", "<=", "<<=", "<<", "<:", "<->", "<=>", "<<=>>", "<<>>", "<:>", "--", "==", "..", "::"];
        var lArcBoxKinds = ["note", "box", "abox", "rbox"];
        var lArc = {};

        if (utl.genRandomBool(0.9)) {// ~90% arrowish, 10% boxes
            lArc.kind = utl.genRandomFromArray(lArcKinds);
            lArc.label = utl.genRandomSentence(7);
        } else {
            lArc.kind = utl.genRandomFromArray(lArcBoxKinds);
            lArc.label = utl.genRandomSentence(42);
        }
        lArc.from = pEntities[utl.genRandomNumber(0, pEntities.length - 1)].name;
        lArc.to = pEntities[utl.genRandomNumber(0, pEntities.length - 1)].name;

        return lArc;
    }

    function genRandomArcRow(pEntities) {
        var lArcRow = [];
        var lArc = {};
        var lNoArcsPerRow = utl.genRandomBool(0.2) ? utl.genRandomNumber(2, 4) : 1;
        var lEntityLessArcKinds = ["|||", "...", "---"];

        if (utl.genRandomBool(0.8)) {// ~ 80% regular, 20% non entity arcs
            for (var j = 0; j < lNoArcsPerRow; j++) {
                lArcRow.push(genRandomArc(pEntities));
            }
        } else {
            lArc.kind = utl.genRandomFromArray(lEntityLessArcKinds);
            lArc.label = utl.genRandomSentence(11);
            lArcRow.push(lArc);
        }
        return lArcRow;
    }

    function genRandomArcRows(pEntities) {
        var lRetval = [];
        var lNoArcs = utl.genRandomNumber(1, 42);

        for (var i = 0; i < lNoArcs; i++) {
            lRetval.push(genRandomArcRow(pEntities));
        }
        return lRetval;
    }

    return {
        run : function() {
            return _run();
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
