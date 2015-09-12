/* jshint unused: true */
var renderer = require("../../../render/graphics/renderast");
var tst = require ("../../testutensils");
var jsdom = require("jsdom");

function ast2svg(pASTString, pWindow, pIncludeSource, pUseOwnElement) {
    // make a deep copy first, as renderAST actively modifies its input
    // var lFixtureString = JSON.stringify(pAST, null, " ");
    var lAST = JSON.parse(pASTString);
    renderer.clean("__svg", pWindow);
    if (pIncludeSource){
        renderer.renderAST(lAST, pASTString, "__svg", pWindow);
    } else {
        renderer.renderAST(lAST, null, "__svg", pWindow);
    }
    if (pUseOwnElement){
        return pWindow.__svg.innerHTML;
    } else {
        return pWindow.document.body.innerHTML;
    }
}

describe('renderast', function() {
    jsdom.env("<html><body></body></html>", function(err, pWindow) {
        describe('#renderAST in body', function() {
            function processAndCompare(pExpectedFile, pInputFile, pIncludeSource) {
                tst.assertequalProcessing(pExpectedFile, pInputFile, function(pInput) {
                    return ast2svg(pInput, pWindow, pIncludeSource);
                });
            }
            it('should be ok with an empty AST', function(){
                processAndCompare('./src/script/test/fixtures/astempty.svg', //
                './src/script/test/fixtures/astempty.json', true);
            });
            it ('should given given a simple syntax tree, render an svg', function() {
                processAndCompare('./src/script/test/fixtures/astsimple.svg', //
                './src/script/test/fixtures/astsimple.json', true);
            });
            it ('should given given a simple syntax tree, render an svg - with source omitted from svg', function() {
                processAndCompare('./src/script/test/fixtures/astsimplenosource.svg', //
                './src/script/test/fixtures/astsimple.json', false);
            });
            it('should render colors', function() {
                processAndCompare('./src/script/test/fixtures/rainbow.svg', //
                './src/script/test/fixtures/rainbow.json', true);
            });
            it('should render ids & urls', function() {
                processAndCompare('./src/script/test/fixtures/idsnurls.svg', //
                './src/script/test/fixtures/idsnurls.json', true);
            });
            it('should wrap text in boxes well', function(){
                processAndCompare('./src/script/test/fixtures/test19_multiline_lipsum.svg',//
                './src/script/test/fixtures/test19_multiline_lipsum.json', true);
            });
            it('should render empty inline expressions correctly', function(){
                processAndCompare('./src/script/test/fixtures/test20_empty_inline_expression.svg',//
                './src/script/test/fixtures/test20_empty_inline_expression.json', true);
            });
            it('should render "alt" lines in inline expressions correctly', function(){
                processAndCompare('./src/script/test/fixtures/test21_inline_expression_alt_lines.svg',//
                './src/script/test/fixtures/test21_inline_expression_alt_lines.json', true);
            });
            it('should render all possible arcs', function() {
                processAndCompare('./src/script/test/fixtures/test01_all_possible_arcs.svg', //
                './src/script/test/fixtures/test01_all_possible_arcs.json', true);
            });
        });
    });
    jsdom.env("<html><body><span id='__svg'></span></body></html>", function(err, pWindow) {
        describe('#renderAST in own element', function() {
            function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
                tst.assertequalProcessing(pExpectedFile, pInputFile, function(pInput) {
                    return ast2svg(pInput, pWindow, pIncludeSource, pUseOwnElement);
                });
            }
            it('should be ok with an empty AST', function(){
                processAndCompare('./src/script/test/fixtures/astempty.svg', //
                './src/script/test/fixtures/astempty.json', true, true);
            });
            it ('should given given a simple syntax tree, render an svg', function() {
                processAndCompare('./src/script/test/fixtures/astsimple.svg', //
                './src/script/test/fixtures/astsimple.json', true, true);
            });
        });
    });
    it('dummy so mocha executes the tests wrapped in jsdom', function(){
        return true;
    });
});
