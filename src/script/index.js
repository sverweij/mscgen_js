/* jshint node:true */
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

module.exports = {

    getParser : function getParser(pLanguage) {
        "use strict";
        return require(
            !!gLang2Parser[pLanguage] ?
              gLang2Parser[pLanguage] :
              DEFAULT_PARSER
        );
    },
    getGraphicsRenderer : function getGraphicsRenderer(){
        "use strict";
        return require('./render/graphics/renderast');
    },

    getTextRenderer : function getTextRenderer(pLanguage){
        "use strict";
        return require(
            !!gLang2TextRenderer[pLanguage] ?
              gLang2TextRenderer[pLanguage] :
              DEFAULT_TEXT_RENDERER
        );
    }
};
