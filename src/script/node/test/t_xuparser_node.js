var assert = require("assert");
var parser = require("../xuparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");
var fs = require("fs");

describe('xuparser', function() {
    describe('#parse()', function() {

        it('should render a simple AST', function() {
            var lAST = parser.parse('msc { a,b; a => b [label="a simple script"];}');
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
            var lAST = parser.parse('msc{ARCGRADIENT="17",woRDwrAParcS="oN", HSCAle="1.2", widtH=800,   WATERmark="not in mscgen, available in xù and msgenny" ;a;}');
            tst.assertequalJSON(lAST, fix.astOptions);
        });
        it("should produce lowercase for upper/ mixed case attributes", function() {
            var lAST = parser.parse('msc{a [LaBEL="miXed", teXTBGcolOR="orange"]; a NOte a [LINEcolor="red", TEXTColoR="blue", ArcSkip="4"];}');
            tst.assertequalJSON(lAST, fix.astMixedAttributes);
        });
        it("should translate *colour to *color", function() {
            var lAST = parser.parse('msc { a [textcolOUr="green", textBGColour="cyan", linecolour="#ABCDEF"];}');
            tst.assertequalJSON(lAST, fix.astColourColor);
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
        it("should parse all possible arcs", function() {
            fs.readFile('./src/script/node/test/fixtures/test01_all_possible_arcs.xu', function(pErr, pTextFromFile) {
                if (pErr) {
                    throw pErr;
                }
                var lAST = parser.parse(pTextFromFile.toString());
                tst.assertequalJSONFile('./src/script/node/test/fixtures/test01_all_possible_arcs.json', lAST);
            });
        });
        it("should parse stuff with colors", function() {
            fs.readFile('./src/script/node/test/fixtures/rainbow.mscin', function(pErr, pTextFromFile) {
                if (pErr) {
                    throw pErr;
                }
                var lAST = parser.parse(pTextFromFile.toString());
                tst.assertequalJSONFile('./src/script/node/test/fixtures/rainbow.json', lAST);
            });
        });
    });

    describe('#parse() - xu specific extensions', function() {
        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('msc { a,b,c; a => b; b alt c { b => c; c >> b; };}');
            tst.assertequalJSON(lAST, fix.astOneAlt);
        });

        it('should render an AST, with a loop and an alt in it', function() {
            var lAST = parser.parse('msc { a,b,c; a => b; a loop c [label="label for loop"] { b alt c [label="label for alt"]{ b -> c [label="-> within alt"]; c >> b [label=">> within alt"]; }; b >> a [label=">> within loop"];}; a =>> a [label="happy-the-peppy - outside"];...;}');
            tst.assertequalJSON(lAST, fix.astAltWithinLoop);
        });
    });
});

/*

 msc {
 a,
 b,
 c;

 a => b;
 a loop c {
 b alt c {
 b -> c [label="blahs(i)"];
 c >> b [label="thing"];
 } [label="hunky dory"];
 b >> a;
 } [label="for each blah"];

 a =>> a [label="happy-the-peppy"];
 ...;
 }
 */