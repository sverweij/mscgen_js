/*
 * renders individual elements in sequence charts
 *
 * knows of:
 *  gDocument
 *  linewidth (implicit
 *
 * defines:
 *  defaults for
 *      slope offset on aboxes
 *      fold size on notes
 *      space to use between double lines
 *
 */

/* jshint undef:true */
/* jshint unused:strict */
/* jshint browser:true */
/* jshint node:true */
/* jshint indent:4 */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {

    function _getParams(pSearchString) {
        var lRetval = {};
        if (pSearchString) {
            var lSearchString = pSearchString.slice(1);
            var lKeyVals = lSearchString.split("&");
            var lKeyVal;

            for (var i = 0; i < lKeyVals.length; i++) {
                lKeyVal = lKeyVals[i].split("=");

                if (2 === lKeyVal.length) {
                    lRetval[lKeyVal[0]] = unescape(lKeyVal[1]);
                }
            }
        }
        return lRetval;
    }

    return {
        /*
         * based on a regular URL search string, returns an object
         * with the
         */
        getParams : function(pSearchString) {
            return _getParams(pSearchString);
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
