/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";


    function rad2deg(pDegrees){
        return (pDegrees * 360) / (2 * Math.PI);
    }

    function _getDiagonalAngle(pBBox) {
        return 0 - rad2deg(Math.atan(pBBox.height / pBBox.width));
    }

    function _getDirection(pLine){
        var ldx = -1;
        if (pLine.xTo > pLine.xFrom){
            ldx = 1;
        }
        return {
            dx: ldx,
            dy: ldx * (pLine.yTo - pLine.yFrom) / (pLine.xTo - pLine.xFrom)
        };
    }

    return {
        /**
         * returns the angle (in degrees) of the line from the
         * bottom left to the top right of the bounding box.
         *
         * @param {object} pBBox - the bounding box (only width and height used)
         * @returns {number} - the angle in degrees
         */
        getDiagonalAngle : _getDiagonalAngle,

        /**
         * returns the angle (in radials) of the line
         *
         * @param {object} pLine - (xFrom,yFrom, xTo, YTo quadruple)
         * @return {number} the angle (in radials) of the line
         */
        getDirection : _getDirection
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
