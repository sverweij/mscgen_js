/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../lib/lodash/lodash.custom", "../text/arcmappings"], function(_, map) {
    "use strict";

    var KINDS = {
        "->"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}{{signal-marker-end}}-{{color}})"}
            ],
            marker : {
                name : "signal"
            }
        },
        "<->"   : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}{{signal-marker-end}}-{{color}})"},
                {name: "marker-start", value: "url(#{{id}}{{signal-marker-start}}-{{color}})"}
            ],
            marker : {
                name : "signal"
            }
        },
        "=>>"   : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}callback-{{color}})"}
            ],
            marker: {
                name : "callback",
                end : ""
            }
        },
        "<<=>>" : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}callback-{{color}})"},
                {name: "marker-start", value: "url(#{{id}}callback-l-{{color}})"}
            ],
            marker: {
                name : "callback",
                end : "",
                start : "-l"
            }
        },
        ">>"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}callback-{{color}})"}
            ],
            marker: {
                name : "callback",
                end : ""
            }
        },
        "<<>>"  : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}callback-{{color}})"},
                {name: "marker-start", value: "url(#{{id}}callback-l-{{color}})"}
            ],
            marker: {
                name : "callback",
                end : "",
                start : "-l"
            }
        },
        ".."    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"}
            ]
        },
        "--"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"}
            ]
        },
        "=="    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"}
            ]
        },
        "::"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"}
            ]
        },
        "=>"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}method-{{color}})"}
            ],
            marker: {
                name : "method",
                end : ""
            }
        },
        "<=>"   : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}method-{{color}})"},
                {name: "marker-start", value: "url(#{{id}}method-l-{{color}})"}
            ],
            marker: {
                name : "method",
                end : "",
                start : "-l"
            }
        },
        ":>"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}};"},
                {name: "marker-end", value: "url(#{{id}}method-{{color}})"}
            ],
            marker: {
                name : "method",
                end : ""
            }
        },
        "<:>"   : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}method-{{color}})"},
                {name: "marker-start", value: "url(#{{id}}method-l-{{color}})"}
            ],
            marker: {
                name : "method",
                end : "",
                start : "-l"
            }
        },
        "-x"    : {
            attributes : [
                {name: "style", value: "stroke:{{color}}"},
                {name: "marker-end", value: "url(#{{id}}lost-{{color}})"}
            ],
            marker: {
                name : "lost",
                end : ""
            }
        }
    };

    var MARKERPATHS = {
        "signal" : {
            "variants" : [
                {name : "",    path : "M9,3 l-8, 2"},
                {name : "-u",  path : "M9,3 l-8,-2"},
                {name : "-l",  path : "M9,3 l 8, 2"},
                {name : "-lu", path : "M9,3 l 8,-2"}
            ]
        },
        "method" : {
            "variants" : [
                {name : "",   path : "1,1  9,3  1,5"},
                {name : "-l", path : "17,1 9,3 17,5"}
            ]
        },
        "callback" : {
            "variants" : [
                {name : "",  path :  "M 1,1 l 8,2 l-8,2"},
                {name : "-l", path : "M17,1 l-8,2 l 8,2"}
            ]
        },
        "lost" : {
            "variants" : [
                {name : "",  path : "M7,0 l5,6 M7,6 l5,-6"}
            ]
        }
    };


    function getSignalend(pKind, pFrom, pTo){
        if (pFrom && pTo && (["<->", "->"].indexOf(pKind > -1))) {
            return (pFrom < pTo) ? "signal" : "signal-u";
        }
        return "";
    }

    function getSignalstart(pKind, pFrom, pTo){
        if ("<->" === pKind && pFrom <= pTo){
            return "signal-l";
        } else {
            return "signal-lu";
        }
    }

    function _getAttributes(pId, pKind, pLineColor, pFrom, pTo){
        var lRetval = [];

        if (KINDS[pKind] && KINDS[pKind].attributes){
            lRetval = KINDS[pKind].attributes.map(function(pAttribute){
                return {
                    name: pAttribute.name,
                    value: pAttribute.value
                            .replace(/\{\{signal-marker-end\}\}/g, getSignalend(pKind, pFrom, pTo))
                            .replace(/\{\{signal-marker-start\}\}/g, getSignalstart(pKind, pFrom, pTo))
                            .replace(/\{\{id\}\}/g, pId)
                            .replace(/\{\{color\}\}/g, pLineColor || "black")
                };
            });
        }
        return lRetval;
    }

    function makeKindColorCombi (pKind, pColor) {
        return  KINDS[map.getNormalizedKind(pKind)].marker.name +
                (Boolean(pColor) ? " " + pColor : " black");
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
        if (!!pArc.kind && !!KINDS[map.getNormalizedKind(pArc.kind)] &&
            !!(KINDS[map.getNormalizedKind(pArc.kind)].marker) &&
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

    return {
        getAttributes: _getAttributes,

        getMarkerDefs : function (pId, pAST) {
            return _.flatten(extractKindColorCombis(pAST).map(function(pCombi){
                return MARKERPATHS[pCombi.kind].variants.map(function(pVariant){
                    return {
                        name: pId + pCombi.kind + pVariant.name + "-" + pCombi.color,
                        path: pVariant.path,
                        color: pCombi.color,
                        type: pCombi.kind
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
