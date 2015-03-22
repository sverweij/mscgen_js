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
     * Some SVG specific calculations & workarounds
     */
    "use strict";

    var gDocument;

    function getNativeBBox(pElement){
        var lSvg = gDocument.createElementNS(C.SVGNS, "svg");
        lSvg.setAttribute("version", "1.1");
        lSvg.setAttribute("xmlns", C.SVGNS);
        lSvg.setAttribute("xmlns:xlink", C.XLINKNS);

        gDocument.body.appendChild(lSvg);
        lSvg.appendChild(pElement);
        var lRetval = pElement.getBBox();
        lSvg.removeChild(pElement);
        gDocument.body.removeChild(lSvg);

        return lRetval;
    }

    /*
     * workaround for Opera browser quirk: if the dimensions
     * of an element are 0x0, Opera's getBBox() implementation
     * returns -Infinity (which is a kind of impractical value
     * to actually render, even for Opera)
     * To counter this, manually set the return value to 0x0
     * if height or width has a wacky value:
     */
    function sanitizeBBox(pBBox){
        var INSANELYBIG = 100000;
        if (Math.abs(pBBox.height) > INSANELYBIG || Math.abs(pBBox.width) > INSANELYBIG ) {
            return {
                height : 0,
                width : 0,
                x : 0,
                y : 0
            };
        } else {
            return pBBox;
        }
    }

    // TODO: this is a query type of thing
    //       responsibility-wise a strange one in this module
    //       (which is responsible for creating svg elements)
    function _getBBox(pElement) {
        if ( typeof (pElement.getBBox) === 'function') {
            return sanitizeBBox(getNativeBBox(pElement));
        } else {
            return {
                height : 15,
                width : 15,
                x : 2,
                y : 2
            };
        }
    }

    function createTSpan(pLabel){
        var lTSpanLabel = gDocument.createElementNS(C.SVGNS, "tspan");
        lTSpanLabel.appendChild(gDocument.createTextNode(pLabel));

        return lTSpanLabel;
    }

    function createText(pLabel) {
        var lText = gDocument.createElementNS(C.SVGNS, "text");
        lText.setAttribute("x", "0");
        lText.setAttribute("y", "0");
        lText.appendChild(createTSpan(pLabel));

        return lText;
    }

    function _calculateTextHeight(){
        return _getBBox(createText("\u00C1jy\u00CE9\u0192@")).height;
    }

    return {
        init: function(pDocument){
            gDocument = pDocument;
        },

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
         * Returns the height in pixels necessary for rendering characters
         */
        calculateTextHeight: _calculateTextHeight    };
});
