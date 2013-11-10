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

define(["./transformast"], function(transform) {
    var gColorCombiCount = 0;

    function colorizeArc(pEntities, pArc) {
        var lArc = pArc;
        var lArc2ColorCombi = {
            "note" : {
                "linecolor" : "black",
                "textbgcolor" : "#FFFFCC"
            },
            "box" : {
                "linecolor" : "black",
                "textbgcolor" : "white"
            },
            "rbox" : {
                "linecolor" : "black",
                "textbgcolor" : "white"
            },
            "abox" : {
                "linecolor" : "black",
                "textbgcolor" : "white"
            },

        };
        if (!hasColors(lArc)) {
            var lColorCombi = lArc2ColorCombi[pArc.kind];
            if (lColorCombi) {
                lArc.linecolor = lColorCombi.linecolor;
                lArc.textcolor = lColorCombi.linecolor;
                lArc.textbgcolor = lColorCombi.textbgcolor;
            }
        }
        return lArc;
    }

    function getNextColorCombi() {
        var lColorCombiAry = [{
            "linecolor" : "black",
            "textbgcolor" : "lightgrey"
        }, {
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
        var lColorCombiCount = gColorCombiCount;
        if (gColorCombiCount < lColorCombiAry.length - 1) {
            gColorCombiCount += 1;
        } else {
            gColorCombiCount = 0;
        }

        return lColorCombiAry[lColorCombiCount];
    }

    function hasColors(pArcOrEntity) {
        var lColorAttrAry = ["linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"];
        for (var i = 0; i < lColorAttrAry.length; i++) {
            if (pArcOrEntity[lColorAttrAry[i]] !== undefined) {
                return true;
            }
        }
        return false;
    }

    function colorizeEntity(pEntity) {
        var lEntity = pEntity;
        if (!hasColors(pEntity)) {
            var lNextColorCombi = getNextColorCombi();
            lEntity.linecolor = lNextColorCombi.linecolor;
            lEntity.textbgcolor = lNextColorCombi.textbgcolor;
            lEntity.arctextcolor = lNextColorCombi.linecolor;
            lEntity.arclinecolor = lNextColorCombi.linecolor;
        }
        return lEntity;
    }

    return {
        colorize : function(pAST) {
            gColorCombiCount = 0;

            return transform.transform(pAST, [colorizeEntity], [colorizeArc]);
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
