/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */
/* jshint node:true */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    
    /*
     * Wraps text on the first space found before pMaxlength, 
     * or exactly pMaxLength when no space wos found. 
     * Classic "greedy" algorithm.
     */
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

    /*
     * Determine the number of that fits within pWidth amount
     * of pixels. 
     * 
     * Uses heuristics that work for 9pt Helvetica in svg's. 
     * TODO: make more generic, or use an algorithm that 
     *       uses the real width of the text under discourse
     *       (e.g. using it's BBox; although I fear this 
     *        might be expensive)
     */
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

    /*
     * takes pString and replaces all escaped double quotes with
     * regular double quotes
     */
    function _unescapeString(pString) {
        var lLabel = pString.replace(/\\\"/g, '"');
        return lLabel;
        //.replace(/\\n/g, " ");
    }

    return {
        wrap : function(pText, pMaxLength) {
            return _wrap(pText, pMaxLength);
        },
        determineMaxTextWidth : function(pWidth) {
            return _determineMaxTextWidth(pWidth);
        },
        unescapeString : function(pString) {
            return _unescapeString(pString);
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
