/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./constants", "./svglowlevelfactory", "./geometry"], function(C, factll, math) {
    /**
     * Renders individual elements in sequence charts
     * @exports svgelementfactory
     * @author {@link https://github.com/sverweij | Sander Verweij}
     * knows of:
     *  gDocument
     *
     * defines:
     *  defaults for
     *      slope offset on aboxes
     *      fold size on notes
     *      space to use between double lines
     */
    "use strict";

    var gDocument = {};

    function _createSVG(pId) {
        return factll.createElement(
            "svg",
            {
                version: "1.1",
                id: pId,
                xmlns: C.SVGNS,
                "xmlns:xlink": C.XLINKNS,
                width: 0,
                height: 0
            }
        );
    }

    function _createDesc(pId) {
        return factll.createElement(
            "desc",
            {
                "id": pId
            }
        );
    }

    function _createDefs(){
        return factll.createElement("defs");
    }

    /**
     * Creates an svg path element given the path pD, with pClass applied
     * (if provided)
     * @param {string} pD - the path
     * @param {string} pClass - reference to a css class
     * @return {SVGElement}
     */
    function _createPath(pD, pClass, pColor, pBgColor) {
        return colorBox(
            factll.createElement(
                "path",
                {
                    d: pD,
                    class: pClass
                }
            ),
            pColor,
            pBgColor
        );
    }

    function _createPolygon(pPoints, pClass) {
        return factll.createElement(
            "polygon",
            {
                points: pPoints,
                class: pClass
            }
        );
    }

    function _createRect(pBBox, pClass, pColor, pBgColor, pRX, pRY) {
        return colorBox(
            factll.createElement(
                "rect",
                {
                    width: pBBox.width,
                    height: pBBox.height,
                    x: pBBox.x,
                    y: pBBox.y,
                    rx: pRX,
                    ry: pRY,
                    class: pClass
                }
            ),
            pColor,
            pBgColor
        );
    }

    function _createGroup(pId) {
        return factll.createElement(
            "g",
            {
                id: pId
            }
        );
    }

    function _createUse(pCoords, pLink) {
        var lUse = factll.createElement(
            "use",
            {
                x: pCoords.x.toString(),
                y: pCoords.y.toString()
            }
        );
        lUse.setAttributeNS(C.XLINKNS, "xlink:href", "#" + pLink);
        return lUse;
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

    function createSingleLine(pLine, pClass) {
        return factll.createElement(
            "line",
            {
                x1: pLine.xFrom.toString(),
                y1: pLine.yFrom.toString(),
                x2: pLine.xTo.toString(),
                y2: pLine.yTo.toString(),
                class: pClass
            }
        );
    }

    function createLink (pURL, pElementToWrap){
        var lA = gDocument.createElementNS(C.SVGNS, "a");
        lA.setAttributeNS(C.XLINKNS, "xlink:href", pURL);
        lA.setAttributeNS(C.XLINKNS, "xlink:title", pURL);
        lA.setAttributeNS(C.XLINKNS, "xlink:show", "new");
        lA.appendChild(pElementToWrap);
        return lA;
    }

    /* superscript style could also be super or a number (1em) or a % (100%) */
    var lSuperscriptStyle = "vertical-align:text-top;";
    lSuperscriptStyle += "font-size:0.7em;text-anchor:start;";

    function _createABox(pBBox, pClass, pColor, pBgColor) {
        var lSlopeOffset = 3;
        return _createPath(
            "M" + pBBox.x + "," + pBBox.y +
            // start
            "l" + lSlopeOffset + ", -" + pBBox.height / 2 +
            "l" + (pBBox.width - 2 * lSlopeOffset) + ",0" +
            "l" + lSlopeOffset + "," + pBBox.height / 2 +
            "l-" + lSlopeOffset + "," + pBBox.height / 2 +
            "l-" + (pBBox.width - 2 * lSlopeOffset) + ",0 " +
            // bottom line
            "l-" + lSlopeOffset + ",-" + pBBox.height / 2,
            pClass, pColor, pBgColor
        );
    }

    function _createNote(pBBox, pClass, pColor, pBgColor) {
        var lFoldSizeN = Math.max(9, Math.min(4.5 * C.LINE_WIDTH, pBBox.height / 2));
        var lFoldSize = lFoldSizeN.toString(10);

        return _createPath(
            "M" + pBBox.x + "," + pBBox.y +
            // top line:
            "l" + (pBBox.width - lFoldSizeN) + ",0 " +
            // fold:
            "l0," + lFoldSize + " l" + lFoldSize + ",0 m-" + lFoldSize + ",-" +
                    lFoldSize + " l" + lFoldSize + "," + lFoldSize + " " +
            // down:
            "l0," + (pBBox.height - lFoldSizeN) + " " +
            // bottom line:
            "l-" + pBBox.width + ",0 " +
            // back to home:
            "l0,-" + (pBBox.height + (C.LINE_WIDTH / 2)) + " ",
            pClass, pColor, pBgColor
        );
    }

    function _createEdgeRemark(pBBox, pClass, pColor, pBgColor, pFoldSize) {
        var lFoldSize = pFoldSize ? pFoldSize : 7;
        return _createPath(
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
            pClass, pColor, pBgColor
        );
    }

    function createTSpan(pLabel, pURL){
        var lTSpanLabel = gDocument.createElementNS(C.SVGNS, "tspan");
        var lContent = gDocument.createTextNode(pLabel);
        lTSpanLabel.appendChild(lContent);
        if (pURL) {
            return createLink(pURL, lTSpanLabel);
        } else {
            return lTSpanLabel;
        }
    }

    function _createText(pLabel, pCoords, pClass, pURL, pID, pIDURL) {
        var lText = factll.createElement(
            "text",
            {
                x: pCoords.x.toString(),
                y: pCoords.y.toString(),
                class: pClass
            }
        );

        lText.appendChild(createTSpan(pLabel, pURL));

        if (pID) {
            var lTSpanID = createTSpan(" [" + pID + "]", pIDURL);
            lTSpanID.setAttribute("style", lSuperscriptStyle);
            lText.appendChild(lTSpanID);
        }
        return lText;
    }

    function _createDiagonalText (pText, pCanvas, pClass){
        return factll.setAttributes(
            _createText(pText, {x: pCanvas.width / 2, y: pCanvas.height / 2}, pClass),
            {
                "transform":
                    "rotate(" +
                         math.getDiagonalAngle(pCanvas).toString() + " " +
                        ((pCanvas.width) / 2).toString() + " " +
                        ((pCanvas.height) / 2).toString() +
                    ")"
            }
        );
    }

    function determineEndCorrection(pLine, pClass){
        var lRetval = 0;
        if (pClass.indexOf("nodi") < 0){
            lRetval = pLine.xTo > pLine.xFrom ? -7.5 * C.LINE_WIDTH : 7.5 * C.LINE_WIDTH;
        }
        return lRetval;
    }

    function determineStartCorrection(pLine, pClass){
        var lRetval = 0;
        if (pClass.indexOf("nodi") < 0){
            if (pClass.indexOf("bidi") > -1) {
                if (pLine.xTo > pLine.xFrom){
                    lRetval = 7.5 * C.LINE_WIDTH;
                } else {
                    lRetval = -7.5 * C.LINE_WIDTH;
                }
            }
        }
        return lRetval;
    }

    function createDoubleLine(pLine, pClass) {
        var lSpace = C.LINE_WIDTH;

        var lDir = math.getDirection(pLine);
        var lEndCorr = determineEndCorrection(pLine, pClass);
        var lStartCorr = determineStartCorrection(pLine, pClass);

        var lLenX = (pLine.xTo - pLine.xFrom + lEndCorr - lStartCorr).toString();
        var lLenY = (pLine.yTo - pLine.yFrom).toString();
        var lStubble = "l" + lDir.dx.toString() + "," + lDir.dy.toString();
        var lLine = " l" + lLenX + "," + lLenY;

        return _createPath(
            "M" + pLine.xFrom.toString() + "," + (pLine.yFrom - 7.5 * C.LINE_WIDTH * lDir.dy).toString() +
            // left stubble:
            lStubble +
            "M" + (pLine.xFrom + lStartCorr).toString() + "," + (pLine.yFrom - lSpace).toString() +
            // upper line:
            lLine +
            "M" + (pLine.xFrom + lStartCorr).toString() + "," + (pLine.yFrom + lSpace).toString() +
            // lower line
            lLine +
            "M" + (pLine.xTo - lDir.dx).toString() + "," + (pLine.yTo + 7.5 * C.LINE_WIDTH * lDir.dy).toString() +
            // right stubble
            lStubble,
            pClass
        );
    }

    function _createLine(pLine, pClass, pDouble) {
        if (Boolean(pDouble)) {
            return createDoubleLine(pLine, pClass);
        } else {
            return createSingleLine(pLine, pClass);
        }
    }

    function _createUTurn(pPoint, pEndY, pWidth, pClass, pDontHitHome) {
        var lEndX = pDontHitHome ? pPoint.x + 7.5 * C.LINE_WIDTH : pPoint.x;

        return _createPath(
            // point to start from:
            "M" + pPoint.x.toString() + ", -" + pPoint.y.toString() +
            // curve first to:
            " C" + (pPoint.x + pWidth).toString() + "," + (pPoint.y - 7.5 * C.LINE_WIDTH).toString() +
            // curve back from.:
            " " + (pPoint.x + pWidth).toString() + "," + (pEndY + 0).toString() +
            // curve end-pont:
            " " + lEndX.toString() + "," + pEndY.toString(),
            pClass
        );
    }

    function _createMarker(pId, pClass, pOrient, pViewBox) {
        /* so, why not start at refX=0, refY=0? It would simplify reasoning
         * about marker paths significantly...
         *
         * TL;DR: canvg doesn't seem to handle this very well.
         * - Don't know yet why.
         * - Suspicion: with (0,0) the marker paths we use would end up having
         *   negative coordinates (e.g. "M 0 0 L -8 2" for a left to right
         *   signal)
         */
        return factll.createElement(
            "marker",
            {
                orient: pOrient,
                id: pId,
                class: pClass,
                viewBox: Boolean(pViewBox) ? pViewBox : "0 0 10 10",
                refX: "9",
                refY: "3",
                markerUnits: "strokeWidth",
                markerWidth: "10",
                markerHeight: "10"
            }
        );
        /* for scaling to the lineWidth of the line the marker is attached to,
         * userSpaceOnUse looks like a good plan, but it is not only the
         * paths that don't scale, it's also the linewidth (which makes sense).
         * We'll have to roll our own path transformation algorithm if we want
         * to change only the linewidth and not the rest
         */

    }

    function _createMarkerPath(pId, pD, pColor) {
        var lMarker = _createMarker(pId, "arrow-marker", "auto");
        /* stroke-dasharray: 'none' should work to override any dashes (like in
         * return messages (a >> b;)) and making sure the marker end gets
         * lines
         * This, however, does not work in webkit, hence the curious
         * value for the stroke-dasharray
         */
        lMarker.appendChild(
            factll.setAttributes(
                _createPath(pD, "arrow-style"),
                {
                    style: "stroke-dasharray:100,1;stroke:" + pColor || "black"
                }
            )
        );
        return lMarker;
    }

    function _createMarkerPolygon(pId, pPoints, pColor) {
        var lMarker = _createMarker(pId, "arrow-marker", "auto");
        lMarker.appendChild(
            factll.setAttributes(
                _createPolygon(pPoints, "arrow-style"),
                {
                    "stroke": pColor || "black",
                    "fill": pColor || "black"
                }
            )
        );
        return lMarker;
    }

    return {
        /**
         * Function to set the document to use. Introduced to enable use of the
         * rendering utilities under node.js (using the jsdom module)
         *
         * @param {document} pDocument
         */
        init: function(pDocument) {
            gDocument = pDocument;
            factll.init(pDocument);
        },

        /**
         * Creates a basic SVG with id pId, and size 0x0
         * @param {string} pId
         * @return {Element} an SVG element
         */
        createSVG: _createSVG,

        /**
         * Creates a desc element with id pId
         *
         * @param {string} pID
         * @returns {Element}
         */
        createDesc: _createDesc,

        /**
         * Creates an empty 'defs' element
         *
         * @returns {Element}
         */
        createDefs: _createDefs,

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
        createRect : _createRect,

        /**
         * Creates an angled box of width x height, with the top left corner
         * at coordinates (x, y)
         *
         * @param {object} pBBox
         * @param {string} pClass - reference to the css class to be applied
         * @return {SVGElement}
         */
        createABox : _createABox,

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
        createNote : _createNote,

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
        createEdgeRemark : _createEdgeRemark,

        /**
         * Creates a text node with the appropriate tspan & a elements on position
         * (pX, pY).
         *
         * @param {string} pLabel
         * @param {object} pCoords
         * @param {string} pClass - reference to the css class to be applied
         * @param {string=} pURL - link to render
         * @param {string=} pID - (small) id text to render
         * @param {string=} pIDURL - link to render for the id text
         * @return {SVGElement}
         */
        createText : _createText,

        /**
         * Creates a text node with the given pText fitting diagonally (bottom-left
         *  - top right) in canvas pCanvas
         *
         * @param {string} pText
         * @param {object} pCanvas (an object with at least a .width and a .height)
         */
        createDiagonalText: _createDiagonalText,

        /**
         * Creates a line between to coordinates
         * @param {object} pLine - an xFrom, yFrom and xTo, yTo pair describing a line
         * @param {string} pClass - reference to the css class to be applied
         * @param {boolean=} [pDouble=false] - render a double line
         * @return {SVGElement}
         */
        createLine : _createLine,

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
        createUTurn : _createUTurn,

        /**
         * Creates an svg group, identifiable with id pId
         * @param {string} pId
         * @return {SVGElement}
         */
        createGroup : _createGroup,

        /**
         * Creates an svg use for the SVGElement identified by pLink at coordinates pX, pY
         * @param {object} pCoords
         * @param {number} pLink
         * @return {SVGElement}
         */
        createUse : _createUse,

        /**
         * Create an arrow marker consisting of a path as specified in pD
         *
         * @param {string} pId
         * @param {string} pD - a string containing the path
         */
        createMarkerPath : _createMarkerPath,

        /**
         * Create a (filled) arrow marker consisting of a polygon as specified in pPoints
         *
         * @param {string} pId
         * @param {string} pPoints - a string with the points of the polygon
         * @return {SVGElement}
         */
        createMarkerPolygon : _createMarkerPolygon
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
