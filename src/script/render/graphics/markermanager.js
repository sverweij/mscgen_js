/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../text/utensils", "../text/dotmap"], function(utl, map) {
    "use strict";

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
     * We only run through the arcs, while entities
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

    function onlyWithMarkers(pCombi){
        return !!(KINDS[pCombi.kind].marker);
    }
    return {
        getLineStyle: _getLineStyle,

        getMarkerDefs : function (pId, pAST) {
            return utl.flatten(extractKindColorCombis(pAST).filter(onlyWithMarkers).map(function(pCombi){
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
