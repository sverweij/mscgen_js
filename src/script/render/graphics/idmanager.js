/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    var INNERELEMENTPREFIX = "mscgen_js-svg-";

    var gInnerElementId = INNERELEMENTPREFIX;

    return {
        setPrefix: function (pId){
            gInnerElementId = pId;
        },
        get: function(pElementIdentifierString) {
            if (pElementIdentifierString){
                return gInnerElementId + pElementIdentifierString;
            } else {
                return gInnerElementId;
            }
        }
    };
});
