/* jshint node:true, esnext:true */
module.exports = (function() {
    "use strict";
    var fs              = require("fs");
    const VALID_OUTPUT_TYPE_RE = /^(svg|png|jpeg|mscgen|msgenny|xu|dot|doxygen)$/;
    const VALID_INPUT_TYPE_RE = /^(mscgen|xu|msgenny|ast|json)$/;

    function isStdout(pFilename) {
        return "-" === pFilename;
    }

    function fileExists(pFilename) {
        try {
            if (!isStdout(pFilename)) {
                fs.accessSync(pFilename, fs.R_OK);
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        validOutputType: function(pType) {
            if (pType.match(VALID_OUTPUT_TYPE_RE)) {
                return pType;
            }

            throw Error(
                "\n  error: '" + pType + "' is not a valid output type. mscgen_js can emit:" +
                "\n         - the grapics formats svg, jpeg and png" +
                "\n         - the text formats dot, doxygen, mscgen, msgenny and xu.\n\n"
            );
        },

        validInputType: function(pType) {
            if (pType.match(VALID_INPUT_TYPE_RE)) {
                return pType;
            }

            throw Error(
                "\n  error: '" + pType + "' is not a valid input type." +
                "\n         mscgen_js can read mscgen, msgenny, xu and ast\n\n");
        },

        validateArguments: function(pOptions) {
            if (!pOptions.inputFrom) {
                throw Error("\n  error: Please specify an input file.\n\n");
            }

            if (!pOptions.outputTo) {
                throw Error("\n  error: Please specify an output file.\n\n");
            }

            if (!fileExists(pOptions.inputFrom)) {
                throw Error("\n  error: Failed to open input file '" + pOptions.inputFrom + "'\n\n");
            }

            if (
                (['svg', 'png', 'jpeg'].indexOf(pOptions.outputType) > -1) &&
                (pOptions.outputTo === '-')
            ){
                throw Error(
                    "\n  error: mscgen_js cli can't stream graphics formats to stdout yet." +
                    "\n         It does support output to files, so if you provide a filename" +
                    "\n         instead of '-' all will be hunky-dory\n\n"
                );
            }
        },
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
