/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    /**
     * Functions to help determine the correct height and
     * y position of rows befor rendering them.
     */
    var gRowInfo = [];
    var gDefaultEntityHeight = 0;
    var gDefaultArcRowHeight = 0;

    /**
     * clearRowInfo() - resets the helper array to an empty one
     */
    function clear(pEntityHeight, pArcRowHeight) {
        gRowInfo = [];
        gDefaultEntityHeight = pEntityHeight;
        gDefaultArcRowHeight = pArcRowHeight;
    }

    /**
     * getRowInfo() - returns the row info for a given pRowNumber.
     * If the row info was not set earlier with a setRowinfo call
     * the function returns a best guess, based on defaults
     *
     * @param <int> pRowNumber
     */
    function get(pRowNumber) {
        if (gRowInfo[pRowNumber]) {
            return gRowInfo[pRowNumber];
        } else {
            return {
                y : (gDefaultEntityHeight + (1.5 * gDefaultArcRowHeight)) + pRowNumber * gDefaultArcRowHeight,
                height : gDefaultArcRowHeight
            };
        }
    }

    function getLast(){
        return get(gRowInfo.length - 1);
    }

    /**
     * setRowInfo() - stores the pHeight and y position pY for the given pRowNumber
     * - If the caller does not provide pHeight, the function sets the height to
     * the current default arc row height
     * - If the caller does not provide pY, the function calculates from the row height
     * and the y position (and height) of the previous row
     *
     * @param <int> pRowNumber
     * @param <int> pHeight
     * @param <int> pY
     */
    function set(pRowNumber, pHeight, pY) {
        if (typeof pHeight === 'undefined' || pHeight < gDefaultArcRowHeight) {
            pHeight = gDefaultArcRowHeight;
        }
        if (typeof pY === 'undefined') {
            var lPreviousRowInfo = get(pRowNumber - 1);
            if (lPreviousRowInfo && lPreviousRowInfo.y > 0) {
                pY = lPreviousRowInfo.y + (lPreviousRowInfo.height + pHeight) / 2;
            }
        }
        gRowInfo[pRowNumber] = {
            y : pY,
            height : pHeight
        };
    }

    /* ---------------end row memory ---------------------- */
    return {
        clear: clear,
        get: get,
        getLast: getLast,
        set: set
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
