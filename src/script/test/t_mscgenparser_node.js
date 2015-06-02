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
        it('should ignore c++ style one line comments', function() {
            var lAST = parser.parse('msc { a,"b space"; a => "b space" [label="a simple script"];}//ignored');
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
            var lAST = parser.parse('msc{HSCAle=1.2, widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN";a;}');
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
            tst.assertSyntaxError('a', parser);
        });
        it("should throw a SyntaxError on a program with only the start token", function() {
            tst.assertSyntaxError('msc', parser);
        });
        it("should throw a SyntaxError on a program with shizzle after the closing statement", function() {
            tst.assertSyntaxError('msc{a;} shizzle after the closing statement', parser);
        });
        it("unicode is cool. But not yet for unquoted entity names", function() {
            tst.assertSyntaxError('msc{序;}', parser);
        });
        it("should throw a SyntaxError on an invalid program", function() {
            tst.assertSyntaxError('msc{a}', parser);
        });
        it("should throw a SyntaxError on an invalid arc type", function() {
            tst.assertSyntaxError('msc{a, b; a xx b;}', parser);
        });
        it("should throw a SyntaxError on an invalid option", function() {
            tst.assertSyntaxError('msc{wordwarparcs="true"; a, b; a -> b;}', parser);
        });
        it("should throw a SyntaxError on an invalid value for an option", function() {
            tst.assertSyntaxError('msc{wordwraparcs=\u0181; a, b; a -> b;}', parser);
        });
        it("should throw a SyntaxError on a missing semi colon", function() {
            tst.assertSyntaxError('msc{wordwraparcs="true"; a, b; a -> b}', parser);
        });
        it("should throw a SyntaxError for a * on the RHS of x-", function() {
            tst.assertSyntaxError('msc{a,b,c; b x- *;}', parser);
        });
        it("should throw a SyntaxError for a * on the LHS of -x", function() {
            tst.assertSyntaxError('msc{a,b,c; * -x b;}', parser);
        });
        it("should throw a SyntaxError on a missing program closer", function() {
            tst.assertSyntaxError('msc{wordwraparcs="true"; a, b; a -> b;', parser);
        });
        it("should throw a SyntaxError on a invalid entity attribute", function() {
            tst.assertSyntaxError('msc{a[invalidentitityattribute="invalid"];}', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket on an entity", function() {
            tst.assertSyntaxError('msc{a[label="missing closing bracket";}', parser);
        });
        it("should throw a SyntaxError on a invalid arc attribute", function() {
            tst.assertSyntaxError('msc{a, b; a -> b[invalidearcattribute="invalid"];}', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('msc{a, b; a -> b[label="missing closing bracket";}', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('msc{a, b; a -> b[label="missingmscbracket"];', parser);
        });
        it ("should complain about an undeclared entity in a from", function(){
            tst.assertSyntaxError("msc{a,b,c;d=>a;}", parser, "EntityNotDefinedError");
        });        
        it ("should complain about an undeclared entity in a to", function(){
            tst.assertSyntaxError("msc{a,b,c;b=>f;}", parser, "EntityNotDefinedError");
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
