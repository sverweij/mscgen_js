define(["log"], function(log) {

var SVGNS = new String ("http://www.w3.org/2000/svg");
var XLINKNS = new String ("http://www.w3.org/1999/xlink");
var XHTMLNS = new String ("");

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

function _createText(pLabel, pX, pY, pClass) {
    var lText = document.createElementNS(SVGNS, "text");
    var lContent = document.createTextNode(pLabel);
    lText.setAttribute ("x", pX.toString());
    lText.setAttribute ("y", pY.toString());
    if (pClass) {
        lText.setAttribute ("class", pClass);
    }
    lText.appendChild(lContent);
    return lText;
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
    createPath: function (pD, pClass) {
                    return _createPath(pD, pClass);
                },
    createRect: function createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY) {
                    return _createRect(pWidth, pHeight, pClass, pX, pY, pRX, pRY);
                },
    createText: function (pLabel, pX, pY, pClass) {
                    return _createText(pLabel, pX, pY, pClass)
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
