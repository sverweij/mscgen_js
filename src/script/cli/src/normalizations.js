/* jshint node:true */
module.exports = (function() {
    "use strict";
    var path = require("path");

    /**
     * Given a filename in pString, returns what language is probably
     * contained in that file, judging from the extension (the last dot
     * in the string to end-of-string)
     *
     * When in doubt returns "mscgen"
     *
     * @param {string} pString
     * @return  {string} - language. Possible values: "mscgen", "msgenny", "json".
     */
    function classifyExtension(pString) {
        var lExtMap = {
            "msgenny" : "msgenny",
            "mscgen"  : "mscgen",
            "msc"     : "mscgen",
            "seq"     : "mscgen",
            "mscin"   : "mscgen",
            "xu"      : "xu",
            "json"    : "json",
            "ast"     : "json"
        };
        if (!pString) {
            return "mscgen";
        }

        var lPos = pString.lastIndexOf(".");
        if (lPos > -1) {
            var lExt = pString.slice(lPos + 1);
            if (lExtMap[lExt]) {
                return lExtMap[lExt];
            }
        }

        return "mscgen";
    }

    function deriveOutputFromInput(pInputFrom, pOutputType){
        if (!pInputFrom || '-' === pInputFrom){
            return undefined;
        }
        return path.join(
                    path.dirname(pInputFrom),
                    path.basename(pInputFrom, path.extname(pInputFrom))
                ) .concat('.').concat(pOutputType);
    }

    function determineOutputTo(pOutputTo, pInputFrom, pOutputType){
        return !!pOutputTo ? pOutputTo : deriveOutputFromInput(pInputFrom, pOutputType);
    }

    function determineInputType (pInputType, pInputFrom){
        if (pInputType) {
            return pInputType === 'ast' ? 'json': pInputType;
        }
        return classifyExtension(pInputFrom);
    }

    return {
        normalize: function normalize(pArgument, pOptions){
            pOptions.inputFrom  = !!pArgument ? pArgument : pOptions.inputFrom;
            pOptions.inputType  = determineInputType(pOptions.inputType, pOptions.inputFrom);
            pOptions.outputType = !!pOptions.outputType ? pOptions.outputType : "svg";
            pOptions.outputTo   =
                determineOutputTo(
                    pOptions.outputTo,
                    pOptions.inputFrom,
                    pOptions.outputType
                );
        }
    };
})();
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
