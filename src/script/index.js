/* jshint node:true, browser:true */
"use strict";
var DEFAULT_PARSER = "./parse/mscgenparser_node";
var DEFAULT_TEXT_RENDERER = "./render/text/ast2mscgen";
var _ = require("./lib/lodash/lodash.custom");

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
            gLang2Parser[pLanguage]||DEFAULT_PARSER
        );
    }
);

var getGraphicsRenderer = _.memoize (
    function getGraphicsRenderer(){
        return require('./render/graphics/renderast');
    }
);

var getTextRenderer = _.memoize (
    function getTextRenderer(pLanguage){
        return require(
            gLang2TextRenderer[pLanguage]||DEFAULT_TEXT_RENDERER
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
function isProbablyAnASTAlready(pScript, pInputType){
    return pInputType === "json" && typeof pScript === "object";
}

function getAST(pScript, pInputType){
    if (isProbablyAnASTAlready(pScript, pInputType)) {
        return pScript;
    } else {
        return getParser(pInputType).parse(pScript);
    }
}

module.exports = {

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
                    getAST(pScript, lOptions.inputType),
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
                        getAST(pScript, lOptions.inputType)
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
