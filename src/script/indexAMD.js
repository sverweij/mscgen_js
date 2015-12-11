/* jshint browser:true, node:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([ "./lib/lodash/lodash.custom",
        "./parse/mscgenparser",
        "./parse/xuparser",
        "./parse/msgennyparser",
        "./render/text/ast2mscgen",
        "./render/text/ast2msgenny",
        "./render/text/ast2xu",
        "./render/text/ast2dot",
        "./render/text/ast2doxygen",
        "./render/graphics/renderast"], function(
    _,
    mscgenparser,
    xuparser,
    msgennyparser,
    ast2mscgen,
    ast2msgenny,
    ast2xu,
    ast2dot,
    ast2doxygen,
    renderast) {
    "use strict";
    var DEFAULT_PARSER = mscgenparser;
    var DEFAULT_TEXT_RENDERER = ast2mscgen;

    var gLang2Parser = {
        mscgen: mscgenparser,
        xu: xuparser,
        msgenny: msgennyparser
    };

    var gLang2TextRenderer = {
        mscgen: ast2mscgen,
        msgenny: ast2msgenny,
        xu: ast2xu,
        dot: ast2dot,
        doxygen: ast2doxygen
    };

    var getParser = _.memoize (
        function getParser (pLanguage) {
            if (["ast", "json"].indexOf(pLanguage) > -1) {
                return JSON;
            }

            return gLang2Parser[pLanguage]||DEFAULT_PARSER;
        }
    );

    var getGraphicsRenderer = _.memoize (
        function getGraphicsRenderer(){
            return renderast;
        }
    );

    var getTextRenderer = _.memoize (
        function getTextRenderer(pLanguage){
            return gLang2TextRenderer[pLanguage]||DEFAULT_TEXT_RENDERER;
        }
    );

    function runCallBack(pCallBack, pError, pResult){
        /* istanbul ignore else */
        if (!!pCallBack){
            if(!!pError) {
                pCallBack(pError, null);
            } else {
                pCallBack(null, pResult);
            }
        }
    }

    return {
        getParams : function (thing) {
            return thing;
        },
        renderMsc : function renderMsc(pScript, pOptions, pCallBack){
            var lOptions = pOptions||{};
            _.defaults(lOptions, {
                inputType: "mscgen",
                elementId: "__svg",
                window: pOptions.window||window,
                includeSource: true,
            });

            try {
                runCallBack(
                    pCallBack,
                    null,
                    getGraphicsRenderer().renderAST(
                        getParser(lOptions.inputType).parse(pScript),
                        lOptions.includeSource ? pScript : null,
                        lOptions.elementId,
                        lOptions.window
                    )
                );
            } catch (pException){
                runCallBack(pCallBack, pException);
            }
        },

        translateMsc : function translateMsc(pScript, pOptions, pCallBack){
            var lOptions = pOptions||{};
            _.defaults(lOptions, {
                inputType: "mscgen",
                outputType: "json",
            });
            try {
                runCallBack(
                    pCallBack,
                    null,
                    (lOptions.outputType === "json") ?
                        getParser(lOptions.inputType).parse(pScript) :
                        getTextRenderer(lOptions.outputType).render(
                            (lOptions.inputType === "json" && typeof pScript === "string")?
                                getParser(lOptions.inputType).parse(pScript) :
                                pScript
                        )
                );
            } catch (pException) {
                runCallBack(pCallBack, pException);
            }
        },
        getParser : getParser,
        getGraphicsRenderer : getGraphicsRenderer,
        getTextRenderer : getTextRenderer
    };
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
