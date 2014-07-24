var assert = require("assert");
var parser = require("../parse/mscgenparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");
var fs = require("fs");

describe('mscgenparser', function() {
    describe('#parse()', function() {

        it('should render a simple AST', function() {
            var lAST = parser.parse('msc { a,"b space"; a => "b space" [label="a simple script"];}');
            tst.assertequalJSON(lAST, fix.astSimple);
        });

        it("should produce an (almost empty) AST for empty input", function() {
            var lAST = parser.parse("msc{}");
            tst.assertequalJSON(lAST, fix.astEmpty);
        });
        it("should produce an AST even when non entity arcs are its only content", function() {
            var lAST = parser.parse('msc{--- [label="start"]; ... [label="no entities ..."]; ---[label="end"];}');
            tst.assertequalJSON(lAST, fix.astNoEntities);
        });
        it("should produce lowercase for upper/ mixed case arc kinds", function() {
            var lAST = parser.parse('msc { a, b, c, d; a NoTE a, b BOX b, c aBox c, d rbOX d;}');
            tst.assertequalJSON(lAST, fix.astBoxArcs);
        });
        it("should produce lowercase for upper/ mixed case options", function() {
            var lAST = parser.parse('msc{HSCAle="1.2", widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN";a;}');
            tst.assertequalJSON(lAST, fix.astOptionsMscgen);
        });
        it("should produce lowercase for upper/ mixed case attributes", function() {
            var lAST = parser.parse('msc{a [LaBEL="miXed", teXTBGcolOR="orange"]; a NOte a [LINEcolor="red", TEXTColoR="blue", ArcSkip="4"];}');
            tst.assertequalJSON(lAST, fix.astMixedAttributes);
        });
        it("should translate *colour to *color", function() {
            var lAST = parser.parse('msc { a [textcolOUr="green", textBGColour="cyan", linecolour="#ABCDEF"];}');
            tst.assertequalJSON(lAST, fix.astColourColor);
        });
        it("should parse all possible attributes", function(){
            var lAST = parser.parse('msc {\n\
  a [label="Label for A", idurl="http://localhost/idurl", id="Just and id", url="http://localhost/url", linecolor="#ABCDEF", textcolor="green", textbgcolor="cyan", arclinecolor="violet", arctextcolor="pink", arctextbgcolor="brown"];\n\
\n\
  a <<=>> a [label="Label for a <<=>> a", idurl="http://localhost/idurl", id="Just and id", url="http://localhost/url", linecolor="#ABCDEF", textcolor="green", textbgcolor="cyan"];\n\
}');
            tst.assertequalJSON(lAST, fix.astAllAttributes);
        });
        it("should produce only 'true' or 'false' for all variants of wordwraparcs", function() {
            tst.assertequalJSON(parser.parse('msc { wordwraparcs=true;}'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('msc { wordwraparcs="true";}'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('msc { wordwraparcs=on;}'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('msc { wordwraparcs="on";}'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('msc { wordwraparcs=1;}'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('msc { wordwraparcs="1";}'), fix.astWorwraparcstrue);
        });
        it("should throw a SyntaxError on an invalid program", function() {
            try {
                var lAST = parser.parse('a');
                var lStillRan = false;
                if (lAST) {
                    lStillRan = true;
                }
                assert.equal(lStillRan, false);
            } catch(e) {
                assert.equal(e.name, "SyntaxError");
            }
        });
        it ("should complain about an undeclared entity in a from", function(){
            try {
                var lAST = parser.parse ("msc{a,b,c;d=>a;}");
                                    var lStillRan = false;
                if (lAST) {
                    lStillRan = true;
                }
                assert.equal(lStillRan, false);
            } catch(e){
                assert.equal(e.name, "EntityNotDefinedError");
            }
        });
        it ("should complain about an undeclared entity in a to", function(){
            try {
                var lAST = parser.parse ("msc{a,b,c;b=>f;}");
                                    var lStillRan = false;
                if (lAST) {
                    lStillRan = true;
                }
                assert.equal(lStillRan, false);
            } catch(e){
                assert.equal(e.name, "EntityNotDefinedError");
            }
        });
    });

    describe('#parse() - file based tests', function() {
        it("should parse all possible arcs", function() {
            var lTextFromFile = fs.readFileSync('./src/script/test/fixtures/test01_all_possible_arcs_mscgen.mscin', {
                "encoding" : "utf8"
            });
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalJSONFile('./src/script/test/fixtures/test01_all_possible_arcs_mscgen.json', lAST);
        });
        it("should parse stuff with colors", function() {
            var lTextFromFile = fs.readFileSync('./src/script/test/fixtures/rainbow.mscin', {
                "encoding" : "utf8"
            });
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalJSONFile('./src/script/test/fixtures/rainbow.json', lAST);
        });
        it("strings, ids and urls", function() {
            var lTextFromFile = fs.readFileSync('./src/samples/test10_stringsandurls.mscin', {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalJSONFile('./src/samples/test10_stringsandurls.json', lAST);
        });
    }); 

});

