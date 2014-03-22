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

    var CONF = {
        maxEntities : 13,
        maxEntityNameLetters : 10,
        maxEntityLabelWords : 3,
        entityColorRatio : 0.3,
        arcToBoxRatio : 0.9,
        arcToNonEntityArcRatio : 0.8,
        multipleArcsPerRowRatio : 0.2,
        maxArcRows : 42,
        maxArcsPerRow : 4,
        maxArcWords : 7,
        maxBoxWords : 42,
        maxEntityLessArcWords : 11,
        optionRatio : 0.3,
        options : {
            hscaleMin : 0.2,
            hscaleMax : 1.8,
            widthMin : 400,
            widthMax : 1481,
            arcgradientMin : 1,
            arcgradientMax : 32,
            worwraparcsTrueRatio : 0.9,
            watermarkMax : 4
        }
    };

    function _run() {
        var lAST = {};
        var lOptions = {
            empty : true
        };

        if (utl.genRandomBool(CONF.optionRatio)) {
            lOptions = genRandomOptions();
            if (!lOptions.empty) {
                lAST.options = lOptions;
            }
        }
        lAST.entities = genRandomEntities();
        lAST.arcs = genRandomArcRows(lAST.entities);
        return lAST;
    }

    function genRandomOptions() {
        var lRetval = {
            empty : true
        };

        if (utl.genRandomBool()) {
            lRetval.hscale = utl.genRandomReal(CONF.options.hscaleMin, CONF.options.hscaleMax).toString();
            delete lRetval.empty;
        }
        if (utl.genRandomBool()) {
            lRetval.width = utl.genRandomNumber(CONF.options.widthMin, CONF.options.widthMax).toString();
            delete lRetval.empty;
        }
        if (utl.genRandomBool()) {
            lRetval.arcgradient = utl.genRandomNumber(CONF.options.arcgradientMin, CONF.options.arcgradientMax).toString();
            delete lRetval.empty;
        }
        if (utl.genRandomBool()) {
            lRetval.wordwraparcs = utl.genRandomBool(CONF.options.worwraparcsTrueRatio).toString();
            delete lRetval.empty;
        }
        if (utl.genRandomBool()) {
            lRetval.watermark = utl.genRandomSentence(CONF.options.watermarkMax);
            delete lRetval.empty;
        }
        return lRetval;
    }

    function genRandomEntities() {
        var lRetval = [];
        var lEntity = {};

        var lNoEntities = utl.genRandomNumber(1, CONF.maxEntities);

        for (var i = 0; i < lNoEntities; i++) {
            lEntity = {};
            lEntity.name = utl.genRandomString(CONF.maxEntityNameLetters);
            lEntity.label = utl.genRandomSentence(CONF.maxEntityLabelWords);
            if (utl.genRandomBool(CONF.entityColorRatio)) {
                lEntity.linecolor = utl.genRandomColor(utl.COLORTHINGIES.dark);
                lEntity.textbgcolor = utl.genRandomColor(utl.COLORTHINGIES.light);
                lEntity.textcolor = utl.genRandomColor(utl.COLORTHINGIES.dark);
                if (utl.genRandomBool(1 - CONF.entityColorRatio)) {
                    lEntity.arclinecolor = lEntity.linecolor;
                    lEntity.arctextbgcolor = lEntity.textbgcolor;
                    lEntity.arctextcolor = lEntity.textcolor;
                }
            }

            lRetval.push(lEntity);
        }
        return lRetval;
    }

    function genRandomArc(pEntities) {
        var lArcKinds = ["->", "=>", "=>>", ">>", ":>", "<-", "<=", "<<=", "<<", "<:", "<->", "<=>", "<<=>>", "<<>>", "<:>", "--", "==", "..", "::"];
        var lArcBoxKinds = ["note", "box", "abox", "rbox"];
        var lArc = {};

        if (utl.genRandomBool(CONF.arcToBoxRatio)) {
            lArc.kind = utl.genRandomFromArray(lArcKinds);
            lArc.label = utl.genRandomSentence(CONF.maxArcWords);
        } else {
            lArc.kind = utl.genRandomFromArray(lArcBoxKinds);
            lArc.label = utl.genRandomSentence(CONF.maxBoxWords);
            lArc.linecolor = utl.genRandomColor(utl.COLORTHINGIES.whatever);
            lArc.textbgcolor = utl.genRandomColor(utl.COLORTHINGIES.whatever);
        }
        lArc.from = pEntities[utl.genRandomNumber(0, pEntities.length - 1)].name;
        lArc.to = pEntities[utl.genRandomNumber(0, pEntities.length - 1)].name;

        return lArc;
    }

    function genRandomArcRow(pEntities) {
        var lArcRow = [];
        var lArc = {};
        var lNoArcsPerRow = utl.genRandomBool(CONF.multipleArcsPerRowRatio) ? utl.genRandomNumber(2, CONF.maxArcsPerRow) : 1;
        var lEntityLessArcKinds = ["|||", "...", "---"];

        if (utl.genRandomBool(CONF.arcToNonEntityArcRatio)) {// ~ 80% regular, 20% non entity arcs
            for (var j = 0; j < lNoArcsPerRow; j++) {
                lArcRow.push(genRandomArc(pEntities));
            }
        } else {
            lArc.kind = utl.genRandomFromArray(lEntityLessArcKinds);
            lArc.label = utl.genRandomSentence(CONF.maxEntityLessArcWords);
            lArcRow.push(lArc);
        }
        return lArcRow;
    }

    function genRandomArcRows(pEntities) {
        var lRetval = [];
        var lNoArcs = utl.genRandomNumber(1, CONF.maxArcRows);

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
