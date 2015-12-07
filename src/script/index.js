/* jshint node:true, browser:true */
var DEFAULT_PARSER = "./parse/mscgenparser_node";
var DEFAULT_TEXT_RENDERER = "./render/text/ast2mscgen";
var _ = require("../lib/lodash/lodash.custom");

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
        "use strict";
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
        "use strict";
        return require('./render/graphics/renderast');
    }
);

var getTextRenderer = _.memoize (
    function getTextRenderer(pLanguage){ // TODO: memoize
        "use strict";
        return require(
            !!gLang2TextRenderer[pLanguage] ?
              gLang2TextRenderer[pLanguage] :
              DEFAULT_TEXT_RENDERER
        );
    }
);

function runCallBack(pCallBack, pError, pResult){
    "use strict";
    /* istanbul ignore else */
    if (!!pCallBack){
        if(!!pError) {
            pCallBack(pError, null);
        } else {
            pCallBack(null, pResult);
        }
    }
}

module.exports = {

    renderMsc : function renderMsc(pScript, pOptions, pCallBack){
        "use strict";
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
        "use strict";
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
