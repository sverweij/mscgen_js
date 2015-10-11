/* jshint node:true, unused:true */
module.exports = (function(){
    "use strict";
    var fs     = require("fs");
    var parser = require ("../parse/xuparser_node");
    var jsdom  = require("jsdom");
    var render = require("../render/graphics/renderast");

    var LICENSE = "\n" + 
    "   mscgen_js - turns text into sequence charts\n" +
    "   Copyright (C) 2015  Sander Verweij\n" +
    "\n" +
    "   This program is free software: you can redistribute it and/or modify\n" +
    "   it under the terms of the GNU General Public License as published by\n" +
    "   the Free Software Foundation, either version 3 of the License, or\n" +
    "   (at your option) any later version.\n" +
    "\n" +
    "   This program is distributed in the hope that it will be useful,\n" +
    "   but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
    "   GNU General Public License for more details.\n" +
    "\n" +
    "   You should have received a copy of the GNU General Public License\n" +
    "   along with this program.  If not, see <http://www.gnu.org/licenses/>.\n\n";

    function getOutStream(pArgument, pOutputTo){
        var lOutputTo = pArgument ? pArgument : pOutputTo;
        if ('-' === lOutputTo){
            return process.stdout;
        } else {
            return fs.createWriteStream(lOutputTo);
        }
    }

    function getInStream(pInputFrom){
        if ('-' === pInputFrom){
            return process.stdin;
        } else {
            return fs.createReadStream(pInputFrom);
        }
    }

    function transformToAST(pInStream, pOutStream, pCallback){
        var lInput = "";

        pInStream.resume();
        pInStream.setEncoding('utf8');

        pInStream.on('data', function(chunk) {
            lInput += chunk;
        });

        pInStream.on('end', function() {
            pOutStream.write(JSON.stringify(parser.parse(lInput), null, "  "));
            pInStream.pause();
            /* istanbul ignore else  */
            if (!!pCallback && 'function' === typeof pCallback){
                pCallback();
            }
        });
    }
    
    function transformToChart(pInStream, pOutStream, pOutputType, pCallback){
        jsdom.env("<html><body></body></html>", function(err, window) {
            var lInput = "";

            pInStream.resume();
            pInStream.setEncoding('utf8');

            pInStream.on('data', function(pChunk) {
                lInput += pChunk;
            });

            pInStream.on('end', function() {
                render.renderAST(parser.parse(lInput), lInput, "__svg", window);
                pOutStream.write(window.document.body.innerHTML);
                pInStream.pause();
                /* istanbul ignore else  */
                if (!!pCallback && 'function' === typeof pCallback){
                    pCallback();
                }
            });
        });
    }

    return {
        transform: function(pArgument, pOptions, pCallback){
            var lOutStream = getOutStream(pArgument, pOptions.outputTo);
            var lInStream  = getInStream(pOptions.inputFrom);
            
            if (pOptions.parserOutput){
                transformToAST(lInStream, lOutStream, pCallback);
            } else {
                transformToChart(lInStream, lOutStream, pOptions.outputType, pCallback);
            }
        },

        printLicense: 
        /* istanbul ignore next  */
            function(){
                process.stdout.write(LICENSE);
                process.exit(0);
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
