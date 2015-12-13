/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */
/* jshint node:true */

/* istanbul ignore else */
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

    return {
        /**
         * Wraps text on the first space found before pMaxlength,
         * or exactly pMaxLength when no space was found.
         * Classic "greedy" algorithm.
         * @param {string} pText
         * @param {int} pMaxLength
         * @return {Array of string}
         */
        wrap : function (pText, pMaxLength) {
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
        },

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
