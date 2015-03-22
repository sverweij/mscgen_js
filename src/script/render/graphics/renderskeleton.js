/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint trailing:true */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgutensils", "./constants"], function(utl, C) {
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
     *      __watermark     - the watermark. Contra-intuitively this one
     *                        goes on top.
     * @exports renderskeleton
     * @author {@link https://github.com/sverweij | Sander Verweij}
     */
    "use strict";

    var gDocument;

    function setupMarker (pDefs, pId, pPath){
        pDefs.appendChild(utl.createMarkerPath(pId, pPath));
    }

    function setupMarkerPolygon (pDefs, pId, pPoints){
        pDefs.appendChild(utl.createMarkerPolygon(pId, pPoints));
    }

    function setupMarkers(pDefs, pElementId) {
        setupMarker(pDefs, pElementId + "signal", "M 9 3 l -8 2");
        setupMarker(pDefs, pElementId + "signal-u", "M 9 3 l -8 -2");
        setupMarker(pDefs, pElementId + "signal-l", "M 9 3 l 8 2");
        setupMarker(pDefs, pElementId + "signal-lu", "M 9 3 l 8 -2");

        setupMarkerPolygon(pDefs, pElementId + "method", "1,1 9,3 1,5");
        setupMarkerPolygon(pDefs, pElementId + "method-l", "17,1 9,3 17,5");

        setupMarker(pDefs, pElementId + "callback", "M 1 1 l 8 2 l -8 2");
        setupMarker(pDefs, pElementId + "callback-l", "M 17 1 l -8 2 l 8 2");
        setupMarker(pDefs, pElementId + "lost", "M6.5,-0.5 L11.5,5.5 M6.5,5.5 L11.5,-0.5");
        return pDefs;
    }

    function setupStyle(pElementId) {
        var lStyle = gDocument.createElement("style");
        lStyle.setAttribute("type", "text/css");
        lStyle.appendChild(gDocument.createTextNode(setupStyleElement(pElementId)));
        return lStyle;
    }

    function setupSkeletonSvg(pSvgElementId) {
        var lRetVal = gDocument.createElementNS(C.SVGNS, "svg");
        lRetVal.setAttribute("version", "1.1");
        lRetVal.setAttribute("id", pSvgElementId);
        lRetVal.setAttribute("xmlns", C.SVGNS);
        lRetVal.setAttribute("xmlns:xlink", C.XLINKNS);
        return lRetVal;
    }

    function setupDefs(pElementId) {
        /* definitions - which will include style, markers and an element
         * to put "dynamic" definitions in
         */
        var lDefs = gDocument.createElementNS(C.SVGNS, "defs");
        lDefs.appendChild(setupStyle(pElementId));
        lDefs = setupMarkers(lDefs, pElementId);
        lDefs.appendChild(utl.createGroup(pElementId + "__defs"));
        return lDefs;
    }

    function setupDesc(pElementId) {
        var lDesc = gDocument.createElementNS(C.SVGNS, "desc");
        lDesc.setAttribute("id", pElementId + "__msc_source");
        return lDesc;
    }

    function setupBody(pElementId) {
        var lBody = utl.createGroup(pElementId + "__body");

        lBody.appendChild(utl.createGroup(pElementId + "__background"));
        lBody.appendChild(utl.createGroup(pElementId + "__arcspanlayer"));
        lBody.appendChild(utl.createGroup(pElementId + "__lifelinelayer"));
        lBody.appendChild(utl.createGroup(pElementId + "__sequencelayer"));
        lBody.appendChild(utl.createGroup(pElementId + "__notelayer"));
        lBody.appendChild(utl.createGroup(pElementId + "__watermark"));
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
        lSkeletonSvg.appendChild(setupDesc(pSvgElementId));
        lSkeletonSvg.appendChild(setupDefs(pSvgElementId));
        lSkeletonSvg.appendChild(setupBody(pSvgElementId));
        lParent.appendChild(lSkeletonSvg);

        return gDocument;
    }

    function setupStyleElement(pElementId) {
/*jshint multistr:true */
/* jshint -W030 */ /* jshint -W033 */
/*
 * a note on the marker ends:
 * - the reference to the marker ends/ ids of the marker ends should be
 *   unique _across svgs_ (otherwise removing/ hiding an earlier or
 *   later svg will make all marker ends go away from all other svgs
 *   within the same html document).
 * - the class names for the marker names can - in theory - be
 *   the same accross the svgs, they should just be "fenced" so the
 *   class definitions in the nth svg don't overwrite the class definitions
 *   of the 1 to (n-1)th svgs:
 *   #someuniqueidforthesvg .signal { ...
 * - canvg does not (yet?) handle these fenced classes at the moment,
 *   so instead we prefix the class names (and made sure the graphical
 *   renderer uses the same for these).
 *   .someuniqueidforthesvgsignal { ...
 */
        return "svg{\
  font-family:Helvetica,sans-serif;\
  font-size:9pt;\
  font-weight:normal;\
  font-style:normal;\
  text-decoration:none;\
  background-color:white;\
  stroke:black;\
  color:black;\
}\
rect{\
  fill:none;\
  stroke:black;\
  stroke-width: 2;\
}\
.bglayer{\
  fill:white;\
  stroke:white;\
  stroke-width:0;\
}\
rect.textbg{\
  fill:white;\
  stroke:white;\
  stroke-width:0;\
  opacity:0.9;\
}\
line{\
  stroke:black;\
  stroke-width:2;\
}\
.arcrowomit{\
  stroke-dasharray:2,2;\
}\
text{\
  color:inherit;\
  stroke:none;\
  text-anchor:middle;\
}\
text.entity{\
  text-decoration:underline;\
}\
text.anchor-start{\
  text-anchor:start;\
}\
path{\
  stroke:black;\
  color:black;\
  stroke-width:2;\
  fill:none;\
}\
.dotted{\
  stroke-dasharray:5,2;\
}\
.striped{\
  stroke-dasharray:10,5;\
}\
.arrow-marker{\
  overflow:visible;\
}\
.arrow-style{\
  stroke:black;\
  stroke-dasharray:100,1; /* 'none' should work, but doesn't in webkit */\
  stroke-width:1;\
}\
.filled{\
  stroke:inherit;\
  fill:black; /* no-inherit */\
}\
.arcrowomit{\
  stroke-dasharray:2,2;\
}\
.box{\
  /* fill: #ffc;  no-inherit */\
  fill:white;\
  opacity:0.9;\
}\
.boxtext, .arctext{\
  font-size:0.8em;\
  text-anchor:middle;\
}\
.comment{\
  stroke-dasharray:5,2;\
}\
 ." + pElementId + "signal{\
  marker-end:url(#" + pElementId + "signal);\
}\
 ." + pElementId + "signal-u{\
  marker-end:url(#" + pElementId + "signal-u);\
}\
 ." + pElementId + "signal-both{\
  marker-end:url(#" + pElementId + "signal);\
  marker-start:url(#" + pElementId + "signal-l);\
}\
 ." + pElementId + "signal-both-u{\
  marker-end:url(#" + pElementId + "signal-u);\
  marker-start:url(#" + pElementId + "signal-lu);\
}\
 ." + pElementId + "signal-both-self{\
  marker-end:url(#" + pElementId + "signal-u);\
  marker-start:url(#" + pElementId + "signal-l);\
}\
 ." + pElementId + "method{\
  marker-end:url(#" + pElementId + "method);\
}\
 ." + pElementId + "method-both{\
  marker-end:url(#" + pElementId + "method);\
  marker-start:url(#" + pElementId + "method-l);\
}\
 ." + pElementId + "returnvalue{\
  stroke-dasharray:5,2;\
  marker-end:url(#" + pElementId + "callback);\
}\
 ." + pElementId + "returnvalue-both{\
  stroke-dasharray:5,2;\
  marker-end:url(#" + pElementId + "callback);\
  marker-start:url(#" + pElementId + "callback-l);\
}\
 ." + pElementId + "callback{\
  marker-end:url(#" + pElementId + "callback);\
}\
 ." + pElementId + "callback-both{\
  marker-end:url(#" + pElementId + "callback);\
  marker-start:url(#" + pElementId + "callback-l);\
}\
 ." + pElementId + "emphasised{\
  marker-end:url(#" + pElementId + "method);\
}\
 ." + pElementId + "emphasised-both{\
  marker-end:url(#" + pElementId + "method);\
  marker-start:url(#" + pElementId + "method-l);\
}\
 ." + pElementId + "lost{\
  marker-end:url(#" + pElementId + "lost);\
}\
 .inherit{\
  stroke:inherit;\
  color:inherit;\
}\
 .inherit-fill{\
  fill:inherit;\
}\
.watermark{\
  stroke:black;\
  color:black;\
  fill:black;\
  font-size: 48pt;\
  font-weight:bold;\
  opacity:0.14;}";
/* jshint +W030 */ /* jshint +W033 */
    }
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
        bootstrap : _bootstrap,

        /**
         * Initializes the document to the document associated with the
         * given pWindow and returns it.
         *
         * @param {window} pWindow
         * @return {document}
         */
        init : _init

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
