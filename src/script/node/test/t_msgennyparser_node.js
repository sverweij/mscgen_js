var assert = require("assert");
var parser = require("../msgennyparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");

describe('msgennyparser', function() {

    describe('#parse()', function() {

        it('should render a simple AST, with two entities auto declared', function() {
            var lAST = parser.parse('a => b: a simple script;');
            tst.assertequalJSON(lAST, fix.astSimple());
        });

        it("should produce an (almost empty) AST for empty input", function() {
            var lAST = parser.parse("");
            tst.assertequalJSON(lAST, fix.astEmpty());
        });
        it("should produce an AST even when non entity arcs are its only content", function() {
            var lAST = parser.parse('---:start;...:no entities ...; ---:end;');
            tst.assertequalJSON(lAST, fix.astNoEntities());
        });
        it("should produce lowercase for upper/ mixed case arc kinds", function() {
            var lAST = parser.parse('a NoTE a, b BOX b, c aBox c, d rbOX d;');
            tst.assertequalJSON(lAST, fix.astBoxArcs());
        });
        it("should produce lowercase for upper/ mixed case options", function() {
            var lAST = parser.parse('ARCGRADIENT="17",woRDwrAParcS="oN", HSCAle="1.2", widtH=800;a;');
            tst.assertequalJSON(lAST, fix.astOptions());
        });
        it('should produce wordwraparcs="true" for true, "true", on, "on", 1 and "1"', function() {
            tst.assertequalJSON(parser.parse('wordwraparcs=true;'), fix.astWorwraparcstrue());
            tst.assertequalJSON(parser.parse('wordwraparcs="true";'), fix.astWorwraparcstrue());
            tst.assertequalJSON(parser.parse('wordwraparcs=on;'), fix.astWorwraparcstrue());
            tst.assertequalJSON(parser.parse('wordwraparcs="on";'), fix.astWorwraparcstrue());
            tst.assertequalJSON(parser.parse('wordwraparcs=1;'), fix.astWorwraparcstrue());
            tst.assertequalJSON(parser.parse('wordwraparcs="1";'), fix.astWorwraparcstrue());
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
    });

    describe('#parse() - expansions', function() {
        it('should render a simple AST, with an alt', function() {
            var lAST = parser.parse('a=>b; b alt c { b => c; c >> b;};');
            tst.assertequalJSON(lAST, fix.astOneAlt());
        });
        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('a => b; a loop c { b alt c { b -> c: -> within alt; c >> b: >> within alt; }: label for alt; b >> a: >> within loop;}: label for loop; a =>> a: happy-the-peppy - outside;...;');
            tst.assertequalJSON(lAST, fix.astAltWithinLoop());
        });
        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('a alt b {  c -> d; };');
            tst.assertequalJSON(lAST, fix.astDeclarationWithinArcspan());
        });
    });
});

