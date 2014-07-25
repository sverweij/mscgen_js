var assert = require("assert");
var parser = require("../parse/msgennyparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");
var fs = require("fs");

var gCorrectOrderFixture = {
    "precomment":["# A,a, c, d, b, B;", "\n"],
    "entities" : [{
        "name" : "A"
    }, {
        "name" : "a"
    }, {
        "name" : "c"
    }, {
        "name" : "d"
    }, {
        "name" : "b"
    }, {
        "name" : "B"
    }],
    "arcs" : [[{
        "kind" : "loop",
        "from" : "A",
        "to" : "B",
        "arcs" : [[{
            "kind" : "alt",
            "from" : "a",
            "to" : "b",
            "arcs" : [[{
                "kind" : "->",
                "from" : "c",
                "to" : "d"
            }], [{
                "kind" : "=>",
                "from" : "c",
                "to" : "B"
            }]]
        }]]
    }]]
};

describe('msgennyparser', function() {

    describe('#parse()', function() {

        it('should render a simple AST, with two entities auto declared', function() {
            var lAST = parser.parse('a => "b space": a simple script;');
            tst.assertequalJSON(lAST, fix.astSimple);
        });

        it("should produce an (almost empty) AST for empty input", function() {
            var lAST = parser.parse("");
            tst.assertequalJSON(lAST, fix.astEmpty);
        });
        it("should produce an AST even when non entity arcs are its only content", function() {
            var lAST = parser.parse('---:start;...:no entities ...; ---:end;');
            tst.assertequalJSON(lAST, fix.astNoEntities);
        });
        it("should produce lowercase for upper/ mixed case arc kinds", function() {
            var lAST = parser.parse('a NoTE a, b BOX b, c aBox c, d rbOX d;');
            tst.assertequalJSON(lAST, fix.astBoxArcs);
        });
        it("should produce lowercase for upper/ mixed case options", function() {
            var lAST = parser.parse('HSCAle="1.2", widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN", watermark="not in mscgen, available in xù and msgenny";a;');
            tst.assertequalJSON(lAST, fix.astOptions);
        });
        it('should produce wordwraparcs="true" for true, "true", on, "on", 1 and "1"', function() {
            tst.assertequalJSON(parser.parse('wordwraparcs=true;'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('wordwraparcs="true";'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('wordwraparcs=on;'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('wordwraparcs="on";'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('wordwraparcs=1;'), fix.astWorwraparcstrue);
            tst.assertequalJSON(parser.parse('wordwraparcs="1";'), fix.astWorwraparcstrue);
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
        it("should parse all types of arcs supported by mscgen", function() {
            var lAST = parser.parse('a -> b : a -> b  (signal);a => b : a => b  (method);b >> a : b >> a  (return value);a =>> b : a =>> b (callback);a -x b : a -x b  (lost);a :> b : a :> b  (emphasis);a .. b : a .. b  (dotted);a note a : a note a,b box b : b box b;a rbox a : a rbox a,b abox b : b abox b;||| : ||| (empty row);... : ... (omitted row);--- : --- (comment);');
            tst.assertequalJSON(lAST, fix.astCheatSheet);
        });
    });

    describe('#parse() - expansions', function() {
        it('should render a simple AST, with an alt', function() {
            var lAST = parser.parse('a=>b; b alt c { b => c; c >> b;};');
            tst.assertequalJSON(fix.astOneAlt, lAST);
        });
        it('should render an AST, with alts, loops and labels (labels in front)', function() {
            var lAST = parser.parse('a => b; a loop c: "label for loop" { b alt c: "label for alt" { b -> c: -> within alt; c >> b: >> within alt; }; b >> a: >> within loop;}; a =>> a: happy-the-peppy - outside;...;');
            tst.assertequalJSON(fix.astAltWithinLoop, lAST);
        });
        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('a alt b {  c -> d; };');
            tst.assertequalJSON(fix.astDeclarationWithinArcspan, lAST);
        });
        it('automatically declares entities in the right order', function() {
            var lAST = parser.parse ('# A,a, c, d, b, B;\nA loop B {  a alt b { c -> d; c => B; };};');
            tst.assertequalJSON(gCorrectOrderFixture, lAST);
        });
    });
    describe('#parse() - file based tests', function(){
        it("should parse all possible arcs", function() {
            var lTextFromFile = fs.readFileSync('./src/script/test/fixtures/test01_all_possible_arcs_msgenny.msgenny', {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalJSONFile('./src/script/test/fixtures/test01_all_possible_arcs_msgenny.json', lAST);
        });
    });
});

