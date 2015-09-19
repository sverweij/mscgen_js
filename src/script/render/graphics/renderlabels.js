/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgelementfactory", "./svgutensils", "./constants", "../text/textutensils"], function(fact, svgutl, C, txt) {
    "use strict";

    /**
     * Sets the fill color of the passed pElement to the textcolor of
     * the given pArc
     *
     * @param <svgElement> pElement
     * @param <string> pTextColor
     */
    function colorText(pElement, pTextColor) {
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
     function colorLink(pElement, pUrl, pTextColor){
         colorText(pElement, (pUrl && !pTextColor) ? "blue" : pTextColor);
     }

    function renderArcLabelLineBackground(lLabelElement, pTextbgcolor){
        var lRect = fact.createRect(svgutl.getBBox(lLabelElement), "textbg");
        if (pTextbgcolor) {
            lRect.setAttribute("style", "fill: " + pTextbgcolor + "; stroke:" + pTextbgcolor + ";");
        }
        return lRect;
    }

    function renderLabelText(pPosition, pLine, pMiddle, pY, pClass, pArc){
        var lText = {};
        if (pPosition === 0) {
            lText = fact.createText(pLine, pMiddle, pY, pClass, pArc.url, pArc.id, pArc.idurl);
        } else {
            lText = fact.createText(pLine, pMiddle, pY, pClass, pArc.url);
        }
        return lText;
    }
    
    function createLabelLine(pLine, pMiddle, pStartY, pArc, pPosition, pOptions) {
        var lY = pStartY + ((pPosition + 1/4) * svgutl.calculateTextHeight());
        var lClass;
        if (!!pOptions){
            if (pOptions.underline){
                lClass = "entity";
            }
            if (pOptions.alignLeft){
                lClass = "anchor-start";
            }
            if (pOptions.alignAround){
                lY = pStartY + ((pPosition + 1/4) * (svgutl.calculateTextHeight() + C.LINE_WIDTH));
            }
        }
        var lText = renderLabelText(pPosition, pLine, pMiddle, lY, lClass, pArc);

        colorText(lText, pArc.textcolor);
        colorLink(lText, pArc.url, pArc.textcolor);

        return lText;
    }

    function _createLabel(pArc, pDims, pOptions, pId) {
        var lGroup = fact.createGroup(pId);

        if (pArc.label) {
            var lMiddle = pDims.x + (pDims.width / 2);
            var lLines = txt.splitLabel(
                pArc.label,
                pArc.kind,
                pDims.width,
                C.FONT_SIZE,
                pOptions ? pOptions.wordWrapArcs: false
            );
            var lText = {};
            if(!!pOptions && pOptions.alignAbove){
                lLines.forEach(function(){
                    lLines.push("");
                });
            }

            var lStartY = pDims.y - (lLines.length - 1)/2 * (svgutl.calculateTextHeight() + 1);
            if (!!pOptions && pOptions.alignAround){
                if (lLines.length === 1) {
                    lLines.push("");
                }
                lStartY = pDims.y - (lLines.length - 1)/2 * (svgutl.calculateTextHeight() + C.LINE_WIDTH + 1);
            }            
            lLines
                .filter(function(pLine){ return pLine !== "";})
                .forEach(
                    function(pLine, pLineNumber){
                        lText = createLabelLine(pLine, lMiddle, lStartY, pArc, pLineNumber, pOptions);
                        if (!!pOptions && pOptions.ownBackground){
                            lGroup.appendChild(renderArcLabelLineBackground(lText, pArc.textbgcolor));
                        }
                        lGroup.appendChild(lText);
                        lStartY++;
                    }
                );
        }
        return lGroup;
    }

    return {
        /**
         * createLabel() - renders the text (label, id, url) for a given pArc
         * with a bounding box starting at pStartX, pStartY and of a width of at
         * most pWidth (all in pixels)
         *
         * @param <string> - pId - the unique identification of the textlabe (group) within the svg
         * @param <object> - pArc - the arc of which to render the text
         * @param <object> - pDims - x and y to start on and a width
         * @param <object> - pOptions - alignAbove, alignLeft, alignAround, wordWrapArcs, ownBackground, underline
         */
        createLabel: _createLabel,

    };
});
