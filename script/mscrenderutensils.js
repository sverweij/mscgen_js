/*
 * renders individual elements in sequence charts
 *
 * knows of:
 *  document
 *  linewidth (implicit
 *
 * defines:
 *  defaults for 
 *      slope offset on aboxes
 *      fold size on notes
 *      space to use between double lines
 */

define([], function() {

var SVGNS = new String ("http://www.w3.org/2000/svg");
var XLINKNS = new String ("http://www.w3.org/1999/xlink");
var XHTMLNS = new String ("http://www.w3.org/1999/xhtml");

/* superscript style could also be super or a number (1em) or a % (100%) */
var lSuperscriptStyle = "vertical-align : text-top;";
lSuperscriptStyle += "font-size: 0.7em; text-anchor: start;"

function _cleanElement (pChildId) {
    var lOldChild = document.getElementById(pChildId);
    var lParentElement = lOldChild.parentNode;
    var lNewChild =
        document.createElementNS(SVGNS, lOldChild.tagName);
    lNewChild.setAttribute("id", pChildId);
    lParentElement.replaceChild(lNewChild, lOldChild);
}

function _getTextWidth (pText, pFont) {
    return pText.length * 5.7;
}

function _createPath(pD, pClass) {
    var lPath = document.createElementNS(SVGNS, "path");
    lPath.setAttribute ("d", pD);
    if (pClass) {
        lPath.setAttribute ("class", pClass);
    }
    return lPath;
}

function _createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY) {
    var lRect = document.createElementNS(SVGNS, "rect");
    lRect.setAttribute ("width", pWidth);
    lRect.setAttribute ("height", pHeight);
    if (pX) { lRect.setAttribute ("x", pX); }
    if (pY) { lRect.setAttribute ("y", pY); }
    if (pRX) { lRect.setAttribute ("rx", pRX); }
    if (pRY) { lRect.setAttribute ("ry", pRY); }
    if (pClass) { lRect.setAttribute ("class", pClass); }
    return lRect;
}

function _createABox(pWidth, pHeight, pClass, pX, pY) {
    var lSlopeOffset = 3;
    var lPathString = "M" + pX + "," + pY; // start
    lPathString += "l" + lSlopeOffset +", -" + pHeight/2;
    lPathString += "l" + (pWidth - 2*lSlopeOffset) + ",0";
    lPathString += "l" + lSlopeOffset + "," + pHeight/2;
    lPathString += "l-" + lSlopeOffset + "," + pHeight/2;
    lPathString += "l-" + (pWidth - 2*lSlopeOffset) + ",0 "; // bottom line
    lPathString += "l-" + lSlopeOffset + ",-" + pHeight/2;

    return _createPath(lPathString, pClass);
}
function _createNote(pWidth, pHeight, pClass, pX, pY) {
    var lFoldSize = "9";
    var lPathString = "M" + pX + "," + pY;//((ARCROW_HEIGHT -2*LINE_WIDTH)/2); // start
    lPathString += "l" + (pWidth - lFoldSize) + ",0 "; // top line
    lPathString += "l0," + lFoldSize + " l" + lFoldSize +",0 m-" + lFoldSize + ",-" + lFoldSize + " l" + lFoldSize + "," +lFoldSize + " "; // fold
    lPathString += "l0," + (pHeight - lFoldSize) + " ";//down
    lPathString += "l-" + pWidth + ",0 "; // bottom line
    lPathString += "l0,-" +pHeight +" ";  // back to home

    return _createPath(lPathString, pClass);
}

function createTextNative(pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
    var lText = document.createElementNS(SVGNS, "text");
    var lTSpanLabel = document.createElementNS(SVGNS, "tspan");
    var lTSpanID = document.createElementNS(SVGNS, "tspan");

    var lContent = document.createTextNode(pLabel);
    lText.setAttribute ("x", pX.toString());
    lText.setAttribute ("y", pY.toString());
    if (pClass) {
        lText.setAttribute ("class", pClass);
    }
    
    lTSpanLabel.appendChild(lContent);
    if (pURL) {
        var lA = document.createElementNS(SVGNS, "a");
        lA.setAttributeNS(XLINKNS, "xlink:href", pURL);
        lA.setAttributeNS(XLINKNS, "xlink:title", pURL);
        lA.setAttributeNS(XLINKNS, "xlink:show", "new");
        lA.appendChild(lTSpanLabel);
        lText.appendChild(lA);
    } else {
        lText.appendChild(lTSpanLabel);
    }

    if (pID) {
        lTSpanID.appendChild(document.createTextNode(" [" + pID + "]"));
        lTSpanID.setAttribute("style", lSuperscriptStyle");
        // lTSpanID.setAttribute("y", "-1");
    
        if (pIDURL) {
            var lA = document.createElementNS(SVGNS, "a");
            lA.setAttributeNS(XLINKNS, "xlink:href", pIDURL);
            lA.setAttributeNS(XLINKNS, "xlink:title", pIDURL);
            lA.setAttributeNS(XLINKNS, "xlink:show", "new");
            lA.appendChild(lTSpanID);
            lText.appendChild(lA);

        } else {
            lText.appendChild(lTSpanID);
        }
    }
    return lText;
}

function createTextForeign(pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
    var lFO = document.createElementNS(SVGNS, "foreignObject");
    var lDiv = document.createElementNS(XHTMLNS, "xhtml:div");
    var lContent = document.createTextNode(pLabel);
    lFO.setAttribute ("x", pX.toString());
    lFO.setAttribute ("y", pY.toString());
    lFO.setAttribute("width","96");
    lFO.setAttribute("height","40");
    if (pClass) {
        lDiv.setAttribute ("class", pClass);
    }
    lDiv.appendChild(lContent);
    lFO.appendChild(lDiv);
    return lFO;
}

function _createText(pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
    // var lSwitch = document.createElementNS(SVGNS, "switch");
    // lSwitch.appendChild(createTextForeign(pLabel, pX, pY, pClass, pURL, pIDURL));
    // lSwitch.appendChild(createTextNative(pLabel, pX, pY, pClass, pURL, pID, pIDURL));
    // return lSwitch;
    return createTextNative(pLabel, pX, pY, pClass, pURL, pID, pIDURL);
}

function createSingleLine(pX1, pY1, pX2, pY2, pClass) {
    var lLine = document.createElementNS(SVGNS, "line");
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
    var lLenX = pX2 - pX1;
    var lLenY = pY2 - pY1;
    var ldx = pX2 > pX1 ? ldx = 1 : ldx = -1;
    var ldy = ldx*(pY2 - pY1)/(pX2 - pX1);

    lPathString += "l" + ldx.toString() + "," + ldy.toString(); // left stubble
    lPathString += "M" + pX1.toString() + "," + (pY1-lSpace).toString();
    lPathString += " l" + lLenX.toString() + "," + lLenY.toString(); // upper line
    lPathString += "M" + pX1.toString() + "," + (pY1+lSpace).toString();
    lPathString += " l" + lLenX.toString() + "," + lLenY.toString(); // lower line
    lPathString += "M" + (pX2-ldx).toString() + "," + pY2.toString();
    lPathString += "l" + ldx.toString() + "," + ldy.toString(); // right stubble

    return _createPath (lPathString, pClass);
}

function _createLine(pX1, pY1, pX2, pY2, pClass, pDouble) {
    if (!pDouble) {
        return createSingleLine(pX1, pY1, pX2, pY2, pClass);
    } else {
        return createDoubleLine(pX1, pY1, pX2, pY2, pClass);
    }
}

function _createGroup(pId) {
    var lGroup = document.createElementNS(SVGNS, "g");
    lGroup.setAttribute("id", pId);

    return lGroup;
}

function _createUse (pX, pY, pLink) {
    var lUse = document.createElementNS(SVGNS, "use");
    lUse.setAttribute("x", pX.toString());
    lUse.setAttribute("y", pY.toString());
    lUse.setAttributeNS(XLINKNS, "xlink:href", "#" + pLink);
    return lUse;
}

return {
    cleanElement: function (pId) {
                    return _cleanElement(pId);
                },
    createPath: function (pD, pClass) {
                    return _createPath(pD, pClass);
                },
    createRect: function createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY) {
                    return _createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY);
                },
    createABox: function createABox(pWidth, pHeight, pClass, pX, pY) {
                    return _createABox(pWidth, pHeight, pClass, pX, pY);
                },
    createNote: function createNote(pWidth, pHeight, pClass, pX, pY) {
                    return _createNote(pWidth, pHeight, pClass, pX, pY);
                },
    createText: function (pLabel, pX, pY, pClass, pURL, pID, pIDURL) {
                    return _createText(pLabel, pX, pY, pClass, pURL, pID, pIDURL)
                },
    createLine: function (pX1, pY1, pX2, pY2, pClass, pDouble) {
                    return _createLine(pX1, pY1, pX2, pY2, pClass, pDouble)
                },
    createGroup: function (pId) {
                    return _createGroup(pId);
                 },
    createUse: function(pX, pY, pLink) {
                    return _createUse (pX, pY, pLink);
               },
    getTextWidth: function (pText, pFont) {
                      return _getTextWidth(pText, pFont);
                  }
}
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
