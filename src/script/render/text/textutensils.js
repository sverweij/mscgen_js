/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */
/* jshint node:true */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([],
/**
 * A hodge podge of functions manipulating text
 *
 * @exports node/textutensils
 * @author {@link https://github.com/sverweij | Sander Verweij}
 */
function() {
    "use strict";

    function _wrap(pText, pMaxLength) {
        var lCharCount = 0;
        var lRetval = [];
        var lStart = 0;
        var lNewStart = 0;
        var lEnd = 0;

        var i = 0;
        var lText = pText.replace(/[\t\n]+/g, " ").replace(/\\n/g, "\n");

        while (i <= lText.length) {
            if (i >= (lText.length)) {
                lRetval.push(lText.substring(lStart, i));
            } else if (lText[i] === '\n') {
                lCharCount = 0;
                lEnd = i;
                lRetval.push(lText.substring(lStart, lEnd));
                lStart = lEnd + 1;
            } else if ((lCharCount++ >= pMaxLength)) {
                lEnd = lText.substring(0, i).lastIndexOf(' ');
                if (lEnd === -1 || lEnd < lStart) {
                    lCharCount = 1;
                    lEnd = i;
                    lNewStart = i;
                } else {
                    lCharCount = 0;
                    lNewStart = lEnd + 1;
                }
                lRetval.push(lText.substring(lStart, lEnd));
                lStart = lNewStart;
            }
            i++;
        }
        return lRetval;
    }

    function _determineMaxTextWidth(pWidth) {
        var lAbsWidth = Math.abs(pWidth);
        var lMagicFactor = lAbsWidth / 8;

        if (lAbsWidth > 160 && lAbsWidth <= 320) {
            lMagicFactor = lAbsWidth / 6.4;
        } else if (lAbsWidth > 320 && lAbsWidth <= 480) {
            lMagicFactor = lAbsWidth / 5.9;
        } else if (lAbsWidth > 480) {
            lMagicFactor = lAbsWidth / 5.6;
        }
        return lMagicFactor;
    }

    function _classifyExtension(pString) {
        var lExtMap = {
            "msgenny" : "msgenny",
            "mscgen" : "mscgen",
            "msc" : "mscgen",
            "mscin" : "mscgen",
            "xu" : "xu",
            "json" : "json",
            "ast" : "json"
        };
        var lPos = pString.lastIndexOf(".");
        if (lPos > -1) {
            var lExt = pString.slice(lPos + 1);
            if (lExtMap[lExt]) {
                return lExtMap[lExt];
            }
        }

        return "mscgen";

    }

    return {
        /**
         * Wraps text on the first space found before pMaxlength,
         * or exactly pMaxLength when no space was found.
         * Classic "greedy" algorithm.
         * @param {string} pText
         * @param {int} pMaxLength
         * @return {string}
         */
        wrap : function(pText, pMaxLength) {
            return _wrap(pText, pMaxLength);
        },

        /**
         * Determine the number characters of that fits within pWidth amount
         * of pixels.
         *
         * Uses heuristics that work for 9pt Helvetica in svg's.
         * TODO: make more generic, or use an algorithm that
         *       uses the real width of the text under discourse
         *       (e.g. using it's BBox; although I fear this
         *        might be expensive)
         * @param {string} pText
         * @param {number} pMaxLength
         * @return {array} - an array of strings
         */
        determineMaxTextWidth : _determineMaxTextWidth,

        /**
         * takes pString and replaces all escaped double quotes with
         * regular double quotes
         * @param {string} pString
         * @return {string}
         */
        unescapeString : function(pString) {
            return pString.replace(/\\\"/g, '"');
        },

        /**
         * takes pString and replaces all double quotes with
         * escaped double quotes
         * @param {string} pString
         * @return {string}
         */
        escapeString : function(pString) {
            return pString.replace(/\\\"/g, "\"").replace(/\"/g, "\\\"");
        },

        /**
         * Given a filename in pString, returns what language is probably
         * contained in that file, judging from the extension (the last dot
         * in the string to end-of-string)
         *
         * When in doubt returns "mscgen"
         *
         * @param {string} pString
         * @return  {string} - language. Possible values: "mscgen", "msgenny", "json".
         */
        classifyExtension : _classifyExtension,

        /**
         * Given a Number, emits a String with that number in, left padded so the
         * string is pMaxWidth long. If the number doesn't fit within pMaxWidth 
         * characters, just returns a String with that number in it
         *
         * @param {number} pNumber
         * @param {number} pMaxWidth
         * @return {string} - the formatted number
         */
        formatNumber : function(pNumber, pMaxWidth) {
            var lRetval = pNumber.toString();
            var lPosLeft = pMaxWidth - lRetval.length;
            for (var i = 0; i < lPosLeft; i++) {
                lRetval = " " + lRetval;
            }
            return lRetval;
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
