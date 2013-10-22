var assert = require("assert");
var renderer = require("../ast2msgenny");
var fix = require("./astfixtures");

describe('ast2msgenny', function() {
    describe('#renderAST() - simple syntax tree', function() {

        it('should, given a simple syntax tree, render a msgenny script', function() {
            var lProgram = renderer.render(fix.astSimple());
            var lExpectedProgram = "a, b;\n" + "\n" + "a => b : a simple script;\n";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should wrap labels with a , in quotes", function() {
            var lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "comma,"
                }]
            };
            var lProgram = renderer.render(lAST);
            var lExpectedProgram = "a : \"comma,\";\n\n";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should wrap labels with a ; in quotes", function() {
            var lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "semi; colon"
                }]
            };
            var lProgram = renderer.render(lAST);
            var lExpectedProgram = "a : \"semi; colon\";\n\n";
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should render options when they're in the syntax tree", function() {
            var lProgram = renderer.render(fix.astOptions());
            var lExpectedProgram = 'hscale="1.2",\nwidth="800",\narcgradient="17",\nwordwraparcs="true";\n\na;\n\n';
            assert.equal(lProgram, lExpectedProgram);
        });
        it("should ignore all attributes, except label and name", function () {
            var lProgram = renderer.render(fix.astAllAttributes());
            var lExpectedPorgram = "a : Label for A;\n\na <<=>> a : Label for a <<=>> a;\n";
            assert.equal(lProgram, lExpectedPorgram);
        });

    });
});
