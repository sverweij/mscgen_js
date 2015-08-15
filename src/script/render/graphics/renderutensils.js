/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../text/dotmap"], function(map) {
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

    /* for one line labels add an end of line so it gets
     * rendered above the arc in stead of directly on it.
     * TODO: kludgy
     */
    function _oneLineLabelsFix(pLabel){
        if (pLabel && (pLabel.indexOf('\\n') === -1)) {
            return pLabel + "\\n";
        } else {
            return pLabel;
        }
    }
    /**
     * Sets the fill color of the passed pElement to the textcolor of
     * the given pArc
     *
     * @param <svgElement> pElement
     * @param <object> pArc
     */
    function _colorText(pElement, pArc) {
        if (pArc.textcolor) {
            pElement.setAttribute("style", "fill:" + pArc.textcolor + ";");
        }
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
    
    function getSignalend(pKind, pFrom, pTo){
        if (pFrom && pTo && (["<->", "->"].indexOf(pKind > -1))) {
            return (pFrom < pTo)? "signal" : "signal-u";
        }        
    }
    
    function getSignalstart(pKind, pFrom, pTo){
        if("<->" === pKind && pFrom <= pTo){
            return "signal-l";
        } else {
            return "signal-lu";
        }
    }
        
    var KINDS = {
        "->"    : {
            style: "marker-end:url(#{{id}}{{signal-marker-end}}-{{color}});",
            marker : {
                name : "signal",
            }
        },
        "<->"   : {
            style: "marker-end:url(#{{id}}{{signal-marker-end}}-{{color}});marker-start:url(#{{id}}{{signal-marker-start}}-{{color}});",
            marker : {
                name : "signal",
            }
        },
        "=>>"   : {
            style: "marker-end:url(#{{id}}callback-{{color}});",
            marker: {
                name : "callback",
                end : ""
            }
        },
        "<<=>>" : {
            style: "marker-end:url(#{{id}}callback-{{color}});marker-start:url(#{{id}}callback-l-{{color}});",
            marker: {
                name : "callback",
                end : "",
                start : "-l"
            }
        },
        ">>"    : {
            style: "stroke-dasharray:5,2;marker-end:url(#{{id}}callback-{{color}});",
            marker: {
                name : "callback",
                end : ""
            }
        },
        "<<>>"  : {
            style: "stroke-dasharray:5,2;marker-end:url(#{{id}}callback-{{color}});marker-start:url(#{{id}}callback-l-{{color}});",
            marker: {
                name : "callback",
                end : "",
                start : "-l"
            }
        },
        ".."    : {
            style: "stroke-dasharray:5,2;"
        },
        "=>"    : {
            style: "marker-end:url(#{{id}}method-{{color}});",
            marker: {
                name : "method",
                end : "",
            }
        },
        "<=>"   : {
            style: "marker-end:url(#{{id}}method-{{color}});marker-start:url(#{{id}}method-l-{{color}});",
            marker: {
                name : "method",
                end : "",
                start : "-l"
            }
        },
        ":>"    : {
            style: "marker-end:url(#{{id}}method-{{color}});",
            marker: {
                name : "method",
                end : "",
            }
        },
        "<:>"   : {
            style: "marker-end:url(#{{id}}method-{{color}});marker-start:url(#{{id}}method-l-{{color}});",
            marker: {
                name : "method",
                end : "",
                start : "-l"
            }
        },
        "-x"    : {
            style: "marker-end:url(#{{id}}lost-{{color}});",
            marker: {
                name : "lost",
                end : "",
            }
        }
    };
    
    
    function getStyleString(pKind, pFrom, pTo){
        var lRetval = "stroke: {{color}};";
        if(KINDS[pKind]){
            lRetval += KINDS[pKind].style;
        }
        return lRetval.replace(/\{\{signal-marker-end\}\}/g, getSignalend(pKind, pFrom, pTo))
                      .replace(/\{\{signal-marker-start\}\}/g, getSignalstart(pKind, pFrom, pTo));
    }
    
    function _getLineStyle(pId, pKind, pLineColor, pFrom, pTo){
        var lRetval = "";
        
        if (!!pKind) {
            lRetval = getStyleString(pKind, pFrom, pTo)
                        .replace(/\{\{id\}\}/g, pId)
                        .replace(/\{\{color\}\}/g, pLineColor||"black");
        }
        return lRetval;
    }
    var MARKERPATHS = { 
        "signal" : { 
            "variants" : [ 
                {name : "",   path : "M 9 3 l -8 2"},
                {name : "-u",  path : "M 9 3 l -8 -2"},
                {name : "-l",  path : "M 9 3 l 8 2"},
                {name : "-lu", path : "M 9 3 l 8 -2"}
            ]   
        },  
        "method" : { 
            "variants" : [ 
                {name : "",  path : "1,1 9,3 1,5"},
                {name : "-l", path : "17,1 9,3 17,5"}
            ]   
        },  
        "callback" : { 
            "variants" : [ 
                {name : "",  path : "M 1 1 l 8 2 l -8 2"},
                {name : "-l", path : "M 17 1 l -8 2 l 8 2"}
            ]   
        },  
        "lost" : { 
            "variants" : [ 
                {name : "",  path : "M6.5,-0.5 L11.5,5.5 M6.5,5.5 L11.5,-0.5"}
            ]   
        }   
    };
    
    function makeKindColorCombi (pKind, pColor) {
        return  map.getNormalizedKind(pKind) + 
                ((!!pColor ) ? " " + pColor : " black");
    }
    
    function extractKindColorCombisFromArc(pKindColorCombis, pArc){
        function _extractKindColorCombis (pArcElt){
            extractKindColorCombisFromArc(pKindColorCombis, pArcElt);
        }
        if (Array.isArray(pArc)){
            pArc.forEach(_extractKindColorCombis);
        } 
        if (!!pArc.arcs){
            pArc.arcs.forEach(_extractKindColorCombis);
        }
        if(!!pArc.kind && !!KINDS[pArc.kind] &&
            makeKindColorCombi(pArc.kind, pArc.linecolor) && 
            pKindColorCombis.indexOf(makeKindColorCombi(pArc.kind, pArc.linecolor)) < 0){
            pKindColorCombis.push(makeKindColorCombi(pArc.kind, pArc.linecolor));
        }
        return pKindColorCombis;
    }
    
    function toColorCombiObject(pColorCombi){
        return {kind: pColorCombi.split(" ")[0], color: pColorCombi.split(" ")[1]};
    }

    /*
     * as you might have noticed we only run through the arcs, while entities
     * also define colors for arcs with their arclinecolor. 
     * So why does this work? 
     * Because the pAST that is passed here, is usually "flattened" 
     * with the ast flattening module (flatten.js), which already distributes
     * the arclinecolors from the entities to linecolors in the arc.
     *
     * For the same reason it's not really necessary to handle the recursion
     * of inline expressions (note that the code is doing that notwithstanding)
     */
    function extractKindColorCombis(pAST){
        return pAST.arcs.reduce(extractKindColorCombisFromArc, []).sort().map(toColorCombiObject);
    }

    function flatten (pArray){
        var lRetval = [];
        return lRetval.concat.apply(lRetval, pArray);
    }

    function onlyWithMarkers(pCombi){
        return !!(KINDS[pCombi.kind].marker);
    }
    return {
        scaleCanvasToWidth : _scaleCanvasToWidth,
        determineDepthCorrection : _determineDepthCorrection,
        oneLineLabelsFix: _oneLineLabelsFix,
        colorText: _colorText,
        colorBox: _colorBox,
        swapfromto: _swapfromto,
        getLineStyle: _getLineStyle,

        getMarkerDefs : function (pId, pAST) {
            return flatten(extractKindColorCombis(pAST).filter(onlyWithMarkers).map(function(pCombi){
                return MARKERPATHS[KINDS[pCombi.kind].marker.name].variants.map(function(pVariant){
                    return {
                        name: pId + KINDS[pCombi.kind].marker.name + pVariant.name + "-" + pCombi.color,
                        path: pVariant.path,
                        color: pCombi.color,
                        type: KINDS[pCombi.kind].marker.name
                    };
                });
            }));

        }
    };
});
