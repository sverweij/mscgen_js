/* jshint unused: true */
var renderer = require("../../../render/graphics/renderast");
var tst = require ("../../testutensils");
var jsdom = require("jsdom");
var path = require('path');

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

describe('render/graphics/renderast', function() {
    jsdom.env("<html><body></body></html>", function(err, pWindow) {
        describe('#renderAST in body', function() {
            function processAndCompare(pExpectedFile, pInputFile, pIncludeSource) {
                tst.assertequalProcessingXML(pExpectedFile, pInputFile, function(pInput) {
                    return ast2svg(pInput, pWindow, pIncludeSource);
                });
            }
            it('should be ok with an empty AST', function(){
                processAndCompare(path.join(__dirname, '../../fixtures/astempty.svg'), //
                path.join(__dirname, '../../fixtures/astempty.json'), true);
            });
            it ('should given given a simple syntax tree, render an svg', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/astsimple.svg'), //
                path.join(__dirname, '../../fixtures/astsimple.json'), true);
            });
            it ('should given given a simple syntax tree, render an svg - with source omitted from svg', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/astsimplenosource.svg'), //
                path.join(__dirname, '../../fixtures/astsimple.json'), false);
            });
            it('should not omit empty lines', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/astemptylinesinboxes.svg'), //
                path.join(__dirname, '../../fixtures/astemptylinesinboxes.json'), true);
            });
            it('should render colors', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/rainbow.svg'), //
                path.join(__dirname, '../../fixtures/rainbow.json'), true);
            });
            it('should render ids & urls', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/idsnurls.svg'), //
                path.join(__dirname, '../../fixtures/idsnurls.json'), true);
            });
            it('should wrap text in boxes well', function(){
                processAndCompare(path.join(__dirname, '../../fixtures/test19_multiline_lipsum.svg'),//
                path.join(__dirname, '../../fixtures/test19_multiline_lipsum.json'), true);
            });
            it('should render empty inline expressions correctly', function(){
                processAndCompare(path.join(__dirname, '../../fixtures/test20_empty_inline_expression.svg'),//
                path.join(__dirname, '../../fixtures/test20_empty_inline_expression.json'), true);
            });
            it('should render "alt" lines in inline expressions correctly', function(){
                processAndCompare(path.join(__dirname, '../../fixtures/test21_inline_expression_alt_lines.svg'),//
                path.join(__dirname, '../../fixtures/test21_inline_expression_alt_lines.json'), true);
            });
            it('should render all possible arcs', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/test01_all_possible_arcs.svg'), //
                path.join(__dirname, '../../fixtures/test01_all_possible_arcs.json'), true);
            });
        });
    });
    jsdom.env("<html><body><span id='__svg'></span></body></html>", function(err, pWindow) {
        describe('#renderAST in own element', function() {
            function processAndCompare(pExpectedFile, pInputFile, pIncludeSource, pUseOwnElement) {
                tst.assertequalProcessingXML(pExpectedFile, pInputFile, function(pInput) {
                    return ast2svg(pInput, pWindow, pIncludeSource, pUseOwnElement);
                });
            }
            it('should be ok with an empty AST', function(){
                processAndCompare(path.join(__dirname, '../../fixtures/astempty.svg'), //
                path.join(__dirname, '../../fixtures/astempty.json'), true, true);
            });
            it ('should given given a simple syntax tree, render an svg', function() {
                processAndCompare(path.join(__dirname, '../../fixtures/astsimple.svg'), //
                path.join(__dirname, '../../fixtures/astsimple.json'), true, true);
            });
        });
    });
    it('dummy so mocha executes the tests wrapped in jsdom', function(){
        return true;
    });
});
