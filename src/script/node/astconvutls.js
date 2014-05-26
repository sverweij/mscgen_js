/*
 * takes an abstract syntax tree for a message sequence chart and renders it
 * as an mscgen program.
 */

/* jshint node:true */
/* jshint undef:true */
/* jshint unused:strict */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    
    function _renderEntityName(pString) {
        function isQuoatable(pString) {
            var lMatchResult = pString.match(/[a-z0-9]+/gi);
            if (lMatchResult && lMatchResult !== null) {
                return lMatchResult.length != 1;
            } else {
                return true;
            }
        }

        return isQuoatable(pString) ? "\"" + pString + "\"" : pString;
    }

    function _renderComments(pArray) {
        var lRetval = "";
        for (var i = 0; i < pArray.length; i++) {
            lRetval += pArray[i] + "\n";
            /* no use of EOL here */
        }
        return lRetval;
    }

    function renderString(pString) {
        return pString.replace(/\\\"/g, "\"").replace(/\"/g, "\\\"");
    }

    function _pushAttribute(pArray, pAttr, pString) {
        if (pAttr) {
            pArray.push(pString + "=\"" + renderString(pAttr) + "\"");
        }
    }

    return {
        renderEntityName : function(pString) {
            return _renderEntityName(pString);
        },
        renderComments : function(pArray) {
            return _renderComments(pArray);
        },
        pushAttribute : function(pArray, pAttr, pString) {
            return _pushAttribute(pArray, pAttr, pString);
        }
    };
});
