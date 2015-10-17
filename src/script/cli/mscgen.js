// this uses node and jsdom. Better might be to use phantomjs
// which is a browser and as such has good support for svg (bbox...)
// and has rendering to raster graphics out of the box (so no need
// for canvas/ canvg ...
//
// A clean-ish piece of concept code here:
//    https://github.com/cpettitt/dagre-d3-cli
//
// Also a nodejs/ phantomjs bridge exsists:
//    https://github.com/sgentle/phantomjs-node
/* jshint node:true */
var program     = require("commander");
var validations = require("./validations");
var actions     = require("./actions");

var VERSION     = require("../../../package.json").version;

try {
    program
        .version(VERSION)
        .option("-T --output-type <type>", "Output file type. Currently only 'svg'", validations.validType )
        .option("-i --input-from <file>", "File to read from. use - for stdin.")
        .option("-o --output-to <file>", "File to write to. use - for stdout.")
        .option("-p --parser-output", "Print parsed msc output")
        .option("-l --license", "Display license and exit", actions.printLicense)
        .arguments("[infile]")
        .parse(process.argv);
        
        validations.validateArguments(program.args[0], program);
        actions.transform(program.args[0], program);
} catch (e){
    process.stderr.write(e.message);
}

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
