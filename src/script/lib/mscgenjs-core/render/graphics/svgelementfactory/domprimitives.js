/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    var SVGNS   = "http://www.w3.org/2000/svg";
    var XLINKNS = "http://www.w3.org/1999/xlink";

    var gDocument = {};

    function _setAttribute(pObject, pAttribute, pValue) {
        if (Boolean(pValue)){
            pObject.setAttribute(pAttribute, pValue);
        }
        return pObject;
    }

    function _setAttributeNS(pObject, pNS, pAttribute, pValue) {
        if (Boolean(pValue)){
            pObject.setAttributeNS(pNS, pAttribute, pValue);
        }
        return pObject;
    }

    function _setAttributes(pObject, pAttributes) {
        if (pAttributes){
            Object.keys(pAttributes).forEach(function(pKey){
                _setAttribute(pObject, pKey, pAttributes[pKey]);
            });
        }
        return pObject;
    }

    function _setAttributesNS(pObject, pNS, pAttributes) {
        if (pAttributes){
            Object.keys(pAttributes).forEach(function(pKey){
                _setAttributeNS(pObject, pNS, pKey, pAttributes[pKey]);
            });
        }
        return pObject;
    }

    function _createElement(pElementType, pAttributes){
        return _setAttributes(
            gDocument.createElementNS(SVGNS, pElementType),
            pAttributes
        );
    }

    function _createTextNode(pText) {
        return gDocument.createTextNode(pText);
    }

    return {
        SVGNS: SVGNS,
        XLINKNS: XLINKNS,

        /**
         * Function to set the document to use. Introduced to enable use of the
         * rendering utilities under node.js (using the jsdom module)
         *
         * @param {document} pDocument
         */
        init: function(pDocument) {
            gDocument = pDocument;
        },
        /**
         * Takes an element, adds the passed attribute and value to it
         * if the value is truthy and returns the element again
         *
         * @param {element} pElement
         * @param {string} pAttribute
         * @param {string} pValue
         * @return {element}
         */
        setAttribute: _setAttribute,

        /**
         * Takes an element, adds the passed attributes to it if they have
         * a value and returns it.
         *
         * @param {element} pElement
         * @param {object} pAttributes - names/ values object
         * @return {element}
         */
        setAttributes: _setAttributes,

         /**
         * Takes an element, adds the passed attributes to it if they have
         * a value and returns it.
         *
         * @param {element} pElement
         * @param {string} pNS - the namespace to use for the attributes
         * @param {object} pAttributes - names/ values object
         * @return {element}
         */
        setAttributesNS: _setAttributesNS,

        /**
         * creates the element of type pElementType in the SVG namespace,
         * adds the passed pAttributes to it (see setAttributes)
         * and returns the newly created element
         *
         * @param {string} pElementType
         * @param {object} pAttributes - names/ values object
         * @return {element}
         */
        createElement: _createElement,

        /**
         * creates a textNode, initialized with the pText passed
         *
         * @param {string} pText
         * @return {textNode}
         */
        createTextNode: _createTextNode

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
