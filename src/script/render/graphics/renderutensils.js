/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
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

    var SVGNS = "http://www.w3.org/2000/svg";
    var XLINKNS = "http://www.w3.org/1999/xlink";
    var INSANELYBIG = 100000;
    var gDocument;

    /* superscript style could also be super or a number (1em) or a % (100%) */
    var lSuperscriptStyle = "vertical-align : text-top;";
    lSuperscriptStyle += "font-size: 0.7em; text-anchor: start;";

    function _getBBox(pElement) {
        var lRetval = {
            height : 15,
            width : 15,
            x : 2,
            y : 2
        };

        if ( typeof (pElement.getBBox) === 'function') {
            /*
            var lBody = gDocument.getElementsByTagName("svg")[0];

            lBody.appendChild(pElement);
            lRetval = pElement.getBBox();
            lBody.removeChild(pElement);

            it's probably better to not depend on the existence of
            an svg in the body that is actualy usable :-). 

            Hence:
            */

            var lSvg = gDocument.createElementNS(SVGNS, "svg");
            lSvg.setAttribute("version", "1.1");
            lSvg.setAttribute("xmlns", SVGNS);
            lSvg.setAttribute("xmlns:xlink", XLINKNS);

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
            if (lRetval.height > INSANELYBIG || lRetval.width > INSANELYBIG || lRetval.height < 0 - INSANELYBIG || lRetval.width < 0 - INSANELYBIG) {
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
        var lPath = gDocument.createElementNS(SVGNS, "path");
        lPath.setAttribute("d", pD);
        if (pClass) {
            lPath.setAttribute("class", pClass);
        }
        return lPath;
    }

    function _createPolygon(pPoints, pClass) {
        var lPath = gDocument.createElementNS(SVGNS, "polygon");
        lPath.setAttribute("points", pPoints);
        if (pClass) {
            lPath.setAttribute("class", pClass);
        }
        return lPath;
    }

    function _createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY) {
        var lRect = gDocument.createElementNS(SVGNS, "rect");
        lRect.setAttribute("width", pWidth);
        lRect.setAttribute("height", pHeight);
        if (pX) {
            lRect.setAttribute("x", pX);
        }
        if (pY) {
            lRect.setAttribute("y", pY);
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

    function _createABox(pWidth, pHeight, pClass, pX, pY) {
        var lSlopeOffset = 3;
        var lPathString = "M" + pX + "," + pY;
        // start
        lPathString += "l" + lSlopeOffset + ", -" + pHeight / 2;
        lPathString += "l" + (pWidth - 2 * lSlopeOffset) + ",0";
        lPathString += "l" + lSlopeOffset + "," + pHeight / 2;
        lPathString += "l-" + lSlopeOffset + "," + pHeight / 2;
        lPathString += "l-" + (pWidth - 2 * lSlopeOffset) + ",0 ";
        // bottom line
        lPathString += "l-" + lSlopeOffset + ",-" + pHeight / 2;

        return _createPath(lPathString, pClass);
    }

    function _createNote(pWidth, pHeight, pClass, pX, pY, pFoldSize) {
        var lFoldSizeN = pFoldSize ? pFoldSize : 9;
        var lFoldSize = lFoldSizeN.toString(10);
        var lPathString = "M" + pX + "," + pY;
        //((ARCROW_HEIGHT -2*LINE_WIDTH)/2); // start
        lPathString += "l" + (pWidth - lFoldSizeN) + ",0 ";
        // top line
        lPathString += "l0," + lFoldSize + " l" + lFoldSize + ",0 m-" + lFoldSize + ",-" + lFoldSize + " l" + lFoldSize + "," + lFoldSize + " ";
        // fold
        lPathString += "l0," + (pHeight - lFoldSizeN) + " ";
        //down
        lPathString += "l-" + pWidth + ",0 ";
        // bottom line
        lPathString += "l0,-" + pHeight + " ";
        // back to home

        return _createPath(lPathString, pClass);
    }

    function _createEdgeRemark(pWidth, pHeight, pClass, pX, pY, pFoldSize) {
        var lFoldSize = pFoldSize ? pFoldSize : 7;
        // M-28,0 l112.91796875,0 l0,l9,-9l-103.91796875,0 l0,17
        // start:
        var lPathString = "M" + pX + "," + pY;
        // top line:
        lPathString += " l" + pWidth + ",0 ";
        // down:
        lPathString += " l0," + (pHeight - lFoldSize);
        // fold:
        lPathString += " l-" + lFoldSize.toString(10) + "," + lFoldSize.toString(10);
        // bottom line:
        lPathString += " l-" + (pWidth - lFoldSize) + ",0 ";
        // back to home:
        lPathString += "H";

        return _createPath(lPathString, pClass);
    }

    function _createText(pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
        var lText = gDocument.createElementNS(SVGNS, "text");
        var lTSpanLabel = gDocument.createElementNS(SVGNS, "tspan");
        var lTSpanID = gDocument.createElementNS(SVGNS, "tspan");

        var lContent = gDocument.createTextNode(pLabel);
        lText.setAttribute("x", pX.toString());
        lText.setAttribute("y", pY.toString());
        if (pClass) {
            lText.setAttribute("class", pClass);
        }

        lTSpanLabel.appendChild(lContent);
        if (pURL) {
            var lA = gDocument.createElementNS(SVGNS, "a");
            lA.setAttributeNS(XLINKNS, "xlink:href", pURL);
            lA.setAttributeNS(XLINKNS, "xlink:title", pURL);
            lA.setAttributeNS(XLINKNS, "xlink:show", "new");
            lA.appendChild(lTSpanLabel);
            lText.appendChild(lA);
        } else {
            lText.appendChild(lTSpanLabel);
        }

        if (pID) {
            lTSpanID.appendChild(gDocument.createTextNode(" [" + pID + "]"));
            lTSpanID.setAttribute("style", lSuperscriptStyle);
            // lTSpanID.setAttribute("y", "-1");

            if (pIDURL) {
                var lAid = gDocument.createElementNS(SVGNS, "a");
                lAid.setAttributeNS(XLINKNS, "xlink:href", pIDURL);
                lAid.setAttributeNS(XLINKNS, "xlink:title", pIDURL);
                lAid.setAttributeNS(XLINKNS, "xlink:show", "new");
                lAid.appendChild(lTSpanID);
                lText.appendChild(lAid);

            } else {
                lText.appendChild(lTSpanID);
            }
        }
        return lText;
    }

    function createSingleLine(pX1, pY1, pX2, pY2, pClass) {
        var lLine = gDocument.createElementNS(SVGNS, "line");
        lLine.setAttribute("x1", pX1.toString());
        lLine.setAttribute("y1", pY1.toString());
        lLine.setAttribute("x2", pX2.toString());
        lLine.setAttribute("y2", pY2.toString());
        if (pClass) {
            lLine.setAttribute("class", pClass);
        }
        return lLine;
    }

    function createDoubleLine(pX1, pY1, pX2, pY2, pClass) {
        var lSpace = 2;
        var lPathString = "M" + pX1.toString() + "," + pY1.toString();
        var ldx = pX2 > pX1 ? ldx = 1 : ldx = -1;
        var ldy = ldx * (pY2 - pY1) / (pX2 - pX1);
        var lLenX = pX2 - pX1;
        var lLenY = pY2 - pY1;

        lPathString += "l" + ldx.toString() + "," + ldy.toString();
        // left stubble
        lPathString += "M" + pX1.toString() + "," + (pY1 - lSpace).toString();
        lPathString += " l" + lLenX.toString() + "," + lLenY.toString();
        // upper line
        lPathString += "M" + pX1.toString() + "," + (pY1 + lSpace).toString();
        lPathString += " l" + lLenX.toString() + "," + lLenY.toString();
        // lower line
        lPathString += "M" + (pX2 - ldx).toString() + "," + pY2.toString();
        lPathString += "l" + ldx.toString() + "," + ldy.toString();
        // right stubble

        return _createPath(lPathString, pClass);
    }

    function _createLine(pX1, pY1, pX2, pY2, pClass, pDouble) {
        if (!pDouble) {
            return createSingleLine(pX1, pY1, pX2, pY2, pClass);
        } else {
            return createDoubleLine(pX1, pY1, pX2, pY2, pClass);
        }
    }

    function _createUTurn(pStartX, pStartY, pEndY, pWidth, pClass) {
        var lPathString = "M" + pStartX.toString() + ", -" + pStartY.toString();
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
        var lGroup = gDocument.createElementNS(SVGNS, "g");
        lGroup.setAttribute("id", pId);

        return lGroup;
    }

    function _createUse(pX, pY, pLink) {
        var lUse = gDocument.createElementNS(SVGNS, "use");
        lUse.setAttribute("x", pX.toString());
        lUse.setAttribute("y", pY.toString());
        lUse.setAttributeNS(XLINKNS, "xlink:href", "#" + pLink);
        return lUse;
    }

    function _createMarker(pId, pClass, pOrient) {
        var lMarker = gDocument.createElementNS(SVGNS, "marker");
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

    function _createMarkerPath(pId, pClass, pOrient, pD, pPathClass) {
        var lMarker = _createMarker(pId, pClass, pOrient);
        var lPath = _createPath(pD, pPathClass);
        lMarker.appendChild(lPath);
        return lMarker;
    }

    function _createMarkerPolygon(pId, pClass, pOrient, pPoints, pPathClass) {
        var lMarker = _createMarker(pId, pClass, pOrient);
        var lPolygon = _createPolygon(pPoints, pPathClass);
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
         * Creates an svg rectangle of pWidth x pHeight, with the top left
         * corner at coordinates (pX, pY). pRX and pRY define the amount of
         * rounding the corners of the rectangle get; when they're left out
         * the function will render the corners as straight.
         *
         * Unit: pixels
         *
         * @param {number} pWidth
         * @param {number} pHeight
         * @param {string} pClass - reference to the css class to be applied
         * @param {number} pX
         * @param {number} pY
         * @param {number=} pRX
         * @param {number=} pRY
         * @return {SVGElement}
         */
        createRect : _createRect,

        /**
         * Creates an angled box of pWidth x pHeight, with the top left corner
         * at coordinates (pX, pY)
         * @param {number} pWidth
         * @param {number} pHeight
         * @param {string} pClass - reference to the css class to be applied
         * @param {number} pX
         * @param {number} pY
         * @return {SVGElement}
         */
        createABox : _createABox,

        /**
         * Creates a note of pWidth x pHeight, with the top left corner
         * at coordinates (pX, pY). pFoldSize controls the size of the
         * fold in the top right corner.
         * @param {number} pWidth
         * @param {number} pHeight
         * @param {string} pClass - reference to the css class to be applied
         * @param {number} pX
         * @param {number} pY
         * @param {number=} [pFoldSize=9]
         *
         * @return {SVGElement}
         */
        createNote : _createNote,

        /**
         * Creates an edge remark (for use in inline expressions) of pWidth x pHeight,
         * with the top left corner at coordinates (pX, pY). pFoldSize controls the size of the
         * fold bottom right corner.
         * @param {number} pWidth
         * @param {number} pHeight
         * @param {string} pClass - reference to the css class to be applied
         * @param {number} pX
         * @param {number} pY
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
         * Creates a line between to coordinates
         * @param {number} pX1
         * @param {number} pY1
         * @param {number} pX2
         * @param {number} pY2
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
         * Create a marker consisting of a path as specified in pD
         *
         * @param {string} pId
         * @param {string} pClass - the css class to use for the marker
         * @param {string} pOrient - the orientation (see svg documentation for possible values. 'auto' is usually a good one)
         * @param {string} pD - a string containing the path
         * @param {string} pPathClass - the css class to use for the path
         */
        createMarkerPath : _createMarkerPath,

        /**
         * Create a marker consisting of a polygon as specified in pPoints
         *
         * @param {string} pId
         * @param {string} pClass - the css class to use for the marker
         * @param {string} pOrient - the orientation (see svg documentation for possible values. 'auto' is usually a good one)
         * @param {string} pPoints - a string with the points of the polygon
         * @param {string} pPathClass - the css class to use for the path
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

        /**
         * @const
         * @default
         */
        SVGNS : SVGNS,
        /**
         * @const
         * @default
         */
        XLINKNS : XLINKNS

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
