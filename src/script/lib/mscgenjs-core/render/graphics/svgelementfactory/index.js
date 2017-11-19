/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    /**
     * Renders individual elements in sequence charts
     * @exports svgelementfactory
     * @author {@link https://github.com/sverweij | Sander Verweij}
     *
     * defines:
     *  defaults for
     *      slope offset on aboxes
     *      fold size on notes
     *      space to use between double lines
     */
    "use strict";

    var straight      = require("./straight");
    var wobbly        = require("./wobbly");
    var _             = require("../../../lib/lodash/lodash.custom");

    var gRenderMagic  = straight;
    var gOptions      = {};

    function determineRenderMagic(pRenderMagic) {
        if (!Boolean(pRenderMagic)) {
            return gRenderMagic;
        }
        /* istanbul ignore if */
        if ("wobbly" === pRenderMagic){
            return wobbly;
        }
        return straight;
    }

    return {
        /**
         * Function to set the document to use. Introduced to enable use of the
         * rendering utilities under node.js (using the jsdom module)
         *
         * @param {document} pDocument
         */
        init: function(pDocument, pOptions) {
            gRenderMagic.init(pDocument);
            gOptions = _.defaults(
                pOptions,
                {
                    LINE_WIDTH: 2,
                    FONT_SIZE: 12
                }
            );
        },

        /**
         * Creates a basic SVG with id pId, and size 0x0
         * @param {string} pId
         * @return {Element} an SVG element
         */
        createSVG: function (pId, pClass, pRenderMagic) {
            gRenderMagic = determineRenderMagic(pRenderMagic);
            return gRenderMagic.createSVG(pId, pClass);

        },

        updateSVG: gRenderMagic.updateSVG,

        createTitle: gRenderMagic.createTitle,

        /**
         * Creates a desc element with id pId
         *
         * @param {string} pID
         * @returns {Element}
         */
        createDesc: gRenderMagic.createDesc,

        /**
         * Creates an empty 'defs' element
         *
         * @returns {Element}
         */
        createDefs: gRenderMagic.createDefs,

        /**
         * creates a tspan with label pLabel, optionally wrapped in a link
         * if the url pURL is passed
         *
         * @param  {string} pLabel
         * @param  {string} pURL
         * @return {element}
         */
        createTSpan: gRenderMagic.createTSpan,

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
        createRect : function (pBBox, pClass, pColor, pBgColor) {
            return gRenderMagic.createRect(pBBox, {class: pClass, color: pColor, bgColor: pBgColor});
        },

        /**
         * Creates rect with 6px rounded corners of width x height, with the top
         * left corner at coordinates (x, y)
         *
         * @param {object} pBBox
         * @param {string} pClass - reference to the css class to be applied
         * @return {SVGElement}
         */
        createRBox: function (pBBox, pClass, pColor, pBgColor) {
            return gRenderMagic.createRBox(pBBox, {class: pClass, color: pColor, bgColor: pBgColor});
        },

        /**
         * Creates an angled box of width x height, with the top left corner
         * at coordinates (x, y)
         *
         * @param {object} pBBox
         * @param {string} pClass - reference to the css class to be applied
         * @return {SVGElement}
         */
        createABox: function (pBBox, pClass, pColor, pBgColor) {
            return gRenderMagic.createABox(pBBox, {class: pClass, color: pColor, bgColor: pBgColor});
        },

        /**
         * Creates a note of pWidth x pHeight, with the top left corner
         * at coordinates (pX, pY). pFoldSize controls the size of the
         * fold in the top right corner.
         * @param {object} pBBox
         * @param {string} pClass - reference to the css class to be applied
         * @param {number=} [pFoldSize=9]
         *
         * @return {SVGElement}
         */
        createNote: function (pBBox, pClass, pColor, pBgColor) {
            return gRenderMagic.createNote(
                pBBox,
                {
                    class: pClass,
                    color: pColor,
                    bgColor: pBgColor,
                    lineWidth: gOptions.LINE_WIDTH
                }
            );
        },

        /**
         * Creates an edge remark (for use in inline expressions) of width x height,
         * with the top left corner at coordinates (x, y). pFoldSize controls the size of the
         * fold bottom right corner.
         * @param {object} pBBox
         * @param {string} pClass - reference to the css class to be applied
         * @param {number=} [pFoldSize=7]
         *
         * @return {SVGElement}
         */
        createEdgeRemark: function (pBBox, pClass, pColor, pBgColor, pFoldSize) {
            return gRenderMagic.createEdgeRemark(
                pBBox,
                {
                    class: pClass,
                    color: pColor,
                    bgColor: pBgColor,
                    foldSize: pFoldSize,
                    lineWidth: gOptions.LINE_WIDTH
                }
            );
        },

        /**
         * Creates a text node with the appropriate tspan & a elements on
         * position pCoords.
         *
         * @param {string} pLabel
         * @param {object} pCoords
         * @param {object} pOptions - options to influence rendering
         *                          {string} pClass - reference to the css class to be applied
         *                          {string=} pURL - link to render
         *                          {string=} pID - (small) id text to render
         *                          {string=} pIDURL - link to render for the id text
         * @return {SVGElement}
         */
        createText: gRenderMagic.createText,

        /**
         * Creates a text node with the given pText fitting diagonally (bottom-left
         *  - top right) in canvas pCanvas
         *
         * @param {string} pText
         * @param {object} pCanvas (an object with at least a .width and a .height)
         */
        createDiagonalText: gRenderMagic.createDiagonalText,

        /**
         * Creates a line between to coordinates
         * @param {object} pLine - an xFrom, yFrom and xTo, yTo pair describing a line
         * @param {object} pOptions - class: reference to the css class to be applied, lineWidth: line width to use
         * @param {boolean=} [pDouble=false] - render a double line
         * @return {SVGElement}
         */
        createLine: function (pLine, pOptions) {
            if (Boolean(pOptions) && Boolean(pOptions.doubleLine)) {
                if (!pOptions.lineWidth) {
                    pOptions.lineWidth = gOptions.LINE_WIDTH;
                }
                return gRenderMagic.createDoubleLine(pLine, pOptions);
            } else {
                return gRenderMagic.createSingleLine(pLine, pOptions);
            }
        },

        /**
         * Creates a u-turn, departing on pStartX, pStarty and
         * ending on pStartX, pEndY with a width of pWidth
         *
         * @param {object} pPoint
         * @param {number} pEndY
         * @param {number} pWidth
         * @param {string} pClass - reference to the css class to be applied
         * @return {SVGElement}
         */
        createUTurn: function (pPoint, pEndY, pWidth, pClass, pDontHitHome, pHeight) {
            return gRenderMagic.createUTurn(
                pPoint,
                pEndY,
                pWidth,
                pClass,
                {
                    dontHitHome: pDontHitHome,
                    lineWidth: gOptions.LINE_WIDTH
                },
                pHeight
            );
        },

        /**
         * Creates an svg group, identifiable with id pId
         * @param {string} pId
         * @return {SVGElement}
         */
        createGroup: gRenderMagic.createGroup,

        /**
         * Create an arrow marker consisting of a path as specified in pD
         *
         * @param {string} pId
         * @param {string} pD - a string containing the path
         */
        createMarkerPath: gRenderMagic.createMarkerPath,

        /**
         * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
         *
         * @param {string} pId
         * @param {string} pPoints - a string with the points of the polygon
         * @return {SVGElement}
         */
        createMarkerPolygon: gRenderMagic.createMarkerPolygon
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
