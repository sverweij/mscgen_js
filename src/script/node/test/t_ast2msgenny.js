var assert = require("assert");
var renderer = require("../ast2msgenny");

describe('ast2msgenny', function() {
    describe('#renderAST() - simple syntax tree', function() {

        it('should, given a simple syntax tree, render a msgenny script', function() {
            var lAST = {
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b"
                }],
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "a",
                    "to" : "b",
                    "label" : "a simple syntax tree"
                }]]
            };
            var lExpectedProgram = "a, b;\n" + "\n" + "a => b : a simple syntax tree;\n";
            var lProgram = renderer.render(lAST);
            assert.equal(lProgram, lExpectedProgram);
        });

        it("should surround labels with a , them with quotes", function() {
            var lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "comma,"
                }]
            };
            var lExpectedProgram = "a : \"comma,\";\n\n";
            var lProgram = renderer.render(lAST);

            assert.equal(lProgram, lExpectedProgram);
        });

        it("should surround labels with a ; them with quotes", function() {
            var lAST = {
                "entities" : [{
                    "name" : "a",
                    "label" : "semi; colon"
                }]
            };
            var lExpectedProgram = "a : \"semi; colon\";\n\n";
            var lProgram = renderer.render(lAST);

            assert.equal(lProgram, lExpectedProgram);
        });

        it("should render options when they're in the syntax tree", function() {
            var lASToptions = {
                "options" : {
                    "arcgradient" : "17",
                    "wordwraparcs" : "true",
                    "hscale" : "1.2",
                    "width" : "800"
                },
                "entities" : [{
                    "name" : "a"
                }]
            };
            var lExpectedProgram = "hscale=\"1.2\",\nwidth=\"800\",\narcgradient=\"17\",\nwordwraparcs=\"true\";\n\na;\n\n";
            var lProgram = renderer.render(lASToptions);

            assert.equal(lProgram, lExpectedProgram);

        });

    });
}); 