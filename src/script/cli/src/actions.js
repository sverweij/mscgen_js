/* jshint node:true, unused:true, esnext: true */
module.exports = (function() {
    "use strict";
    var fs        = require("fs");
    var mscgenjs  = require("../../core");

    const GRAPHICSFORMATS = ['svg', 'png', 'jpeg'];
    const LICENSE = "\n" +
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

    function getOutStream(pOutputTo) {
        if ("-" === pOutputTo) {
            return process.stdout;
        } else {
            return fs.createWriteStream(pOutputTo);
        }
    }

    function getInStream(pInputFrom) {
        if ("-" === pInputFrom) {
            return process.stdin;
        } else {
            return fs.createReadStream(pInputFrom);
        }
    }

    function renderGraphics(pAST, pInput, pOutputTo, pOutputType, pCallback){
        var childProcess = require('child_process');
        var path         = require('path');
        var phantomjs    = require('phantomjs');
        var binPath      = phantomjs.path;
        var args         = [];

        if ('svg' === pOutputType){
            args.push(path.join(__dirname, '.', 'cli-phantom-vector.js'));
        } else {
            args.push(path.join(__dirname, '.', 'cli-phantom.js'));
        }
        args.push(path.join(__dirname, '.', 'cli-phantom.html'));
        args.push(JSON.stringify(pAST, null, ''));
        args.push(pOutputType);
        args.push(pOutputTo);
        args.push(pInput);

        childProcess.execFile(binPath, args, function(pErr, pStdout, pStderr) {
            if (pStdout) {
                process.stdout.write(pStdout);
            }
            if (pStderr) {
                process.stderr.write(pStderr);
            }
            /* istanbul ignore else  */
            if (!!pCallback && "function" === typeof pCallback) {
                pCallback();
            }
        });
    }

    function renderText(pAST, pOutStream, pOutputType, pCallback){
        pOutStream.write(
            mscgenjs.getTextRenderer(pOutputType).render(pAST),
            pCallback
        );
    }

    function transform(pInStream, pOutStream, pOptions, pCallback){
        var lInput = "";

        pInStream.resume();
        pInStream.setEncoding("utf8");

        pInStream.on("data", function(pChunk) {
            lInput += pChunk;
        });

        pInStream.on("end", function() {
            pInStream.pause();
            var lAST = 'json' === pOptions.inputType ?
                JSON.parse(lInput) :
                mscgenjs.getParser(pOptions.inputType).parse(lInput);
            render(lAST, lInput, pOutStream, pOptions, pCallback);
        });
    }

    function render(pAST, pInput, pOutStream, pOptions, pCallback) {
        if (pOptions.parserOutput){
            pOutStream.write(JSON.stringify(pAST, null, "  "), pCallback);
        } else if (GRAPHICSFORMATS.indexOf(pOptions.outputType) > -1) {
            renderGraphics (pAST, pInput, pOptions.outputTo, pOptions.outputType, pCallback);
        } else {
            renderText (pAST, pOutStream, pOptions.outputType, pCallback);
        }
    }

    return {
        transform: function(pOptions, pCallback) {
            transform(
                getInStream(pOptions.inputFrom),
                getOutStream(pOptions.outputTo),
                pOptions,
                pCallback
            );
        },

        printLicense:
        /* istanbul ignore next  */
            function() {
                process.stdout.write(LICENSE);
                process.exit(0);
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
