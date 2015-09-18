/*
 * generates to stdout:
 * - all amd and commonjs dependencies in the src/script tree
 * - a (flat) list of all (js) sources involved in embedding ('mscgen-inpage.js')
 * - a (flat) list of all (js) sources involved in embedding ('mscgen-interpreter.js')
 */
/* jshint indent:4 */
/* jshint node:true */
/* jshint strict:false */

var path = require('path');
var madge = require('madge');

function sourcyfy(pString){
    return path.join("src/script/", pString + ".js");
}

function cmpFn (pOne, pTwo){
    return pOne.localeCompare(pTwo);
}

function getFlatDepString (pStartDeps, pDepAry, pResultDeps){
    pStartDeps.forEach(function(pDep){
        if (pResultDeps.indexOf(pDep) < 0) {
            pResultDeps.push(pDep);
        }
        if(!!(pDepAry[pDep]) && pDepAry[pDep].length > 0 ){
            pResultDeps = getFlatDepString(pDepAry[pDep], pDepAry, pResultDeps);
        }
    });
    return pResultDeps;
}

function getDepString(pArray, pStartWith){
    return pArray.sort(cmpFn).reduce(function(pSum, pDep){
        return pSum + " \\\n\t" + sourcyfy(pDep);
    }, sourcyfy(pStartWith) + ":");
}

function getDeps(pFormat){
    var lDeps = madge(["src/script"], {format: pFormat}).tree;

    return Object.keys(lDeps)
            .filter(function(pDep){
                return lDeps[pDep].length > 0;
            })
            .reduce(function(pSum, pDep){
                return pSum + getDepString(lDeps[pDep], pDep) + "\n\n";
            }, "");
}

function getFlatDeps(pStartWith, pVariableName){
    var lDeps = madge(["src/script"], {format: "amd"}).tree;

    return getFlatDepString (lDeps[pStartWith], lDeps,[]).reduce(function(pSum, pDep){
            return pSum + " \\\n\t" + sourcyfy(pDep);
        }, pVariableName + "=" + sourcyfy(pStartWith)) + "\n\n";
}

process.stdout.write("# To re-generate its contents run 'make depend'\n\n");

process.stdout.write("# all js needed for mscgen embedding (mscgen-inpage.js)\n");
process.stdout.write(getFlatDeps("mscgen-inpage", "EMBED_JS_SOURCES"));

process.stdout.write("# all js needed for online interpreter (mscgen-interpreter.js)\n");
process.stdout.write(getFlatDeps("mscgen-interpreter", "INTERPRETER_JS_SOURCES"));

process.stdout.write("# amd dependencies\n");
process.stdout.write(getDeps("amd"));

process.stdout.write("# commonJS dependencies\n");
process.stdout.write(getDeps("cjs"));

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
