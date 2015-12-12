var parser = require("../../parse/msgennyparser_node");
var tst    = require("../testutensils");
var fix    = require("../astfixtures");
var fs     = require("fs");
var path   = require("path");
var expect = require("chai").expect;

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

var gUnicodeEntityFixture = {
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
var gUnicodeEntityInArcFixture = {
    "meta": {
        "extendedOptions": false,
        "extendedArcTypes": false,
        "extendedFeatures": false
    },
    "entities": [
    {
        "name": "序"
    },
    {
        "name": "🏭"
    },
    {
        "name": "👳"
    }
  ],
    "arcs": [
      [
      {
          "kind": "->",
          "from": "序",
          "to": "序"
      }
    ],
    [
      {
          "kind": "=>>",
          "from": "🏭",
          "to": "👳",
          "label": "👷+🔧"
      }
    ]
  ]
};

describe('parse/msgennyparser', function() {

    describe('#parse()', function() {

        it('should render a simple AST, with two entities auto declared', function() {
            var lAST = parser.parse('a => "b space": a simple script;');
            expect(lAST).to.deep.equal(fix.astSimple);
        });
        it('should ignore c++ style one line comments', function() {
            var lAST = parser.parse('a => "b space": a simple script;//ignored');
            expect(lAST).to.deep.equal(fix.astSimple);
        });
        it("should produce an (almost empty) AST for empty input", function() {
            var lAST = parser.parse("");
            expect(lAST).to.deep.equal(fix.astEmpty);
        });
        it("should produce an AST even when non entity arcs are its only content", function() {
            var lAST = parser.parse('---:start;...:no entities ...; ---:end;');
            expect(lAST).to.deep.equal(fix.astNoEntities);
        });
        it("should produce lowercase for upper/ mixed case arc kinds", function() {
            var lAST = parser.parse('a NoTE a, b BOX b, c aBox c, d rbOX d;');
            expect(lAST).to.deep.equal(fix.astBoxArcs);
        });
        it("should produce lowercase for upper/ mixed case options", function() {
            var lAST = parser.parse('HSCAle=1.2, widtH=800, ARCGRADIENT="17",woRDwrAParcS="oN", watermark="not in mscgen, available in xù and msgenny";a;');
            expect(lAST).to.deep.equal(fix.astOptions);
        });
        it("should keep the labeled name of an entity", function(){
            var lAST = parser.parse('"實體": This is the label for 實體;');
            expect(lAST).to.deep.equal(fix.astLabeledEntity);
        });
        it("should generate arcs to all other arcs with both bare and quoted *", function(){
            expect(
                parser.parse('arcgradient=18; ω; ɑ -> * : ɑ -> *; * <- β : * <- β; ɣ <-> * : ɣ <-> *;')
            ).to.deep.equal(fix.astAsteriskBoth);
            expect(
                parser.parse('arcgradient=18; ω; ɑ -> "*" : ɑ -> *; "*" <- β : * <- β; ɣ <-> "*" : ɣ <-> *;')
            ).to.deep.equal(fix.astAsteriskBoth);
        });

        it('should produce wordwraparcs="true" for true, "true", on, "on", 1 and "1"', function() {
            expect(parser.parse('wordwraparcs=true;')).to.deep.equal(fix.astWorwraparcstrue);
            expect(parser.parse('wordwraparcs="true";')).to.deep.equal(fix.astWorwraparcstrue);
            expect(parser.parse('wordwraparcs=on;')).to.deep.equal(fix.astWorwraparcstrue);
            expect(parser.parse('wordwraparcs="on";')).to.deep.equal(fix.astWorwraparcstrue);
            expect(parser.parse('wordwraparcs=1;')).to.deep.equal(fix.astWorwraparcstrue);
            expect(parser.parse('wordwraparcs="1";')).to.deep.equal(fix.astWorwraparcstrue);
        });
        it("should throw a SyntaxError on an invalid program", function() {
            tst.assertSyntaxError('a', parser);
        });
        it("should throw a SyntaxError on invalid characters in an unquoted entity", function() {
            tst.assertSyntaxError('-;', parser);
        });
        it("should throw a SyntaxError on invalid characters in an unquoted entity", function() {
            tst.assertSyntaxError('a => -;', parser);
        });
        it("should throw a SyntaxError on invalid characters in an unquoted entity", function() {
            tst.assertSyntaxError('hscale=1; - => b;', parser);
        });
        it("should throw a SyntaxError on invalid characters in an unquoted entity", function() {
            tst.assertSyntaxError('a,b; a: => b;', parser);
        });
        it("should throw a SyntaxError on asterisks on both sides for uni-directional arrows", function(){
            tst.assertSyntaxError('a,b,c; * -> *;', parser);
            tst.assertSyntaxError('a,b,c; * <- *;', parser);
        });
        it("should throw a SyntaxError on asterisks on both sides for bi-directional arrows", function(){
            tst.assertSyntaxError('a,b,c; * <-> *;', parser);
        });
        it("should throw a SyntaxError for asterisks on LHS on bi-directional arrows", function(){
            tst.assertSyntaxError('a,b,c; * <-> a;', parser);
        });
        it("unicode is cool. Also for unquoted entity names", function() {
            expect(parser.parse('序;')).to.deep.equal(gUnicodeEntityFixture);
        });
        it("unicode is also cool for quoted entity names", function() {
            expect(parser.parse('"序";')).to.deep.equal(gUnicodeEntityFixture);
        });
        it("unicode is cool. Also for unquoted entity names in arcs", function() {
            expect(parser.parse('"序" -> 序;🏭 =>> 👳 : 👷+🔧;')).to.deep.equal(gUnicodeEntityInArcFixture);
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
            expect(parser.parse('a, b; a opt b{};')).to.deep.equal(lFixture);
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
        it("should throw a SyntaxError on a missing semi colon after the options list", function() {
            tst.assertSyntaxError('wordwraparcs="true" a, b; a -> b;', parser);
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
            expect(lAST).to.deep.equal(fix.astCheatSheet);
        });
    });

    describe('#parse() - expansions', function() {
        it('should render a simple AST, with an alt', function() {
            var lAST = parser.parse('a=>b; b alt c { b => c; c >> b;};');
            expect(lAST).to.deep.equal(fix.astOneAlt);
        });
        it('should render an AST, with alts, loops and labels (labels in front)', function() {
            var lAST = parser.parse('a => b; a loop c: "label for loop" { b alt c: "label for alt" { b -> c: -> within alt; c >> b: >> within alt; }; b >> a: >> within loop;}; a =>> a: happy-the-peppy - outside;...;');
            expect(lAST).to.deep.equal(fix.astAltWithinLoop);
        });
        it('should render an AST, with an alt in it', function() {
            var lAST = parser.parse('a alt b {  c -> d; };');
            expect(lAST).to.deep.equal(fix.astDeclarationWithinArcspan);
        });
        it('automatically declares entities in the right order', function() {
            var lAST = parser.parse ('# A,a, c, d, b, B;\nA loop B {  a alt b { c -> d; c => B; };};');
            expect(lAST).to.deep.equal(gCorrectOrderFixture);
        });
        it("should throw a SyntaxError on an inline expression without {}", function() {
            tst.assertSyntaxError('a loop b', parser);
        });
        it("should throw a SyntaxError on an inline expression with a label, without {}", function() {
            tst.assertSyntaxError('a loop b : ', parser);
        });
        it("should throw a SyntaxError on an inline expression with a label, without {}", function() {
            tst.assertSyntaxError('a loop b : label', parser);
        });
        it("should throw a SyntaxError on a missing closing bracket", function() {
            tst.assertSyntaxError('a loop b {', parser);
        });
        it("should throw a SyntaxError on a missing semi after a closing bracket", function() {
            tst.assertSyntaxError('a loop b {}', parser);
        });

    });
    describe('#parse() - file based tests', function(){
        it("should parse all possible arcs", function() {
            var lTextFromFile = fs.readFileSync(path.join(__dirname, '../fixtures/test01_all_possible_arcs_msgenny.msgenny'), {"encoding":"utf8"});
            var lAST = parser.parse(lTextFromFile.toString());
            tst.assertequalToFileJSON(path.join(__dirname, '../fixtures/test01_all_possible_arcs_msgenny.json'), lAST);
        });
    });
});
