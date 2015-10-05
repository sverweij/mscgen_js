var program     = require("commander");
var validations = require("./mscgen_cli/validations");
var actions     = require("./mscgen_cli/actions");

var VERSION     = require("../../../package.json").version;

try {
    program
        .version(VERSION)
        .option("-T --output-type <type>", "Output file type. Currently only 'svg'", validations.validType )
        .option("-i --input-from <file>", "File to read from. use - for stdin.", validations.fileExists)
        .option("-o --output-to <file>", "File to write to. use - for stdout.")
        .option("-p --parser-output", "Print parsed msc output")
        .option("-l --license", "Display license and exit", actions.printLicense)
        .arguments("[infile]")
        .parse(process.argv);
        
        console.log(JSON.stringify(program, null, " "));
} catch (e){
    process.stderr.write(e.message);
}
// if (!!program.args[0]||!!program.options.inputFrom||!!program.options.license){
//     process.stdout.write("jeeeee!" + "\n");
// } else {
//     // program.help();
    // console.log(JSON.stringify(program, null, " "));
// }
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
