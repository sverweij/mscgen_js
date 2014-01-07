/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint trailing:true */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./renderutensils"], function(utl) {
    /**
     * sets up a skeleton svg, with the skeleton for rendering an msc ready
     *
     *  desc with id __msc_source - will contain the msc source
     *  defs
     *      a list of markers used as arrow heads (each with an own id)
     *      a stylesheet (without an id)
     *      __defs - placeholder to put the msc elements in
     *  __body - a stack of layers, from bottom to top:
     *      __background    -
     *      __arcspanlayer  - for inline expressions ("arc spanning arcs")
     *      __lifelinelayer - for the lifelines
     *      __sequencelayer - for arcs and associated text
     *      __notelayer     - for notes and boxes - the labels of arcspanning arcs
     *                        will go in here as well
     * @exports renderskeleton
     * @license GPLv3
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */

    var gDocument;

    function setupMarkers(pDefs) {
        var lDefs = pDefs;
        lDefs.appendChild(utl.createMarkerPath("signal", "arrow-marker", "auto", "M 9 3 l -8 2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("signal-u", "arrow-marker", "auto", "M 9 3 l -8 -2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("signal-l", "arrow-marker", "auto", "M 9 3 l 8 2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("signal-lu", "arrow-marker", "auto", "M 9 3 l 8 -2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPolygon("method", "arrow-marker", "auto", "1,1 9,3 1,5", "filled arrow-style"));
        lDefs.appendChild(utl.createMarkerPolygon("method-l", "arrow-marker", "auto", "17,1 9,3 17,5", "filled arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("callback", "arrow-marker", "auto", "M 1 1 l 8 2 l -8 2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("callback-l", "arrow-marker", "auto", "M 17 1 l -8 2 l 8 2", "arrow-style"));
        lDefs.appendChild(utl.createMarkerPath("lost", "arrow-marker", "auto", "M6.5,-0.5 L11.5,5.5 M6.5,5.5 L11.5,-0.5", "arrow-style"));
        return lDefs;
    }

    function setupStyle() {
        var lStyle = gDocument.createElement("style");
        lStyle.setAttribute("type", "text/css");
        lStyle.appendChild(gDocument.createTextNode(gSvgStyleElementString));
        return lStyle;
    }

    function setupSkeletonSvg(pSvgElementId) {
        var lRetVal = gDocument.createElementNS(utl.SVGNS, "svg");
        lRetVal.setAttribute("version", "1.1");
        lRetVal.setAttribute("id", pSvgElementId);
        lRetVal.setAttribute("xmlns", utl.SVGNS);
        lRetVal.setAttribute("xmlns:xlink", utl.XLINKNS);
        return lRetVal;
    }

    function setupDefs() {
        /* definitions - which will include style, markers and an element
         * to put "dynamic" definitions in
         */
        var lDefs = gDocument.createElementNS(utl.SVGNS, "defs");
        lDefs.appendChild(setupStyle(gDocument));
        lDefs = setupMarkers(lDefs);
        lDefs.appendChild(utl.createGroup("__defs"));
        return lDefs;
    }

    function setupDesc() {
        var lDesc = gDocument.createElementNS(utl.SVGNS, "desc");
        lDesc.setAttribute("id", "__msc_source");
        return lDesc;
    }

    function setupBody() {
        var lBody = utl.createGroup("__body");
        lBody.appendChild(utl.createGroup("__background"));
        lBody.appendChild(utl.createGroup("__arcspanlayer"));
        lBody.appendChild(utl.createGroup("__lifelinelayer"));
        lBody.appendChild(utl.createGroup("__sequencelayer"));
        lBody.appendChild(utl.createGroup("__notelayer"));
        return lBody;
    }

    function _init(pWindow) {
        var lDocument;
        if ("object" !== typeof (document)) {
            lDocument = pWindow.document;
        } else {
            lDocument = window.document;
        }
        utl.init(lDocument);
        return lDocument;
    }

    function _bootstrap(pParentElementId, pSvgElementId, pWindow) {

        gDocument = _init(pWindow);

        var lParent = gDocument.getElementById(pParentElementId);
        if (lParent === null) {
            lParent = gDocument.body;
        }
        var lSkeletonSvg = setupSkeletonSvg(pSvgElementId);
        lSkeletonSvg.appendChild(setupDesc());
        lSkeletonSvg.appendChild(setupDefs());
        lSkeletonSvg.appendChild(setupBody());
        lParent.appendChild(lSkeletonSvg);
    }

    var gSvgStyleElementString =
/*jshint multistr:true */
"svg { \
    font-family: Helvetica, sans-serif; \
    font-size: 9pt; \
    background-color: white; \
    stroke : black; \
    color  : black; \
} \
rect { \
    fill: none; \
    stroke: black; \
    stroke-width: 2; \
} \
.bglayer { \
    fill:white; \
    stroke: white; \
    stroke-width: 0; \
} \
rect.textbg { \
    fill:white; \
    stroke:white; \
    stroke-width:0; \
    opacity: 0.9; \
} \
line { \
    stroke: black; \
    stroke-width: 2; \
} \
.arcrowomit { \
    stroke-dasharray: 2,2; \
} \
text { \
    color: inherit; \
    stroke: none; \
    text-anchor: middle; \
} \
text.entity { \
    text-decoration : underline; \
} \
text.anchor-start { \
    text-anchor: start; \
}\
path { \
    stroke: black; \
    color: black; \
    stroke-width: 2; \
    fill: none; \
} \
.dotted {\
    stroke-dasharray: 5,2; \
} \
.striped { \
    stroke-dasharray: 10,5; \
} \
.arrow-marker { \
    overflow:visible; \
} \
.arrow-style { \
    stroke : black; \
    stroke-dasharray : 100,1; /* 'none' should work, but doesn't in webkit */ \
    stroke-width : 1; \
} \
.filled { \
    stroke:inherit; \
    fill:black; /* no-inherit */ \
} \
.arcrowomit { \
    stroke-dasharray: 2,2; \
} \
.box { \
    /* fill: #ffc;  no-inherit */ \
    fill : white; \
    opacity: 0.9; \
} \
.boxtext, .arctext { \
    font-size: 0.8em; \
    text-anchor: middle; \
} \
.comment { \
    stroke-dasharray: 5,2; \
} \
.signal { \
    marker-end : url(#signal); \
} \
.signal-u { \
    marker-end : url(#signal-u); \
} \
.signal-both { \
    marker-end : url(#signal); \
    marker-start : url(#signal-l); \
} \
.signal-both-u { \
    marker-end : url(#signal-u); \
    marker-start : url(#signal-lu); \
} \
.signal-both-self { \
    marker-end : url(#signal-u); \
    marker-start : url(#signal-l); \
} \
.method { \
    marker-end : url(#method); \
} \
.method-both { \
    marker-end : url(#method); \
    marker-start : url(#method-l); \
} \
.returnvalue { \
    stroke-dasharray: 5,2; \
    marker-end : url(#callback); \
} \
.returnvalue-both { \
    stroke-dasharray: 5,2; \
    marker-end : url(#callback); \
    marker-start : url(#callback-l); \
} \
.callback { \
    marker-end : url(#callback); \
} \
.callback-both { \
    marker-end : url(#callback); \
    marker-start : url(#callback-l); \
} \
.emphasised { \
    marker-end : url(#method); \
} \
.emphasised-both { \
    marker-end : url(#method); \
    marker-start : url(#method-l); \
} \
.lost { \
    marker-end : url(#lost); \
} \
.inherit { \
    stroke : inherit; \
    color : inherit; \
} \
.inherit-fill { \
    fill : inherit; \
}";
    return {
        /**
         * Sets up a skeleton svg document with id pSvgElementId in the dom element
         * with id pParentElementId, both in window pWindow. See the module 
         * documentation for details on the structur of the skeleton.
         * 
         * @param {string} pParentElementId
         * @param {string} pSvgElementId
         * @param {window} pWindow 
         */
        bootstrap : function(pParentElementId, pSvgElementId, pWindow) {
            return _bootstrap(pParentElementId, pSvgElementId, pWindow);
        },
        
        /**
         * Initializes the document to the document associated with the 
         * given pWindow and returns it.
         * 
         * @param {window} pWindow
         * @return {document}
         */
        init : function(pWindow) {
            return _init(pWindow);
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