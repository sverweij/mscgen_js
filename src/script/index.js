/* jshint browser:true, node:true */

/* istanbul ignore else */
if ( typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./lib/lodash/lodash.custom"], function(_) {
    "use strict";
    var DEFAULT_PARSER = "./parse/mscgenparser_node";
    var DEFAULT_TEXT_RENDERER = "./render/text/ast2mscgen";
    var gLang2Parser = {
        mscgen: "./parse/mscgenparser_node",
        xu: "./parse/xuparser_node",
        msgenny: "./parse/msgennyparser_node"
    };

    var gLang2TextRenderer = {
        mscgen: "./render/text/ast2mscgen",
        msgenny: "./render/text/ast2msgenny",
        xu: "./render/text/ast2xu",
        dot: "./render/text/ast2dot",
        doxygen: "./render/text/ast2doxygen"
    };

    var getParser = _.memoize (
        function getParser (pLanguage) {
            if (["ast", "json"].indexOf(pLanguage) > -1) {
                return JSON;
            }

            return require(
                !!gLang2Parser[pLanguage] ?
                  gLang2Parser[pLanguage] :
                  DEFAULT_PARSER
            );
        }
    );

    var getGraphicsRenderer = _.memoize (
        function getGraphicsRenderer(){
            return require('./render/graphics/renderast');
        }
    );

    var getTextRenderer = _.memoize (
        function getTextRenderer(pLanguage){ // TODO: memoize
            return require(
                !!gLang2TextRenderer[pLanguage] ?
                  gLang2TextRenderer[pLanguage] :
                  DEFAULT_TEXT_RENDERER
            );
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
                            getParser(lOptions.inputType).parse(pScript)
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
