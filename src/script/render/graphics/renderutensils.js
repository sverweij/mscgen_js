/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    function _scaleCanvasToWidth(pWidth, pCanvas) {
        pCanvas.scale = (pWidth / pCanvas.width);
        pCanvas.width *= pCanvas.scale;
        pCanvas.height *= pCanvas.scale;
        pCanvas.horizontaltransform *= pCanvas.scale;
        pCanvas.verticaltransform *= pCanvas.scale;
        pCanvas.x = 0 - pCanvas.horizontaltransform;
        pCanvas.y = 0 - pCanvas.verticaltransform;
    }

    function _determineDepthCorrection(pDepth, pLineWidth){
        return pDepth ? 2 * ((pDepth + 1) * 2 * pLineWidth) : 0;
    }

    /**
     * Sets the fill color of the passed pElement to the textcolor of
     * the given pArc
     *
     * @param <svgElement> pElement
     * @param <string> pTextColor
     */
    function _colorText(pElement, pTextColor) {
        if (pTextColor) {
            pElement.setAttribute("style", "fill:" + pTextColor + ";");
        }
    }
    
    /**
     * Makes the text color blue if there is an url and no text color
     * 
     * @param <svgElement> pElement
     * @param <string> pUrl
     * @param <string> pTextColor
     */ 
     function _colorLink(pElement, pUrl, pTextColor){
         _colorText(pElement, (pUrl && !pTextColor) ? "blue" : pTextColor);
     }
    

    /**
     * colorBox() - sets the fill and stroke color of the element to the
     * textbgcolor and linecolor of the given arc
     *
     * @param <svg element> - pElemeent
     * @param <object> - pArc
     */
    function _colorBox(pElement, pArc) {
        var lStyleString = "";
        if (pArc.textbgcolor) {
            lStyleString += "fill:" + pArc.textbgcolor + ";";
        }
        if (pArc.linecolor) {
            lStyleString += "stroke:" + pArc.linecolor + ";";
        }
        pElement.setAttribute("style", lStyleString);
    }

    function swap (pPair, pA, pB){
        var lTmp = pPair[pA];
        pPair[pA] = pPair[pB];
        pPair[pB] = lTmp;
    }

    function _swapfromto(pPair){
        swap(pPair, "from", "to");
    }
    
    
    function _determineArcXTo(pKind, pFrom, pTo){
        if ("-x" === pKind) {
            return pFrom + (pTo - pFrom) * (3 / 4);
        } else {
            return pTo;
        }
    }

    return {
        scaleCanvasToWidth : _scaleCanvasToWidth,
        determineDepthCorrection : _determineDepthCorrection,
        colorText: _colorText,
        colorBox: _colorBox,
        colorLink: _colorLink,
        swapfromto: _swapfromto,
        determineArcXTo: _determineArcXTo
    };
});
