/* jshint undef:true, unused:strict, browser:false, node:true, indent:4 */
/*
 * Note: there will be a moment when using a real library (like lodash,
 * underscore or ramda) will be more beneficial than these local
 * implementations.
 *
 * the function names are chosen in such a fashion that drop-in replacement
 * with lodash is possible. Why we don't do that (yet): lodash is relativvely
 * big and there is no customized build for AMD (yet)
 */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([], function() {
    "use strict";

    function has (obj, key) {
        return obj !== null && hasOwnProperty.call(obj, key);
    }

    return {
        /*
         * returns an non-nested array from a nested array
         * only does one level of nesting
         * so [[a,b], [c,d,e]] -> [a,b,c,d,e]
         */
        flatten : function flatten(pArray){
            var lRetval = [];
            return lRetval.concat.apply(lRetval, pArray);
        },
        /*
         * returns a "deep copy" of an object.
         * (uses stringify, so it is limited to objects that
         * survive stringification roundtrips)
         */
        cloneDeep : function cloneDeep(pObject) {
            return JSON.parse(JSON.stringify(pObject));
        },

        /*
         * Caches the called function
         */
        memoize : function memoize(pFunction) {
            var lMemoize = function(pKey) {
                var lCache = lMemoize.lCache;
                var lAddress = '' + pKey;
                if (!has(lCache, lAddress)) {
                    lCache[lAddress] = pFunction.apply(this, arguments);
                }
                return lCache[lAddress];
            };
            lMemoize.lCache = {};
            return lMemoize;
        },
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
