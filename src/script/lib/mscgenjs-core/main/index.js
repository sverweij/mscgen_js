/* istanbul ignore else */
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
/* eslint max-params: 0 */
define(function(require){

    var _            = require("../lib/lodash/lodash.custom");
    var cssTemplates = require("../render/graphics/csstemplates");

    function isProbablyAnASTAlready(pScript, pInputType){
        return pInputType === "json" && typeof pScript === "object";
    }

    function getAST(pScript, pInputType, pGetParser){
        if (isProbablyAnASTAlready(pScript, pInputType)) {
            return pScript;
        } else {
            return pGetParser(pInputType).parse(pScript);
        }
    }

    function runCallBack(pCallBack, pError, pResult){
        /* istanbul ignore else */
        if (Boolean(pCallBack)){
            if (Boolean(pError)) {
                pCallBack(pError, null);
            } else {
                pCallBack(null, pResult);
            }
        }
    }

    return {
        renderMsc: function (pScript, pOptions, pCallBack, pGetParser, pGetGraphicsRenderer){
            var lOptions = pOptions || {};
            _.defaults(lOptions, {
                inputType              : "mscgen",
                elementId              : "__svg",
                window                 : pOptions.window || window,
                includeSource          : true,
                styleAdditions         : null,
                additionalTemplate     : null,
                mirrorEntitiesOnBottom : false,
                regularArcTextVerticalAlignment: "middle"
            });

            try {
                runCallBack(
                    pCallBack,
                    null,
                    pGetGraphicsRenderer().renderASTNew(
                        getAST(pScript, lOptions.inputType, pGetParser),
                        lOptions.window,
                        lOptions.elementId,
                        {
                            source: lOptions.includeSource ? pScript : null,
                            styleAdditions: lOptions.styleAdditions,
                            additionalTemplate: lOptions.additionalTemplate,
                            mirrorEntitiesOnBottom: lOptions.mirrorEntitiesOnBottom,
                            regularArcTextVerticalAlignment: lOptions.regularArcTextVerticalAlignment
                        }
                    )
                );
            } catch (pException){
                runCallBack(pCallBack, pException);
            }
        },

        translateMsc: function (pScript, pOptions, pCallBack, pGetParser, pGetTextRenderer){
            var lOptions = pOptions || {};
            _.defaults(lOptions, {
                inputType: "mscgen",
                outputType: "json"
            });
            try {
                runCallBack(
                    pCallBack,
                    null,
                    (lOptions.outputType === "json")
                        ? JSON.stringify(
                            pGetParser(lOptions.inputType).parse(pScript),
                            null,
                            "  "
                        )
                        : pGetTextRenderer(lOptions.outputType).render(
                            getAST(pScript, lOptions.inputType, pGetParser)
                        )
                );
            } catch (pException) {
                runCallBack(pCallBack, pException);
            }
        },

        version: "1.12.0",

        getAllowedValues: function() {
            return Object.seal({
                inputType: [
                    {name: "mscgen",  experimental: false},
                    {name: "msgenny", experimental: false},
                    {name: "xu",      experimental: false},
                    {name: "json",    experimental: false},
                    {name: "ast",     experimental: false}
                ],
                outputType: [
                    {name: "mscgen",  experimental: false},
                    {name: "msgenny", experimental: false},
                    {name: "xu",      experimental: false},
                    {name: "json",    experimental: false},
                    {name: "ast",     experimental: false},
                    {name: "dot",     experimental: false},
                    {name: "doxygen", experimental: false}
                ],
                regularArcTextVerticalAlignment: [
                    {name: "above",   experimental: true},
                    {name: "middle",  experimental: false},
                    {name: "below",   experimental: true}
                ],
                namedStyle: cssTemplates.namedStyles.map(
                    function(pStyle){
                        return {
                            name         : pStyle.name,
                            description  : pStyle.description,
                            experimental : pStyle.experimental,
                            deprecated   : pStyle.deprecated
                        };
                    }
                )
            });
        }
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
