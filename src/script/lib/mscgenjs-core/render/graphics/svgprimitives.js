/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    "./svglowlevelfactory",
    "../../lib/lodash/lodash.custom"], function(factll, _) {

    function point2String(pX, pY) {
        return pX.toString() + "," + pY.toString() + " ";
    }

    function pathPoint2String(pType, pX, pY) {
        return pType + point2String(pX, pY);
    }

    /**
     * Creates an svg path element given the path pD, with pClass applied
     * (if provided)
     * @param {string} pD - the path
     * @param {string} pClass - reference to a css class
     * @return {SVGElement}
     */
    function createPath(pD, pOptions) {
        var lOptions = _.defaults(
            pOptions,
            {
                class: null,
                color: null,
                bgColor: null
            }
        );
        return colorBox(
            factll.createElement(
                "path",
                {
                    d: pD,
                    class: lOptions.class
                }
            ),
            lOptions.color,
            lOptions.bgColor
        );
    }

    function createPolygon(pPoints, pClass) {
        return factll.createElement(
            "polygon",
            {
                points: pPoints,
                class: pClass
            }
        );
    }


    function colorBox(pElement, pColor, pBgColor){
        var lStyleString = "";
        if (pBgColor) {
            lStyleString += "fill:" + pBgColor + ";";
        }
        if (pColor) {
            lStyleString += "stroke:" + pColor + ";";
        }
        return factll.setAttribute(pElement, "style", lStyleString);
    }

    function createSingleLine(pLine, pOptions) {
        return factll.createElement(
            "line",
            {
                x1: pLine.xFrom.toString(),
                y1: pLine.yFrom.toString(),
                x2: pLine.xTo.toString(),
                y2: pLine.yTo.toString(),
                class: pOptions ? pOptions.class : null
            }
        );
    }

    /**
     * Creates an svg rectangle of width x height, with the top left
     * corner at coordinates (x, y). pRX and pRY define the amount of
     * rounding the corners of the rectangle get; when they're left out
     * the function will render the corners as straight.
     *
     * Unit: pixels
     *
     * @param {object} pBBox
     * @param {string} pClass - reference to the css class to be applied
     * @param {number=} pRX
     * @param {number=} pRY
     * @return {SVGElement}
     */
    function createRect (pBBox, pOptions) {
        var lOptions = _.defaults(
            pOptions,
            {
                class: null,
                color: null,
                bgColor: null
            }
        );
        return colorBox(
            factll.createElement(
                "rect",
                {
                    width: pBBox.width,
                    height: pBBox.height,
                    x: pBBox.x,
                    y: pBBox.y,
                    class: lOptions.class
                }
            ),
            lOptions.color,
            lOptions.bgColor
        );
    }
    /**
     * Creates rect with 6px rounded corners of width x height, with the top
     * left corner at coordinates (x, y)
     *
     * @param {object} pBBox
     * @param {string} pClass - reference to the css class to be applied
     * @return {SVGElement}
     */
    function createRBox (pBBox, pOptions) {
        var RBOX_CORNER_RADIUS = 6; // px
        var lOptions = _.defaults(
            pOptions,
            {
                class: null,
                color: null,
                bgColor: null
            }
        );

        return colorBox(
            factll.createElement(
                "rect",
                {
                    width: pBBox.width,
                    height: pBBox.height,
                    x: pBBox.x,
                    y: pBBox.y,
                    rx: RBOX_CORNER_RADIUS,
                    ry: RBOX_CORNER_RADIUS,
                    class: lOptions.class
                }
            ),
            lOptions.color,
            lOptions.bgColor
        );
    }

    return {
        createPath       : createPath,
        createPolygon    : createPolygon,
        createSingleLine : createSingleLine,
        createRect       : createRect,
        createRBox       : createRBox,
        point2String     : point2String,
        pathPoint2String : pathPoint2String
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
