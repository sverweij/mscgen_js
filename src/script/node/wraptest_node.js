/* 
 * reads a mscgen program from input, parses it and (standardly
 * formatted) outputs it again
 */
/* jshint indent:4 */
/* jshint node:true */

var txt = require ("./textutensils");

var gInput = "";

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    gInput += chunk;
});

process.stdin.on('end', function() {
    var lWrappedAry = txt.wrap(gInput, 20);
    for (var i =0; i< lWrappedAry.length; i++ ){
        process.stdout.write(lWrappedAry[i]);
        process.stdout.write('\n');
    }
    process.stdin.pause();
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
