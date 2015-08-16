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

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./asttransform", "./dotmap"], function(transform, map) {
    "use strict";

    var gSchemes = {
      "minimal": {
        "entityColors": [
          {}
        ],
        "arcColors": {
          "note": {
            "linecolor": "black",
            "textbgcolor": "#FFFFCC"
          },
          "---": {
            "linecolor": "grey",
            "textbgcolor": "white"
          }
        },
        "aggregateArcColors": {
          "inline_expression": {
            "linecolor": "grey"
          },
          "box": {
            "linecolor": "black",
            "textbgcolor": "white"
          }
        }
      },
      "rosy": {
        "entityColors": [
          {
            "linecolor": "maroon",
            "textbgcolor": "#FFFFCC"
          }
        ],
        "arcColors": {
          "note": {
            "linecolor": "maroon",
            "textbgcolor": "#FFFFCC"
          },
          "---": {
            "linecolor": "grey",
            "textbgcolor": "white"
          }
        },
        "aggregateArcColors": {
          "inline_expression": {
            "linecolor": "maroon",
            "textcolor": "maroon"
          },
          "box": {
            "linecolor": "maroon",
            "textbgcolor": "#FFFFCC"
          }
        }
      },
      "auto": {
        "entityColors": [
          {
            "linecolor": "#008800",
            "textbgcolor": "#CCFFCC"
          },
          {
            "linecolor": "#FF0000",
            "textbgcolor": "#FFCCCC"
          },
          {
            "linecolor": "#0000FF",
            "textbgcolor": "#CCCCFF"
          },
          {
            "linecolor": "#FF00FF",
            "textbgcolor": "#FFCCFF"
          },
          {
            "linecolor": "black",
            "textbgcolor": "#DDDDDD"
          },
          {
            "linecolor": "orange",
            "textbgcolor": "#FFFFCC"
          },
          {
            "linecolor": "#117700",
            "textbgcolor": "#00FF00"
          },
          {
            "linecolor": "purple",
            "textbgcolor": "violet"
          },
          {
            "linecolor": "grey",
            "textbgcolor": "white"
          }
        ],
        "arcColors": {
          "note": {
            "linecolor": "black",
            "textbgcolor": "#FFFFCC"
          },
          "---": {
            "linecolor": "grey",
            "textbgcolor": "white"
          }
        },
        "aggregateArcColors": {
          "inline_expression": {
            "linecolor": "grey",
            "textbgcolor": "white"
          },
          "box": {
            "linecolor": "black",
            "textbgcolor": "white"
          }
        }
      }
    };
    
    var gColorCombiCount = 0;
    var gColorScheme = {};

    function getArcColorCombis(pKind) {
        var lArcCombi = gColorScheme.arcColors[pKind];
        if (lArcCombi) {
            return lArcCombi;
        } else {
            return gColorScheme.aggregateArcColors[map.getAggregate(pKind)];
        }
    }

    function colorizeArc(pArc) {
        if (!hasColors(pArc)) {
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
        if (gColorCombiCount < gColorScheme.entityColors.length - 1) {
            gColorCombiCount += 1;
        } else {
            gColorCombiCount = 0;
        }

        return gColorScheme.entityColors[lColorCombiCount];
    }

    function hasColors(pArcOrEntity) {
        return ["linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"]
                .some(function(pColorAttr) {
            return !!pArcOrEntity[pColorAttr];
        });
    }

    function colorizeEntity(pEntity) {
        if (!hasColors(pEntity)) {
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

    function _colorize(pAST, pColorScheme, pForce) {
        gColorScheme = pColorScheme;
        gColorCombiCount = 0;

        return transform.transform(pForce ? _uncolor(pAST) : pAST, [colorizeEntity], [colorizeArc]);
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
        applyScheme: function(pAST, pColorSchemeName, pForced){
            return _colorize(pAST, gSchemes[pColorSchemeName] ? gSchemes[pColorSchemeName] : gSchemes.auto, pForced);
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
