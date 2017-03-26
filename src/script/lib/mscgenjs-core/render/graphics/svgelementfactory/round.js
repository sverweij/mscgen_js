/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function() {
    "use strict";

    /**
     * Rounds pNumber to pPrecision numbers after the decimal separator
     *
     * e.g.:
     * - round(3.141592653589, 3) === 3.142
     * - round(2.7, 0) === round(2.7) === 3
     * - round(2.7, 10) === 2.7
     * - round(14.00000001, 2) === 14
     *
     * @param  {number} pNumber     The number to round
     * @param  {integer} pPrecision The number of decimals to keep. Optional.
     *                              Defaults to 0
     * @return number               The rounded number
     */
    return function (pNumber, pPrecision){
        return pPrecision
            ? Math.round(pNumber * Math.pow(10, pPrecision), pPrecision) / Math.pow(10, pPrecision)
            : Math.round(pNumber);
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
