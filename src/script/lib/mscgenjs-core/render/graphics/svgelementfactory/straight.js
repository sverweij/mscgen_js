/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {
    var svgprimitives    = require("./svgprimitives");
    var variationhelpers = require("./variationhelpers");
    var _                = require("../../../lib/lodash/lodash.custom");

    function createDoubleLine(pLine, pOptions) {
        var lLineWidth = pOptions.lineWidth || 1;
        var lSpace = lLineWidth;
        var lClass = pOptions ? pOptions.class : null;

        var lDir = variationhelpers.getDirection(pLine);
        var lEndCorr = variationhelpers.determineEndCorrection(pLine, lClass, lLineWidth);
        var lStartCorr = variationhelpers.determineStartCorrection(pLine, lClass, lLineWidth);

        var lLenX = (pLine.xTo - pLine.xFrom + lEndCorr - lStartCorr).toString();
        var lLenY = (pLine.yTo - pLine.yFrom).toString();
        var lStubble = svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy);
        var lLine = svgprimitives.pathPoint2String("l", lLenX, lLenY);

        return svgprimitives.createPath(
            svgprimitives.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
            // left stubble:
            lStubble +
            svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
            // upper line:
            lLine +
            svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
            // lower line
            lLine +
            svgprimitives.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
            // right stubble
            lStubble,
            pOptions
        );
    }

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
    function createNote(pBBox, pOptions) {
        var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;

        var lFoldSizeN = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
        var lFoldSize = lFoldSizeN.toString(10);

        return svgprimitives.createPath(
            "M" + pBBox.x + "," + pBBox.y +
            // top line:
            "l" + (pBBox.width - lFoldSizeN) + ",0 " +
            // fold:
            // we lift the pen of the paper here to make sure the fold
            // gets the fill color as well when such is specified
            "l0," + lFoldSize + " l" + lFoldSize + ",0 m-" + lFoldSize + ",-" +
                    lFoldSize + " l" + lFoldSize + "," + lFoldSize + " " +
            // down:
            "l0," + (pBBox.height - lFoldSizeN) + " " +
            // bottom line:
            "l-" + pBBox.width + ",0 " +
            "l0,-" + pBBox.height + " " +
            // because we lifted the pen from the paper in the fold (see
            // the m over there) - svg interpreters consider that to be
            // the start of the path. So, although we're already 'home'
            // visually we need to do one step extra.
            // If we don't we end up with a little gap on the top left
            // corner when our stroke-linecap===butt
            "z",
            pOptions
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
        pOptions.rx = RBOX_CORNER_RADIUS;
        pOptions.ry = RBOX_CORNER_RADIUS;

        return svgprimitives.createRect(pBBox, pOptions);
    }

    /**
     * Creates an angled box of width x height, with the top left corner
     * at coordinates (x, y)
     *
     * @param {object} pBBox
     * @param {string} pClass - reference to the css class to be applied
     * @return {SVGElement}
     */
    function createABox(pBBox, pOptions) {
        var lSlopeOffset = 3;
        return svgprimitives.createPath(
            // start
            "M" + pBBox.x + "," + (pBBox.y + (pBBox.height / 2)) +
            "l" + lSlopeOffset + ", -" + pBBox.height / 2 +
            // top line
            "l" + (pBBox.width - 2 * lSlopeOffset) + ",0" +
            // right wedge
            "l" + lSlopeOffset + "," + pBBox.height / 2 +
            "l-" + lSlopeOffset + "," + pBBox.height / 2 +
            // bottom line:
            "l-" + (pBBox.width - 2 * lSlopeOffset) + ",0 " +
            "z",
            pOptions
        );
    }

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
    function createEdgeRemark(pBBox, pOptions) {
        var lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
        var lOptions = _.defaults(
            pOptions,
            {
                class: null,
                color: null,
                bgColor: null
            }
        );

        return svgprimitives.createPath(
            // start:
            "M" + pBBox.x + "," + pBBox.y +
            // top line:
            " l" + pBBox.width + ",0 " +
            // down:
            " l0," + (pBBox.height - lFoldSize) +
            // fold:
            " l-" + lFoldSize.toString(10) + "," + lFoldSize.toString(10) +
            // bottom line:
            " l-" + (pBBox.width - lFoldSize) + ",0 ",
            lOptions
        );
    }
    return {
        createSingleLine: svgprimitives.createSingleLine,
        createDoubleLine: createDoubleLine,
        createNote: createNote,
        createRect: svgprimitives.createRect,
        createABox: createABox,
        createRBox: createRBox,
        createEdgeRemark: createEdgeRemark,

        createDesc: svgprimitives.createDesc,
        createDefs: svgprimitives.createDefs,
        createDiagonalText: svgprimitives.createDiagonalText,
        createTSpan: svgprimitives.createTSpan,
        createText: svgprimitives.createText,
        createUTurn: svgprimitives.createUTurn,
        createGroup: svgprimitives.createGroup,
        createUse: svgprimitives.createUse,
        createMarkerPath: svgprimitives.createMarkerPath,
        createMarkerPolygon: svgprimitives.createMarkerPolygon,
        createTitle: svgprimitives.createTitle,
        createSVG: svgprimitives.createSVG,
        updateSVG: svgprimitives.updateSVG,
        init: svgprimitives.init
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
