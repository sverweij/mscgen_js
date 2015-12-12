var assert   = require("assert");
var renderer = require("../../../render/text/ast2xu");
var fix      = require("../../astfixtures");
var fs       = require("fs");
var path     = require('path');
var parser   = require("../../../parse/xuparser_node");
var expect   = require("chai").expect;

describe('render/text/ast2xu', function() {
    describe('#renderAST() - simple syntax tree', function() {
        it('should, given a simple syntax tree, render a mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple);
            var lExpectedProgram = 'msc {\n  a,\n  "b space";\n\n  a => "b space" [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });

        it('should, given a simple syntax tree, render a mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple, false);
            var lExpectedProgram = 'msc {\n  a,\n  "b space";\n\n  a => "b space" [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });

        it('should, given a simple syntax tree, render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple, true);
            var lExpectedProgram = 'msc{a,"b space";a => "b space"[label="a simple script"];}';
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should preserve the comments at the start of the ast", function() {
            var lProgram = renderer.render(fix.astWithPreComment);
            var lExpectedProgram = "# pre comment\n/* pre\n * multiline\n * comment\n */\nmsc {\n  a,\n  b;\n\n  a -> b;\n}";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should preserve attributes", function() {
            var lProgram = renderer.render(fix.astAttributes);
            var lExpectedProgram = "msc {\n  Alice [linecolor=\"#008800\", textcolor=\"black\", textbgcolor=\"#CCFFCC\", arclinecolor=\"#008800\", arctextcolor=\"#008800\"],\n  Bob [linecolor=\"#FF0000\", textcolor=\"black\", textbgcolor=\"#FFCCCC\", arclinecolor=\"#FF0000\", arctextcolor=\"#FF0000\"],\n  pocket [linecolor=\"#0000FF\", textcolor=\"black\", textbgcolor=\"#CCCCFF\", arclinecolor=\"#0000FF\", arctextcolor=\"#0000FF\"];\n\n  Alice => Bob [label=\"do something funny\"];\n  Bob => pocket [label=\"fetch (nose flute)\", textcolor=\"yellow\", textbgcolor=\"green\", arcskip=\"0.5\"];\n  Bob >> Alice [label=\"PHEEE!\", textcolor=\"green\", textbgcolor=\"yellow\", arcskip=\"0.3\"];\n  Alice => Alice [label=\"hihihi\", linecolor=\"#654321\"];\n}";
            assert.equal(lProgram, lExpectedProgram);
        });

    });

    describe('#renderAST() - minification', function() {
        it('should render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astOptions, true);
            var lExpectedProgram = 'msc{hscale="1.2",width="800",arcgradient="17",wordwraparcs="true",watermark="not in mscgen, available in xù and msgenny";a;}';
            assert.equal(lProgram, lExpectedProgram);
        });

        it('should render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astBoxes, true);
            var lExpectedProgram = 'msc{a,b;a note b;a box a,b rbox b;b abox a;}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - xu compatible', function() {
        it('alt only - render correct script', function() {
            var lProgram = renderer.render(fix.astOneAlt);
            var lExpectedProgram =
'msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  b alt c {\n\
    b => c;\n\
    c >> b;\n\
  };\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it('alt within loop - render correct script', function() {
            var lProgram = renderer.render(fix.astAltWithinLoop);
            var lExpectedProgram =
'msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  a loop c [label="label for loop"] {\n\
    b alt c [label="label for alt"] {\n\
      b -> c [label="-> within alt"];\n\
      c >> b [label=">> within alt"];\n\
    };\n\
    b >> a [label=">> within loop"];\n\
  };\n\
  a =>> a [label="happy-the-peppy - outside"];\n\
  ...;\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should correctly render empty inline expressions", function() {
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
            var lProgram = renderer.render(lFixture);
            var lExpectedProgram =
'msc {\n\
  a,\n\
  b;\n\
\n\
  a opt b {\n\
  };\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

    describe('#renderAST() - file based tests', function() {
        it('should render all arcs', function() {
            var lASTString = fs.readFileSync(path.join(__dirname, "../../fixtures/test01_all_possible_arcs.json"), {
                "encoding" : "utf8"
            });
            var lAST = JSON.parse(lASTString);
            var lProgram = renderer.render(lAST);
            expect(parser.parse(lProgram)).to.deep.equal(lAST);
        });
    });

});
