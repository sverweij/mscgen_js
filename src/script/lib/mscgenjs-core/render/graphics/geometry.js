/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    function rad2deg(pDegrees){
        return (pDegrees * 360) / (2 * Math.PI);
    }

    function getLineLength(pLine) {
        var lA = Math.abs(pLine.xTo - pLine.xFrom);
        var lB = Math.abs(pLine.yTo - pLine.yFrom);

        return Math.sqrt((lA * lA) + (lB * lB));
    }

    function getNumberOfSegments(pLine, pInterval){
        var lLineLength = getLineLength(pLine);
        return lLineLength > 0 ? Math.floor(lLineLength / pInterval) : 0;
    }

    function getDirection(pLine){
        var lSignX = pLine.xTo > pLine.xFrom ? 1 : -1;
        return {
            signX: lSignX,
            signY: pLine.yTo > pLine.yFrom ? 1 : -1,
            dy: lSignX * (pLine.yTo - pLine.yFrom) / (pLine.xTo - pLine.xFrom)
        };
    }

    /**
     * Returns a random (real) number between -pNumber and +pNumber (inclusive)
     *
     * @param  {number} pNumber a real
     * @return {number}
     */
    function getRandomDeviation(pNumber) {
        return Math.round(Math.random() * 2 * pNumber) - pNumber;
    }

    function getBetweenPoints(pLine, pInterval, pWobble) {
        if (pInterval <= 0) {
            throw new Error("pInterval must be > 0");
        }
        pInterval = Math.min(getLineLength(pLine), pInterval);

        var lRetval     = [];
        var lNoSegments = getNumberOfSegments(pLine, pInterval);
        var lDir        = getDirection(pLine);
        var lIntervalX  = lDir.signX * Math.sqrt((Math.pow(pInterval, 2)) / (1 + Math.pow(lDir.dy, 2)));
        var lIntervalY  = lDir.signY * (Math.abs(lDir.dy) === Infinity
                            ? pInterval
                            : Math.sqrt((Math.pow(lDir.dy, 2) * Math.pow(pInterval, 2)) / (1 + Math.pow(lDir.dy, 2))));
        var lCurvePoint = {};

        for (var i = 1; i <= lNoSegments; i++) {
            lCurvePoint = {
                controlX : pLine.xFrom + (i - 0.5) * lIntervalX + getRandomDeviation(pWobble),
                controlY : pLine.yFrom + (i - 0.5) * lIntervalY + getRandomDeviation(pWobble),
                x        : pLine.xFrom + i * lIntervalX,
                y        : pLine.yFrom + i * lIntervalY
            };
            if (pInterval >
                getLineLength({
                    xFrom: lCurvePoint.x,
                    yFrom: lCurvePoint.y,
                    xTo: pLine.xTo,
                    yTo: pLine.yTo
                })
            ){
                lCurvePoint.x = pLine.xTo;
                lCurvePoint.y = pLine.yTo;
            }
            lRetval.push(lCurvePoint);
        }
        return lRetval;
    }

    return {
        /**
         * returns the angle (in degrees) of the line from the
         * bottom left to the top right of the bounding box.
         *
         * @param {object} pBBox - the bounding box (only width and height used)
         * @returns {number} - the angle in degrees
         */
        getDiagonalAngle: function (pBBox) {
            return 0 - rad2deg(Math.atan(pBBox.height / pBBox.width));
        },

        /**
         * returns the angle (in radials) of the line
         *
         * @param {object} pLine - (xFrom,yFrom, xTo, YTo quadruple)
         * @return {object} the angle of the line in an object:
         *                      signX: the x direction (1 or -1)
         *                      signY: the y direction (1 or -1)
         *                      dy: the angle (in radials)
         */
        getDirection: getDirection,

        /**
         * Calculates the length of the given line
         * @param  {object} pLine an object with xFrom, yFrom and xTo and yTo
         *                        as properties
         * @return {number}       The length
         */
        getLineLength: getLineLength,

        /**
         * Calculates the number of times a segment of pInterval length
         * can fit into pLine
         *
         * @param  {object} pLine     an object with xFrom, yFrom, and xTo and yTo
         * @param  {number} pInterval the length of the segments to fit into the
         *                            line
         * @return {number}           a natural number
         */
        getNumberOfSegments: getNumberOfSegments,

        /**
         * returns an array of curvepoints (x,y, controlX, controlY) along pLine,
         * at pInterval length intervals. The pWobble parameter influences the
         * amount controlX and controlY can at most deviate from the pLine.
         *
         *
         * @param  {object} pLine     a line (an object with xFrom, yFrom,
         *                            xTo, yTo properties)
         * @param  {number} pInterval The length of the interval between two
         *                            points on the line. Must be > 0. The
         *                            function throws an error in other cases
         * @param  {number} pWobble   The maximum amount of deviation allowed for
         *                            control points
         * @return {array}
         */
        getBetweenPoints: getBetweenPoints
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
