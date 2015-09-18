/*
 * takes a simplified message sequence chart program and translates
 * to an mscgen program
 */
/* jshint indent:4 */
/* jshint node:true */
/* jshint strict: false */
var path = require('path');
var madge = require('madge');

function sourcyfy(pString){
    return path.join("src/script/", pString + ".js");
}

function cmpFn (pOne, pTwo){
    "use strict";
    return pOne.localeCompare(pTwo);
}

function getFlattenedDeps (pStartDeps, pDepAry, pMagic){
    "use strict";
    
    pStartDeps.forEach(function(pDep){
        if (pMagic.indexOf(pDep) < 0) {
            pMagic.push(pDep);
        }
        if(!!(pDepAry[pDep]) && pDepAry[pDep].length > 0 ){
            pMagic = getFlattenedDeps(pDepAry[pDep], pDepAry, pMagic);
        }
    });
    return pMagic;
}

function getDepList(pArray, pStartWith){
    return pArray.sort(cmpFn).reduce(function(pSum, pDep){
        return pSum + " \\\n\t" + sourcyfy(pDep);
    }, sourcyfy(pStartWith) + ":");
}

function printDeps(pFormat){
    var lDeps = madge(["src/script"], {format: pFormat}).tree;
    process.stdout.write(
        Object.keys(lDeps)
            .filter(function(pDep){
                return lDeps[pDep].length > 0;
            })
            .reduce(function(pSum, pDep){
                return pSum + getDepList(lDeps[pDep], pDep) + "\n\n";
            }, "")
    );
}

function printFlatSourceList(pStartWith, pVariableName){
    var lMadge = madge(["src/script"], {format: "amd"});
    var lDeps = lMadge.tree;
    
    process.stdout.write(
        getFlattenedDeps (lDeps[pStartWith], lDeps,[]).reduce(function(pSum, pDep){
            return pSum + " \\\n\t" + sourcyfy(pDep);
        }, pVariableName + "=" + sourcyfy(pStartWith)) + "\n\n"
    );
}

process.stdout.write("# To re-generate its contents run 'make depend'\n\n");

process.stdout.write("# all js needed for mscgen embedding (mscgen-inpage.js)\n");
printFlatSourceList("mscgen-inpage", "EMBED_JS_SOURCES");

process.stdout.write("# all js needed for online interpreter (mscgen-interpreter.js)\n");
printFlatSourceList("mscgen-interpreter", "INTERPRETER_JS_SOURCES");

process.stdout.write("# amd dependencies\n");
printDeps("amd");

process.stdout.write("# commonJS dependencies\n");
printDeps("cjs");

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
