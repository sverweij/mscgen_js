/* jshint unused: true */
var renderer = require("../render/graphics/renderast");
var tst = require ("./testutensils");
var jsdom = require('jsdom');


function ast2svg(pAST, pWindow) {
    // make a deep copy first, as renderAST actively modifies its input
    var lFixtureString = JSON.stringify(pAST, null, " ");
    var lFixture = JSON.parse(lFixtureString);
    renderer.clean("__svg", pWindow);
    renderer.renderAST(lFixture, lFixtureString, "__svg", pWindow);
    return pWindow.document.body.innerHTML;
}

function processAndCompare(pExpectedFile, pInputFile) {
    jsdom.env("<html><body></body></html>", function(err, window) {
        tst.assertequalProcessing(pExpectedFile, pInputFile, function(pInput) {
            return ast2svg(JSON.parse(pInput), window);
        });
    });
}

describe('renderast', function() {
    describe('#renderAST() - xu everyting', function() {
        it ('should given given a simple syntax tree, render an svg', function() {
            processAndCompare('./src/script/test/fixtures/astsimple.svg', //
            './src/script/test/fixtures/astsimple.json');
        });
        it('should render all possible arcs', function() {
            processAndCompare('./src/script/test/fixtures/test01_all_possible_arcs.svg', //
            './src/script/test/fixtures/test01_all_possible_arcs.json');
        });
        it('should render colors', function() {
            processAndCompare('./src/script/test/fixtures/rainbow.svg', //
            './src/script/test/fixtures/rainbow.json');
        });
        it('should wrap text in boxes well', function(){
            processAndCompare('./src/script/test/fixtures/test19_multiline_lipsum.svg',//
            './src/script/test/fixtures/test19_multiline_lipsum.json');
        });
    });
});
