var parser = require("../parse/msgennyparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");
var fs = require("fs");

var gCorrectOrderFixture = {
    "precomment":["# A,a, c, d, b, B;", "\n"],
    "meta": {
      "extendedOptions": false,
      "extendedArcTypes": true,
      "extendedFeatures": true
    },
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
        it('should ignore c++ style one line comments', function() {
            var lAST = parser.parse('a => "b space": a simple script;//ignored');
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
            var lAST = parser.parse('HSCAle=1.2, widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN", watermark="not in mscgen, available in xù and msgenny";a;');
            tst.assertequalJSON(lAST, fix.astOptions);
        });
        it("should keep the labeled name of an entity", function(){
            var lAST = parser.parse('"實體": This is the label for 實體;');
            tst.assertequalJSON(lAST, fix.astLabeledEntity);
        });
        it("should generate arcs to all other arcs with bare *", function(){
            var lAST = parser.parse('a;"實體" -> *;* << b;');
            tst.assertequalJSON(lAST, fix.astAsterisk);
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
            tst.assertSyntaxError('a', parser);
        });
        it("unicode is cool. But not yet for unquoted entity names", function() {
            tst.assertSyntaxError('序;', parser);
        });
        it("unicode is cool for quoted entity names", function() {
            var lFixture = {
              "meta": {
                "extendedOptions": false,
                "extendedArcTypes": false,
                "extendedFeatures": false
              },
              "entities": [
                {
                  "name": "序"
                }
              ]
            };
            tst.assertequalJSON(parser.parse('"序";'), lFixture);
        });
        it("unicode is cool. But not yet for unquoted entity names - neither does it in arcs", function() {
            tst.assertSyntaxError('"序" -> 序;', parser);
        });
        it("should throw a SyntaxError on an invalid arc type", function() {
            tst.assertSyntaxError('a, b; a xx b;', parser);
        });
        it("should allow empty inline expressions", function() {
            var lFixture = {
              "meta": {
                "extendedOptions": false,
                "extendedArcTypes": true,
                "extendedFeatures": true
              },
              "entities": [
                {
                  "name": "a"
                },
                {
                  "name": "b"
                }
              ],
              "arcs": [
                [
                  {
                    "kind": "opt",
                    "from": "a",
                    "to": "b",
                    "arcs": null
                  }
                ]
              ]
            };
            tst.assertequalJSON (parser.parse('a, b; a opt b{};'), lFixture);
        });
        it("should throw a SyntaxError on _that's not an inline expression_ arc type", function() {
            tst.assertSyntaxError('a, b; a => b{|||;};', parser);
        });
        it("should throw a SyntaxError on an invalid option", function() {
            tst.assertSyntaxError('wordwarparcs="true"; a, b; a -> b;', parser);
        });
        it("should throw a SyntaxError on an invalid value for an option", function() {
            tst.assertSyntaxError('wordwraparcs=\u0181; a, b; a -> b;', parser);
        });
        it("should throw a SyntaxError on a missing semi colon", function() {
            tst.assertSyntaxError('wordwraparcs="true"; a, b; a -> b', parser);
        });
        it("should throw a SyntaxError for a * on the RHS of x-", function() {
            tst.assertSyntaxError('a,b,c; b x- *;', parser);
        });
        it("should throw a SyntaxError for a * on the LHS of -x", function() {
            tst.assertSyntaxError('a,b,c; * -x b;', parser);
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
