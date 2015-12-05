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
/**
 * Porno
 * @type {Object}
 */
module.exports = {
    /**
     * Given a sequence chart language, returns a parser that parses
     * that language into an absract syntax tree
     *
     * Supports languages 'mscgen', 'xu' and 'msgenny'. When the
     * function doesn't recognize the language or when no language is passed
     * it returns a parser for MscGen
     *
     * e.g.
     * var mscgenjs = require('mscgenjs');
     *
     * var parser = mscgenjs.getParser('msgenny');
     * var msGennyScript = 'alice =>> alice: sign message; alice =>> bob: signed message;';
     * var abstractSyntaxTree = parser.parse(msGennyScript);
     *
     * @param  {string} pLanguage which language to parse.
     * @return {function}           [description]
     */
    getParser : function getParser(pLanguage) {
        "use strict";
        return require(
            !!gLang2Parser[pLanguage] ?
              gLang2Parser[pLanguage] :
              DEFAULT_PARSER
        );
    },

    /**
     * Returns a function that renders the abstract syntax tree in the given
     * element and window object.
     *
     * e.g.
     *
     * var renderer = mscgenjs.getGraphicsRenderer();
     * var elementId = '__svg';
     * renderer.clean(elementId, window);
     * renderer.renderAST(abstractSyntaxTree, msGennyScript, elementId, window);
     *
     * @return {function}
     */
    getGraphicsRenderer : function getGraphicsRenderer(){
        "use strict";
        return require('./render/graphics/renderast');
    },

    /**
     * Returns a function that, given an abstract syntax tree
     * renders it in the requested language
     *
     * Recognized languages: mscgen, xu, msgenny, dot, doxygen
     *
     * e.g.
     * var textRenderer = mscgenjs.getTextRenderer('mscgen');
     * var mscGenScript = textRenderer.render(abstractSyntaxTree);
     *
     * @param  {string} pLanguage
     * @return {function}
     */
    getTextRenderer : function getTextRenderer(pLanguage){
        "use strict";
        return require(
            !!gLang2TextRenderer[pLanguage] ?
              gLang2TextRenderer[pLanguage] :
              DEFAULT_TEXT_RENDERER
        );
    }
};
