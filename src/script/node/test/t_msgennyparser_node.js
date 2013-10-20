var assert = require("assert");
var parser = require("../msgennyparser_node");

describe('msgennyparser', function() {
    describe('#parse() - simple script', function() {

        it('should render a simple AST, with two entities auto declared', function() {
            lAST = parser.parse('a => b: a simple msgenny script;');
            assert.equal(JSON.stringify(lAST), JSON.stringify({
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b"
                }],
                "arcs" : [[{
                    "kind" : "=>",
                    "from" : "a",
                    "to" : "b",
                    "label" : "a simple msgenny script"
                }]]
            }));
        });

        it("should produce an (almost empty) AST for empty input");
        it("should produce an AST even when non entity arcs are its only content");
        it("should produce lowercase for upper/ mixed case arc kinds");
        it("should produce lowercase for upper/ mixed case options");
        it("should produce only 'true' or 'false' for all variants of wordwraparcs");
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
});

