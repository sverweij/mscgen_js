/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";
    var INNERELEMENTPREFIX = "mscgen_js-svg-";

    var gInnerElementId = INNERELEMENTPREFIX;

    return {
        setPrefix: function (pPrefix){
            gInnerElementId = INNERELEMENTPREFIX + pPrefix;
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
