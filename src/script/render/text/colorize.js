/* Automatically adds colors to an AST:
 *    - any entity without a color(linecolor, textcolor,
 *      textbgcolor or their arc* variants) get assigned a
 *      - linecolor
 *      - textbgcolor
 *      - arclinecolor
 *    - colors picked rom from an array (possibly random w no repeat?)
 *    - notes without any color get a
 *      - black linecolor
 *      - light yellow textbgcolor
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./asttransform", "./dotmap"], function(transform, map) {
    "use strict";

    var gColorCombiCount = 0;
    var gHardOverride = false;

    var gAggregateColorCombis = {
        "inline_expression" : {
            "linecolor" : "grey",
            "textbgcolor" : "white"
        },
        "box" : {
            "linecolor" : "black",
            "textbgcolor" : "white"
        }
    };
    var gArcColorCombis = {
        "note" : {
            "linecolor" : "black",
            "textbgcolor" : "#FFFFCC"
        },
        "---" : {
            "linecolor" : "grey",
            "textbgcolor" : "white"
        }
    };

    var gEntityColorArray = [{
        "linecolor" : "#008800",
        "textbgcolor" : "#CCFFCC"
    }, {
        "linecolor" : "#FF0000",
        "textbgcolor" : "#FFCCCC"
    }, {
        "linecolor" : "#0000FF",
        "textbgcolor" : "#CCCCFF"
    }, {
        "linecolor" : "#FF00FF",
        "textbgcolor" : "#FFCCFF"
    }, {
        "linecolor" : "black",
        "textbgcolor" : "#DDDDDD"
    }, {
        "linecolor" : "orange",
        "textbgcolor" : "#FFFFCC"
    }, {
        "linecolor" : "#117700",
        "textbgcolor" : "#00FF00"
    }, {
        "linecolor" : "purple",
        "textbgcolor" : "violet"
    }, {
        "linecolor" : "grey",
        "textbgcolor" : "white"
    }];

    function getArcColorCombis(pKind) {
        var lArcCombi = gArcColorCombis[pKind];
        if (lArcCombi) {
            return lArcCombi;
        } else {
            return gAggregateColorCombis[map.getAggregate(pKind)];
        }
    }

    function colorizeArc(pArc) {
        if (!hasColors(pArc) || gHardOverride) {
            var lColorCombi = getArcColorCombis(pArc.kind);
            if (lColorCombi) {
                pArc.linecolor = lColorCombi.linecolor;
                if (lColorCombi.textcolor) {
                    pArc.textcolor = lColorCombi.textcolor;
                }
                pArc.textbgcolor = lColorCombi.textbgcolor;
            }
        }
        return pArc;
    }

    function getNextColorCombi() {
        var lColorCombiCount = gColorCombiCount;
        if (gColorCombiCount < gEntityColorArray.length - 1) {
            gColorCombiCount += 1;
        } else {
            gColorCombiCount = 0;
        }

        return gEntityColorArray[lColorCombiCount];
    }

    function hasColors(pArcOrEntity) {
        var lColorAttrAry = ["linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"];
        return lColorAttrAry.some(function(pColorAttr) {
            return pArcOrEntity[pColorAttr] !== undefined;
        });
    }

    function colorizeEntity(pEntity) {
        if (!hasColors(pEntity) || gHardOverride) {
            var lNextColorCombi = getNextColorCombi();
            pEntity.linecolor = lNextColorCombi.linecolor;
            pEntity.textbgcolor = lNextColorCombi.textbgcolor;
            if (lNextColorCombi.textcolor) {
                pEntity.textcolor = lNextColorCombi.textcolor;
                pEntity.arctextcolor = lNextColorCombi.textcolor;
            }
            pEntity.arclinecolor = lNextColorCombi.linecolor;
        }
        return pEntity;
    }

    function _colorize(pAST, pHardOverride, pEntityColorArray, pArcColorCombis) {
        if (pEntityColorArray) {
            gEntityColorArray = pEntityColorArray;
        }
        if (pArcColorCombis) {
            gArcColorCombis = pArcColorCombis;
        }
        gColorCombiCount = 0;
        if (pHardOverride) {
            gHardOverride = true;
        } else {
            gHardOverride = false;
        }

        return transform.transform(pAST, [colorizeEntity], [colorizeArc]);
    }

    function uncolorThing(pThing) {
        delete pThing.linecolor;
        delete pThing.textcolor;
        delete pThing.textbgcolor;
        delete pThing.arclinecolor;
        delete pThing.arctextcolor;
        delete pThing.arctextbgcolor;
        return pThing;
    }

    function _uncolor(pAST) {
        return transform.transform(pAST, [uncolorThing], [uncolorThing]);
    }

    return {
        uncolor : _uncolor,
        colorize : _colorize,
        colorizeRY : function(pAST, pHardOverride) {
            var lEntityColorCombiAry = [{
                "linecolor" : "#830000",
                "textbgcolor" : "#FFFFCC"
            }];
            var lArc2ColorCombi = {
                "note" : {
                    "linecolor" : "#830000",
                    "textbgcolor" : "#FFFFCC"
                },
                "box" : {
                    "linecolor" : "#830000",
                    "textbgcolor" : "white"
                },
                "rbox" : {
                    "linecolor" : "#830000",
                    "textbgcolor" : "white"
                },
                "abox" : {
                    "linecolor" : "#830000",
                    "textbgcolor" : "white"
                },
            };
            return _colorize(pAST, pHardOverride, lEntityColorCombiAry, lArc2ColorCombi);
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
