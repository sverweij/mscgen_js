/*
 * based on a regular URL search string, returns an object
 * with the key value pairs
 *
 * e.g. input: "?lang=mscgen&outputformat=png&msc=msc%20%7B%20a%2Cb%2Cc%3B%20a%20%3D%3E%20b%20%5Blabel%3D%22what%20is%20this%3F%22%5D%3B%20b%20%3D%3E%3E%20c%20%5Blabel%3D%22do%20you%20know%3F%22%5D%3B%20c%20%3E%3E%20a%20%5Blabel%3D%22those%20are%20cool%20beans%22%5D%3B%7D"

 * output:
 * {
 *  "lang": "mscgen",
 *  "outputformat": "png",
 *  "msc": "msc { a,b,c; a => b [label=\"what is this?\"]; b =>> c [label=\"do you know?\"]; c >> a [label=\"thos are cool beans\"];}"
 * }
 */
/* jshint undef:true, unused:strict, browser:true, node:true, indent:4 */
/* global unescape: false */

if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    return {
        getParams : function (pSearchString) {
            var lRetval = {};
            if (pSearchString) {
                var lKeyValAry;
                //  search string always starts with a "?" - skip this
                pSearchString.slice(1).split("&").forEach(function(pKeyVal){
                    lKeyValAry = pKeyVal.split("=");
                    if (2 === lKeyValAry.length) {
                        lRetval[lKeyValAry[0]] = unescape(lKeyValAry[1]);
                    }
                });
            }
            return lRetval;
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
