/* jshint node:true */
module.exports = (function(){
    "use strict";
    var fs            = require("fs");
    var VALID_TYPE_RE = /^(svg|png|eps)$/;
    
    function isStdout (pFilename) {
        return '-' === pFilename;
    }

    function outputIsSpecified (pArgument, pOutputTo){
        return !!pArgument || !!pOutputTo;
    }

    function fileExists (pFilename) {
        try {
            if (!isStdout(pFilename)){
                fs.accessSync(pFilename,fs.R_OK);
            }
            return true;
        } catch (e){
            return false;
        }
    }

    return {
        validType: function (pType){
            if (pType.match(VALID_TYPE_RE)){
                return pType;
            }
            throw Error("\n  error: '" + pType + "' is not a valid output type. mscgen_js can only emit svg.\n\n");
        },

        validateArguments: function (pArgument, pOptions){
            if (!outputIsSpecified(pArgument, pOptions.outputTo)){
                throw Error ("\n  error: Please specify an output file.\n\n");
            }
            if (!pOptions.inputFrom){
                throw Error("\n  error: Please specify an input file\n\n");
            }
            if (!fileExists(pOptions.inputFrom)){
                throw Error("\n  error: Failed to open input file '" + pOptions.inputFrom + "'\n\n");
            }
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
