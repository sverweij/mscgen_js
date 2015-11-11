/* jshint undef:true, unused:strict, browser:false, node:true, indent:4 */
/*
 * Note: there will be a moment when using a real library (like lodash,
 * underscore or ramda) will be more beneficial than these local
 * implementations.
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

    function swap (pPair, pA, pB){
        var lTmp = pPair[pA];
        pPair[pA] = pPair[pB];
        pPair[pB] = lTmp;
    }

    return {
        /*
         * returns an non-nested array from a nested array
         * only does one level of nesting
         * so [[a,b], [c,d,e]] -> [a,b,c,d,e]
         */
        flatten : function (pArray){
            var lRetval = [];
            return lRetval.concat.apply(lRetval, pArray);
        },
        /*
         * returns a "deep copy" of an object.
         * (uses stringify, so it is limited to objects that
         * survive stringification roundtrips)
         *
         * utility function.
         */
        clone: function clone(pObject) {
            return JSON.parse(JSON.stringify(pObject));
        },

        /*
         * Caches the called function
         */
        memoize : function(pFunction) {
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

        /**
         * swaps the values of the attributes "from" and "two"
         * in the pPair object with each other
         */
        swapfromto : function (pPair){
            swap(pPair, "from", "to");
        },

        /**
         * returns true if pString equals "1", "true", "y", "yes" or "on"
         * ... false in all other cases
         * @param {string} pString
         * @return {boolean}
         */
        sanitizeBooleanesque: function(pString){
            return (["1", "true", "y", "yes", "on"].indexOf(pString) > -1);
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
