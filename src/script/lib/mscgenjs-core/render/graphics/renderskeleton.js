/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint trailing:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./svgelementfactory", "./constants"], function(fact, C) {
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

    function setupMarkers(pDefs, pMarkerDefs) {
        pMarkerDefs.forEach(function(pMarker){
            if (pMarker.type === "method"){
                pDefs.appendChild(fact.createMarkerPolygon(pMarker.name, pMarker.path, pMarker.color));
            } else {
                pDefs.appendChild(fact.createMarkerPath(pMarker.name, pMarker.path, pMarker.color));
            }
        });
        return pDefs;
    }

    function setupStyle() {
        var lStyle = gDocument.createElement("style");
        lStyle.setAttribute("type", "text/css");
        lStyle.appendChild(gDocument.createTextNode(setupStyleElement()));
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

    function setupDefs(pElementId, pMarkerDefs) {
        /* definitions - which will include style, markers and an element
         * to put "dynamic" definitions in
         */
        var lDefs = gDocument.createElementNS(C.SVGNS, "defs");
        lDefs.appendChild(setupStyle());
        lDefs = setupMarkers(lDefs, pMarkerDefs);
        lDefs.appendChild(fact.createGroup(pElementId + "__defs"));
        return lDefs;
    }

    function setupDesc(pElementId) {
        var lDesc = gDocument.createElementNS(C.SVGNS, "desc");
        lDesc.setAttribute("id", pElementId + "__msc_source");
        return lDesc;
    }

    function setupBody(pElementId) {
        var lBody = fact.createGroup(pElementId + "__body");

        lBody.appendChild(fact.createGroup(pElementId + "__background"));
        lBody.appendChild(fact.createGroup(pElementId + "__arcspanlayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__lifelinelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__sequencelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__notelayer"));
        lBody.appendChild(fact.createGroup(pElementId + "__watermark"));
        return lBody;
    }

    function _init(pWindow) {
        fact.init(pWindow.document);
        return pWindow.document;
    }

    function _bootstrap(pParentElementId, pSvgElementId, pMarkerDefs, pWindow) {

        gDocument = _init(pWindow);

        var lParent = gDocument.getElementById(pParentElementId);
        if (lParent === null) {
            lParent = gDocument.body;
        }
        var lSkeletonSvg = setupSkeletonSvg(pSvgElementId);
        lSkeletonSvg.appendChild(setupDesc(pSvgElementId));
        lSkeletonSvg.appendChild(setupDefs(pSvgElementId, pMarkerDefs));
        lSkeletonSvg.appendChild(setupBody(pSvgElementId));
        lParent.appendChild(lSkeletonSvg);

        return gDocument;
    }

    function setupStyleElement() {
/*jshint multistr:true */
/* jshint -W030 */ /* jshint -W033 */
        return "svg{\
  font-family:Helvetica,sans-serif;\
  font-size:" + C.FONT_SIZE + "px;\
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
  stroke-width:"+ C.LINE_WIDTH + ";\
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
}\
line{\
  stroke:black;\
  stroke-width:"+ C.LINE_WIDTH + ";\
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
  stroke-width:"+ C.LINE_WIDTH + ";\
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
  stroke-width:1;\
}\
.arcrowomit{\
  stroke-dasharray:2,2;\
}\
.box{\
  /* fill: #ffc;  no-inherit */\
  fill:white;\
}\
.comment{\
  stroke-dasharray:5,2;\
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
         * documentation for details on the structure of the skeleton.
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
