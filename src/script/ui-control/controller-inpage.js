/* jshint browser:true */
/* global define */

define(["../parse/xuparser", "../parse/msgennyparser", "../render/graphics/renderast", "../render/text/textutensils"], function(mscparser, msgennyparser, msc_render, utl) {
    "use strict";

    var PARENTELEMENTPREFIX = "mscgen_js-parent_";
    var DEFAULT_LANGUAGE = "mscgen";

    start();

    function start() {
        var lMscGenElements = document.getElementsByClassName("mscgen_js");

        for (var i = 0; i < lMscGenElements.length; i++) {
            renderElement(lMscGenElements[i], i);
        }

        lMscGenElements = document.getElementsByTagName("mscgen");

        for (var j = 0; j < lMscGenElements.length; j++) {
            renderElement(lMscGenElements[j], j + i);
        }

    }
    function formatLine(pLine, pLineNo){
        return utl.formatNumber(pLineNo, 3) + " " + pLine; 
    }
    
    function underlineCol(pLine, pCol){
        return pLine.split("").reduce(function(pPrev, pChar, pIndex){
            if (pIndex === pCol) {
                return pPrev + "<span style='text-decoration:underline'>" + pChar + "</span>";
            }
            return pPrev + pChar;
        }, "");
    }

    function renderElement(pElement, pIndex) {
        if (!pElement.hasAttribute('data-renderedby')) {
            var lLanguage = getLanguage(pElement);
            var lAST = getAST(pElement.textContent, lLanguage);
            setElementId(pElement, pIndex);
            pElement.setAttribute("data-renderedby", "mscgen_js");

            if (lAST.entities) {
                render(lAST, pElement.id, pElement.textContent);
            } else {
                pElement.innerHTML = pElement.textContent.split('\n').reduce(function(pPrev, pLine, pIndex) {
                    if (pIndex === (lAST.line - 1)) {
                        return pPrev + "<mark>" + formatLine(underlineCol(pLine, lAST.column - 1), pIndex + 1) + '\n' + "</mark>";
                    }
                    return pPrev + formatLine(pLine, pIndex + 1) + '\n';
                }, "<pre><div style='color: red'># ERROR on line " + lAST.line + ", column " + lAST.column + " - " + lAST.message + "</div>") + "</pre>";
            }
        }
    }

    function setElementId(pElement, pIndex) {
        if ("" === pElement.id || null === pElement.id || undefined === pElement.id) {
            pElement.id = PARENTELEMENTPREFIX + pIndex.toString();
        }
    }

    function getLanguage(pElement) {
        /* the way to do it, but doesn't work in IE: lLanguage = pElement.dataset.language; */
        var lLanguage = pElement.getAttribute('data-language');
        if (undefined === lLanguage || null === lLanguage) {
            lLanguage = DEFAULT_LANGUAGE;
        }
        return lLanguage;
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
