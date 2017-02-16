/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function(require) {

    var svgprimitives    = require("./svgprimitives");
    var variationhelpers = require("./variationhelpers");

    var SEGMENT_LENGTH = 70; // 70
    var WOBBLE_FACTOR  = 3; // 1.4?

    function points2CurveString(pPoints) {
        return pPoints.map(function(pThisPoint){
            return svgprimitives.pathPoint2String("S", pThisPoint.controlX, pThisPoint.controlY) +
                    " " + svgprimitives.point2String(pThisPoint.x, pThisPoint.y);
        }).join(" ");

    }

    function createSingleLine(pLine, pOptions) {
        var lDir = variationhelpers.getDirection(pLine);

        return svgprimitives.createPath(
            svgprimitives.pathPoint2String("M", pLine.xFrom, pLine.yFrom) +
            // Workaround; gecko and webkit treat markers slapped on the
            // start of a path with 'auto' different from each other when
            // there's not a line at the start and the path is not going
            // from exactly left to right (gecko renders the marker
            // correctly, whereas webkit will ignore auto and show the
            // marker in its default position)
            //
            // Adding a little stubble at the start of the line solves
            // all that.
            svgprimitives.pathPoint2String(
                "L",
                variationhelpers.round(pLine.xFrom + lDir.signX * Math.sqrt(1 / (1 + Math.pow(lDir.dy, 2)))),
                pLine.yFrom + lDir.signY * (Math.abs(lDir.dy) === Infinity
                    ? 1
                    : variationhelpers.round(Math.sqrt((Math.pow(lDir.dy, 2)) / (1 + Math.pow(lDir.dy, 2)))))
            ) +
            points2CurveString(
                variationhelpers.getBetweenPoints(
                    pLine,
                    SEGMENT_LENGTH,
                    WOBBLE_FACTOR
                )
            ),
            {
                class: pOptions ? pOptions.class : null
            }
        );
    }

    function renderNotePathString(pBBox, pFoldSize) {
        return svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
            // top line:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - pFoldSize,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +

            // fold:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize) +

            // down:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pFoldSize,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +

            // bottom line:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +

            // home:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y) +
            "z";
    }

    function renderNoteCornerString(pBBox, pFoldSize) {
        return svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width - pFoldSize, pBBox.y) +
            // down
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - pFoldSize,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - pFoldSize, pBBox.y + pFoldSize) +
            // right
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - pFoldSize,
                    yFrom: pBBox.y + pFoldSize,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pFoldSize);
    }

    function createNote(pBBox, pOptions) {
        var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
        var lFoldSize = Math.max(9, Math.min(4.5 * lLineWidth, pBBox.height / 2));
        var lGroup = svgprimitives.createGroup();

        lGroup.appendChild(svgprimitives.createPath(renderNotePathString(pBBox, lFoldSize), pOptions));
        pOptions.bgColor = "transparent";
        lGroup.appendChild(svgprimitives.createPath(renderNoteCornerString(pBBox, lFoldSize), pOptions));
        return lGroup;
    }

    function renderRectString(pBBox) {
        if (!Boolean(pBBox.y)){
            pBBox.y = 0;
        }
        return svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y) +
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y) +
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y,
                xTo: pBBox.x + pBBox.width,
                yTo: pBBox.y + pBBox.height
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height) +
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x + pBBox.width,
                yFrom: pBBox.y + pBBox.height,
                xTo: pBBox.x,
                yTo: pBBox.y + pBBox.height
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
        points2CurveString(
            variationhelpers.getBetweenPoints({
                xFrom: pBBox.x,
                yFrom: pBBox.y + pBBox.height,
                xTo: pBBox.x,
                yTo: pBBox.y
            }, SEGMENT_LENGTH, WOBBLE_FACTOR)
        ) +
        "z";
    }

    function createRect(pBBox, pOptions) {
        return svgprimitives.createPath(
            renderRectString(pBBox, pOptions),
            pOptions
        );
    }

    function createABox(pBBox, pOptions) {
        var lSlopeOffset = 3;
        return svgprimitives.createPath(
            // start
            svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (pBBox.height / 2)) +
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y + (pBBox.height / 2),
                    xTo: pBBox.x + lSlopeOffset,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y) +
            // top line
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + lSlopeOffset,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - lSlopeOffset,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y) +
            // right wedge
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - lSlopeOffset,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pBBox.height / 2
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height / 2) +
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pBBox.height / 2,
                    xTo: pBBox.x + pBBox.width - lSlopeOffset,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - lSlopeOffset, pBBox.y + pBBox.height) +
            // bottom line:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - lSlopeOffset,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x + lSlopeOffset,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + lSlopeOffset, pBBox.y + pBBox.height) +
            // home:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + lSlopeOffset,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x,
                    yTo: pBBox.y + (pBBox.height / 2)
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            "z",
            pOptions
        );
    }

    function createRBox(pBBox, pOptions) {
        var RBOX_CORNER_RADIUS = 6; // px

        return svgprimitives.createPath(
            svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + RBOX_CORNER_RADIUS) +
            points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y,
                x: pBBox.x + RBOX_CORNER_RADIUS,
                y: pBBox.y
            }]) +

            // top
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + RBOX_CORNER_RADIUS,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
                    yTo: pBBox.y
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width - RBOX_CORNER_RADIUS, pBBox.y) +

            points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y,
                x: pBBox.x + pBBox.width,
                y: pBBox.y + RBOX_CORNER_RADIUS
            }]) +

            // right
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + RBOX_CORNER_RADIUS,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - RBOX_CORNER_RADIUS) +
            points2CurveString([{
                controlX: pBBox.x + pBBox.width,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
                y: pBBox.y + pBBox.height
            }]) +

            // bottom
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - RBOX_CORNER_RADIUS,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x + RBOX_CORNER_RADIUS,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +

            svgprimitives.pathPoint2String("L", pBBox.x + RBOX_CORNER_RADIUS, pBBox.y + pBBox.height) +
            points2CurveString([{
                controlX: pBBox.x,
                controlY: pBBox.y + pBBox.height,
                x: pBBox.x,
                y: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS
            }]) +

            // up
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x,
                    yFrom: pBBox.y + pBBox.height - RBOX_CORNER_RADIUS,
                    xTo: pBBox.x,
                    yTo: pBBox.y + RBOX_CORNER_RADIUS
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            "z",
            pOptions
        );
    }

    function createEdgeRemark (pBBox, pOptions) {
        var lLineWidth = pOptions ? pOptions.lineWidth || 1 : 1;
        var lGroup = svgprimitives.createGroup();

        var lFoldSize = pOptions && pOptions.foldSize ? pOptions.foldSize : 7;
        var lLineColor = pOptions && pOptions.color ? pOptions.color : "black";

        pOptions.color = "transparent!important"; /* :blush: */
        var lBackground = svgprimitives.createPath(
            // start:
            svgprimitives.pathPoint2String("M", pBBox.x, pBBox.y + (lLineWidth / 2)) +
            // top line:
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + (lLineWidth / 2)) +
            // down:
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
            // fold:
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width  - lFoldSize, pBBox.y + pBBox.height) +
            // bottom line:
            svgprimitives.pathPoint2String("L", pBBox.x, pBBox.y + pBBox.height) +
            "z",
            pOptions
        );

        pOptions.bgColor = "transparent";
        pOptions.color = lLineColor;
        var lLine = svgprimitives.createPath(
            // start:
            svgprimitives.pathPoint2String("M", pBBox.x + pBBox.width, pBBox.y) +
            // down:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y,
                    xTo: pBBox.x + pBBox.width,
                    yTo: pBBox.y + pBBox.height - lFoldSize
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width, pBBox.y + pBBox.height - lFoldSize) +
            // fold:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width,
                    yFrom: pBBox.y + pBBox.height - lFoldSize,
                    xTo: pBBox.x + pBBox.width - lFoldSize,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x + pBBox.width  - lFoldSize, pBBox.y + pBBox.height) +
            // bottom line:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pBBox.x + pBBox.width - lFoldSize,
                    yFrom: pBBox.y + pBBox.height,
                    xTo: pBBox.x - 1,
                    yTo: pBBox.y + pBBox.height
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("L", pBBox.x - 1, pBBox.y + pBBox.height),
            pOptions
        );
        lGroup.appendChild(lBackground);
        lGroup.appendChild(lLine);
        return lGroup;
    }

    function createDoubleLine(pLine, pOptions) {
        var lLineWidth = pOptions.lineWidth || 1;
        var lSpace = lLineWidth;
        var lClass = pOptions ? pOptions.class : null;

        var lDir = variationhelpers.getDirection(pLine);
        var lEndCorr = variationhelpers.determineEndCorrection(pLine, lClass, lLineWidth);
        var lStartCorr = variationhelpers.determineStartCorrection(pLine, lClass, lLineWidth);

        return svgprimitives.createPath(
            svgprimitives.pathPoint2String("M", pLine.xFrom, (pLine.yFrom - 7.5 * lLineWidth * lDir.dy)) +
            // left stubble:
            svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy) +
            svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom - lSpace) +
            // upper line:
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pLine.xFrom + lStartCorr,
                    yFrom: pLine.yFrom - lSpace,
                    xTo: pLine.xTo + lEndCorr,
                    yTo: pLine.yTo - lSpace
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("M", pLine.xFrom + lStartCorr, pLine.yFrom + lSpace) +
            // lower line
            points2CurveString(
                variationhelpers.getBetweenPoints({
                    xFrom: pLine.xFrom + lStartCorr,
                    yFrom: pLine.yFrom + lSpace,
                    xTo: pLine.xTo + lEndCorr,
                    yTo: pLine.yTo + lSpace
                }, SEGMENT_LENGTH, WOBBLE_FACTOR)
            ) +
            svgprimitives.pathPoint2String("M", pLine.xTo - lDir.signX, pLine.yTo + 7.5 * lLineWidth * lDir.dy) +
            // right stubble
            svgprimitives.pathPoint2String("l", lDir.signX, lDir.dy),
            lClass
        );
    }

    return {
        createSingleLine: createSingleLine,
        createDoubleLine: createDoubleLine,
        createNote: createNote,
        createRect: createRect,
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
