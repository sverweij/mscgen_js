/*
 * Generates a random ast
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    var COLOR_LIGHT = 1;
    var COLOR_DARK = 2;
    var COLOR_WHATEVER = 3;

    function _genRandomReal(pMin, pMax) {
        return pMin + Math.random() * (pMax - pMin);
    }

    function _genRandomNumber(pMin, pMax) {
        return Math.round(_genRandomReal(pMin, pMax));
    }

    function _genRandomString(pMaxLength) {
        var lLength = _genRandomNumber(1, pMaxLength);
        var lRetval = "";
        for (var i = 0; i < lLength; i++) {
            lRetval += String.fromCharCode(_genRandomNumber(97, 97 + 25));
        }
        return lRetval;
    }

    function _genRandomSentence(pMaxWords) {
        var lMaxWords = _genRandomNumber(1, pMaxWords);
        var lRetval = "";

        for (var i = 0; i < lMaxWords; i++) {
            lRetval += (_genRandomString(13) + " ");
        }
        return lRetval;
    }

    function _genRandomFromArray(pArray) {
        var lIndex = _genRandomNumber(0, pArray.length - 1);
        return pArray[lIndex];
    }

    function _genRandomBool(pTrueWeight) {
        var lRand = Math.random();
        var lTrueWeight = pTrueWeight ? pTrueWeight : 0.5;
        return lRand < lTrueWeight;
    }

    function _genRandomColor(pColorThingie) {
        var lRetval = "#";
        var lHexAll = "0123456789ABCDEF";
        var lHexDark = "0123456";
        var lHexLight = "789ABCDEF";
        var lHex = lHexAll;

        switch(pColorThingie) {
            case(COLOR_LIGHT):
                {
                    lHex = lHexLight;

                }
                break;
            case(COLOR_DARK):
                {
                    lHex = lHexDark;

                }
                break;
        }
        for (var i = 0; i < 6; i++) {
            lRetval += _genRandomFromArray(lHex);
        }
        return lRetval;
    }

    return {
        genRandomString : function(pMaxLength) {
            return _genRandomString(pMaxLength);
        },
        genRandomSentence : function(pMaxWords) {
            return _genRandomSentence(pMaxWords);
        },
        genRandomNumber : function(pMin, pMax) {
            return _genRandomNumber(pMin, pMax);
        },
        genRandomReal : function(pMin, pMax) {
            return _genRandomReal(pMin, pMax);
        },
        genRandomFromArray : function(pArray) {
            return _genRandomFromArray(pArray);
        },
        genRandomBool : function(pTrueWeight) {
            return _genRandomBool(pTrueWeight);
        },
        genRandomColor : function(pColorThingie) {
            return _genRandomColor(pColorThingie);
        },
        COLORTHINGIES : {
            light : COLOR_LIGHT,
            dark : COLOR_DARK,
            whatever : COLOR_WHATEVER
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
