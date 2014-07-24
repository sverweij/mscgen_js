/*
 * Reads an abstract syntax tree from stdin and writes the corresponding
 * scalable vector graphic to stdout
 * 
 * Useful in combination with e.g. genny2ast.js, msc2ast.js or genrandomast.js:
 *     node genrandomast.js | node mscgen_js_cli.js > renderedchart.svg
 *     node msc2ast.js < mychart.msc | node mscgen_js_cli.js > mychart_rendered.svg 
 */

var jsdom = require('jsdom');
var renderast = require('../render/graphics/renderast');

jsdom.env("<html><body></body></html>", function(err, window) {
    var gInput = "";
    
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function(pChunk) {
        gInput += pChunk;
    });
    process.stdin.on('end', function() {
        var lAST = JSON.parse(gInput);
        renderast.renderAST(lAST, JSON.stringify(lAST, null, " "), "__svg", window);
        process.stdout.write(window.document.body.innerHTML);
        process.stdin.pause();
    });

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
