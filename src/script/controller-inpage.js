/* jshint browser:true */
/* global define */

define(["xuparser", "msgennyparser", "renderast"], function(mscparser, msgennyparser, msc_render) {
    var PARENTELEMENTPREFIX = "mscgen_js$parent_";
    var DEFAULT_LANGUAGE = "mscgen";

    start();

    function start() {
        // !("yes" === navigator.doNotTrack)
        var lMscGenElements = document.getElementsByClassName("mscgen_js");
        var lAST;
        var lLanguage;

        for (var i = 0; i < lMscGenElements.length; i++) {
            if ("" === lMscGenElements[i].id || null === lMscGenElements[i].id || undefined === lMscGenElements[i].id) {
                lMscGenElements[i].id = PARENTELEMENTPREFIX + i.toString();
            }
            /* the way to do it, but doesn't work in IE: lLanguage = lMscGenElements[i].dataset.language; */
            lLanguage = lMscGenElements[i].getAttribute('data-language');
            if (undefined === lLanguage || null === lLanguage) {
                lLanguage = DEFAULT_LANGUAGE;
            }
            lAST = getAST(lMscGenElements[i].textContent, lLanguage);
            if (lAST.entities) {
                render(lAST, lMscGenElements[i].id, lMscGenElements[i].textContent);
            } else {
                lMscGenElements[i].innerHTML += "<div style='color: red'>ERROR: line " + lAST.line + ", column " + lAST.column + ": " + lAST.message + "</div>";
            }
        }
    }

    function getAST(pText, pLanguage) {
        var lAST = {};
        try {
            if ("msgenny" === pLanguage) {
                lAST = msgennyparser.parse(pText);
            } else if ("json" === pLanguage) {
                lAST = JSON.parse(pText);
            } else if ("xu" === pLanguage) {
                lAST = mscparser.parse(pText);
            } else {
                lAST = mscparser.parse(pText);
            }
        } catch(e) {
            return e;
        }
        return lAST;
    }

    function render(pAST, pElement, pText) {
        document.getElementById(pElement).innerHTML = "";
        msc_render.clean(pElement, window);
        msc_render.renderAST(pAST, pText, pElement, window);
    }

});
// define
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