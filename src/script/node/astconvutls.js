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
            lRetval += pArray[i]; // not using EOL constant here is intentional
        }
        return lRetval;
    }

    function renderString(pString) {
        return pString.replace(/\\\"/g, "\"").replace(/\"/g, "\\\"");
    }

    return {
        renderEntityName : function(pString) {
            return _renderEntityName(pString);
        },
        renderComments : function(pArray) {
            return _renderComments(pArray);
        },
        renderString : function(pString) {
            return renderString(pString);
        }
    };
});
