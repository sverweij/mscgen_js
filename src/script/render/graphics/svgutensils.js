/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./constants"], function(C) {
    /**
     * Renders individual elements in sequence charts
     * @exports renderutensils
     * @author {@link https://github.com/sverweij | Sander Verweij}
     * knows of:
     *  gDocument
     *  linewidth (implicit
     *
     * defines:
     *  defaults for
     *      slope offset on aboxes
     *      fold size on notes
     *      space to use between double lines
     */
    "use strict";

    var gDocument;

    /* superscript style could also be super or a number (1em) or a % (100%) */
    var lSuperscriptStyle = "vertical-align : text-top;";
    lSuperscriptStyle += "font-size: 0.7em; text-anchor: start;";

    // TODO: this is a query type of thing
    //       responsibility-wise a strange one in this module
    //       (which is responsible for creating svg elements)
    function _getBBox(pElement) {

        var INSANELYBIG = 100000;
        var lRetval = {
            height : 15,
            width : 15,
            x : 2,
            y : 2
        };

        if ( typeof (pElement.getBBox) === 'function') {
            var lSvg = gDocument.createElementNS(C.SVGNS, "svg");
            lSvg.setAttribute("version", "1.1");
            lSvg.setAttribute("xmlns", C.SVGNS);
            lSvg.setAttribute("xmlns:xlink", C.XLINKNS);

            gDocument.body.appendChild(lSvg);
            lSvg.appendChild(pElement);
            lRetval = pElement.getBBox();
            lSvg.removeChild(pElement);
            gDocument.body.removeChild(lSvg);

            /*
             * workaround for Opera browser quirk: if the dimensions
             * of an element are 0x0, Opera's getBBox() implementation
             * returns -Infinity (which is a kind of impractical value
             * to actually render, even for Opera)
             * To counter this, manually set the return value to 0x0
             * if height or width has a wacky value:
             */
            if (Math.abs(lRetval.height) > INSANELYBIG || lRetval.width > INSANELYBIG || lRetval.height < 0 - INSANELYBIG || lRetval.width < 0 - INSANELYBIG) {
                lRetval = {
                    height : 0,
                    width : 0,
                    x : 0,
                    y : 0
                };
            }
            /* end workaround */
        }

        return lRetval;
    }

    /**
     * Creates an svg path element given the path pD, with pClass applied
     * (if provided)
     * @param {string} pD - the path
     * @param {string} pClass - reference to a css class
     * @return {SVGElement}
     */
    function _createPath(pD, pClass) {
        var lPath = gDocument.createElementNS(C.SVGNS, "path");
        lPath.setAttribute("d", pD);
        if (pClass) {
            lPath.setAttribute("class", pClass);
        }
        return lPath;
    }

    function _createPolygon(pPoints, pClass) {
        var lPath = gDocument.createElementNS(C.SVGNS, "polygon");
        lPath.setAttribute("points", pPoints);
        if (pClass) {
            lPath.setAttribute("class", pClass);
        }
        return lPath;
    }

    function _createRect(pBBox, pClass, pRX, pRY) {
        var lRect = gDocument.createElementNS(C.SVGNS, "rect");
        lRect.setAttribute("width", pBBox.width);
        lRect.setAttribute("height", pBBox.height);
        if (pBBox.x) {
            lRect.setAttribute("x", pBBox.x);
        }
        if (pBBox.y) {
            lRect.setAttribute("y", pBBox.y);
        }
        if (pRX) {
            lRect.setAttribute("rx", pRX);
        }
        if (pRY) {
            lRect.setAttribute("ry", pRY);
        }
        if (pClass) {
            lRect.setAttribute("class", pClass);
        }
        return lRect;
    }

    function _createABox(pBBox, pClass) {
        var lSlopeOffset = 3;
        var lPathString = "M" + pBBox.x + "," + pBBox.y;
        // start
        lPathString += "l" + lSlopeOffset + ", -" + pBBox.height / 2;
        lPathString += "l" + (pBBox.width - 2 * lSlopeOffset) + ",0";
        lPathString += "l" + lSlopeOffset + "," + pBBox.height / 2;
        lPathString += "l-" + lSlopeOffset + "," + pBBox.height / 2;
        lPathString += "l-" + (pBBox.width - 2 * lSlopeOffset) + ",0 ";
        // bottom line
        lPathString += "l-" + lSlopeOffset + ",-" + pBBox.height / 2;

        return _createPath(lPathString, pClass);
    }

    function _createNote(pBBox, pClass, pFoldSize) {
        var lFoldSizeN = pFoldSize ? pFoldSize : 9;
        var lFoldSize = lFoldSizeN.toString(10);
        var lPathString = "M" + pBBox.x + "," + pBBox.y;
        //((ARCROW_HEIGHT -2*LINE_WIDTH)/2); // start
        lPathString += "l" + (pBBox.width - lFoldSizeN) + ",0 ";
        // top line
        lPathString += "l0," + lFoldSize + " l" + lFoldSize + ",0 m-" + lFoldSize + ",-" + lFoldSize + " l" + lFoldSize + "," + lFoldSize + " ";
        // fold
        lPathString += "l0," + (pBBox.height - lFoldSizeN) + " ";
        //down
        lPathString += "l-" + pBBox.width + ",0 ";
        // bottom line
        lPathString += "l0,-" + pBBox.height + " ";
        // back to home

        return _createPath(lPathString, pClass);
    }

    function _createEdgeRemark(pBBox, pClass, pFoldSize) {
        var lFoldSize = pFoldSize ? pFoldSize : 7;
        // start:
        var lPathString = "M" + pBBox.x + "," + pBBox.y;
        // top line:
        lPathString += " l" + pBBox.width + ",0 ";
        // down:
        lPathString += " l0," + (pBBox.height - lFoldSize);
        // fold:
        lPathString += " l-" + lFoldSize.toString(10) + "," + lFoldSize.toString(10);
        // bottom line:
        lPathString += " l-" + (pBBox.width - lFoldSize) + ",0 ";
        // back to home:
        lPathString += "H";

        return _createPath(lPathString, pClass);
    }

    function createLink (pURL, pElementToWrap){
        var lA = gDocument.createElementNS(C.SVGNS, "a");
        lA.setAttributeNS(C.XLINKNS, "xlink:href", pURL);
        lA.setAttributeNS(C.XLINKNS, "xlink:title", pURL);
        lA.setAttributeNS(C.XLINKNS, "xlink:show", "new");
        lA.appendChild(pElementToWrap);
        return lA;
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

    // TODO: accept coords object i.o x, y
    function _createText(pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
        var lText = gDocument.createElementNS(C.SVGNS, "text");
        lText.setAttribute("x", pX.toString());
        lText.setAttribute("y", pY.toString());

        if (pClass) {
            lText.setAttribute("class", pClass);
        }
        lText.appendChild(createTSpan(pLabel, pURL));

        if (pID) {
            var lTSpanID = createTSpan(" [" + pID + "]", pIDURL);
            lTSpanID.setAttribute("style", lSuperscriptStyle);
            lText.appendChild(lTSpanID);
        }
        return lText;
    }

    function _createDiagonalText (pText, pCanvas){
        var lRetval = _createText(pText, pCanvas.width / 2, pCanvas.height / 2, "watermark");
        var lAngle = 0 - (Math.atan(pCanvas.height / pCanvas.width) * 360 / (2 * Math.PI));
        lRetval.setAttribute("transform", "rotate(" + lAngle.toString() + " " + ((pCanvas.width) / 2).toString() + " " + ((pCanvas.height) / 2).toString() + ")");
        return lRetval;
    }

    function createSingleLine(pLine, pClass) {
        var lLine = gDocument.createElementNS(C.SVGNS, "line");
        lLine.setAttribute("x1", pLine.xFrom.toString());
        lLine.setAttribute("y1", pLine.yFrom.toString());
        lLine.setAttribute("x2", pLine.xTo.toString());
        lLine.setAttribute("y2", pLine.yTo.toString());
        if (pClass) {
            lLine.setAttribute("class", pClass);
        }
        return lLine;
    }

    // TODO: de-uglify the resulting grahpics?
    // TODO: delegate stuff?
    function createDoubleLine(pLine, pClass) {
        var lSpace = 2;
        var lPathString = "M" + pLine.xFrom.toString() + "," + pLine.yFrom.toString();
        var ldx = pLine.xTo > pLine.xFrom ? ldx = 1 : ldx = -1;
        var ldy = ldx * (pLine.yTo - pLine.yFrom) / (pLine.xTo - pLine.xFrom);
        var lLenX = pLine.xTo - pLine.xFrom;
        var lLenY = pLine.yTo - pLine.yFrom;

        lPathString += "l" + ldx.toString() + "," + ldy.toString();
        // left stubble
        lPathString += "M" + pLine.xFrom.toString() + "," + (pLine.yFrom - lSpace).toString();
        lPathString += " l" + lLenX.toString() + "," + lLenY.toString();
        // upper line
        lPathString += "M" + pLine.xFrom.toString() + "," + (pLine.yFrom + lSpace).toString();
        lPathString += " l" + lLenX.toString() + "," + lLenY.toString();
        // lower line
        lPathString += "M" + (pLine.xTo - ldx).toString() + "," + pLine.yTo.toString();
        lPathString += "l" + ldx.toString() + "," + ldy.toString();
        // right stubble

        return _createPath(lPathString, pClass);
    }

    function _createLine(pLine, pClass, pDouble) {
        if (!pDouble) {
            return createSingleLine(pLine, pClass);
        } else {
            return createDoubleLine(pLine, pClass);
        }
    }

    // TODO: accept coords (or even a bbox?)
    function _createUTurn(pPoint, pEndY, pWidth, pClass) {
        var lPathString = "M" + pPoint.x.toString() + ", -" + pPoint.y.toString();
        lPathString += " l" + pWidth.toString() + ",0";
        // right
        lPathString += " l0," + (pEndY).toString();
        // down
        lPathString += " l-" + pWidth.toString() + ",0";
        // left
        /*
         var lPathString = "M" + pStartX.toString() + ", -" + pStartY.toString();
         lPathString += " a "+ pWidth.toString() + " 4 0 0 1 0 " + pEndY.toString();
         */

        return _createPath(lPathString, pClass);
    }

    function _createGroup(pId) {
        var lGroup = gDocument.createElementNS(C.SVGNS, "g");
        if (pId) {
          lGroup.setAttribute("id", pId);
        }

        return lGroup;
    }

    function _createUse(pX, pY, pLink) {
        var lUse = gDocument.createElementNS(C.SVGNS, "use");
        lUse.setAttribute("x", pX.toString());
        lUse.setAttribute("y", pY.toString());
        lUse.setAttributeNS(C.XLINKNS, "xlink:href", "#" + pLink);
        return lUse;
    }

    function _createMarker(pId, pClass, pOrient) {
        var lMarker = gDocument.createElementNS(C.SVGNS, "marker");
        lMarker.setAttribute("orient", pOrient);
        lMarker.setAttribute("id", pId);
        lMarker.setAttribute("class", pClass);
        /* TODO: externalize or make these attributes explicit. */
        lMarker.setAttribute("viewBox", "0 0 10 10");
        lMarker.setAttribute("refX", "9");
        lMarker.setAttribute("refY", "3");
        lMarker.setAttribute("markerUnits", "strokeWidth");
        lMarker.setAttribute("markerWidth", "10");
        lMarker.setAttribute("markerHeight", "10");
        lMarker.setAttribute("refX", "9");
        lMarker.setAttribute("refX", "9");

        return lMarker;
    }

    function _createMarkerPath(pId, pD) {
        var lMarker = _createMarker(pId, "arrow-marker", "auto");
        var lPath = _createPath(pD, "arrow-style");
        lMarker.appendChild(lPath);
        return lMarker;
    }

    function _createMarkerPolygon(pId, pPoints) {
        var lMarker = _createMarker(pId, "arrow-marker", "auto");
        var lPolygon = _createPolygon(pPoints, "filled arrow-style");
        lMarker.appendChild(lPolygon);
        return lMarker;
    }

    return {
        /**
         * Function to set the document to use. Introduced to enable use of the
         * rendering utilities under node.js (using the jsdom module)
         *
         * @param {document} pDocument
         */
        init : function(pDocument) {
            gDocument = pDocument;
        },
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
         * @param {number} pX
         * @param {number} pY
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
         * @param {number} pStartX
         * @param {number} pStartY
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
         * @param {number} pX
         * @param {number} pY
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
        createMarkerPolygon : _createMarkerPolygon,

        /**
         * Returns the bounding box of the passed element.
         *
         * Note: to be able to calculate the actual bounding box of an element it has
         * to be in a DOM tree first. Hence this function temporarily creates the element,
         * calculates the bounding box and removes the temporarily created element again.
         *
         * @param {SVGElement} pElement - the element to calculate the bounding box for
         * @return {boundingbox} an object with properties height, width, x and y. If
         * the function cannot determine the bounding box  be determined, returns 15,15,2,2
         * as "reasonable default"
         */
        getBBox : _getBBox,
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
