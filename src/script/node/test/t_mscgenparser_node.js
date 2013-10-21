var assert = require("assert");
var parser = require("../mscgenparser_node");
var tst = require("./testutensils");
var fix = require("./astfixtures");

describe('mscgenparser', function() {
    describe('#parse() - simple script', function() {

        it('should render a simple AST, with two entities auto declared', function() {
            var lAST = parser.parse('msc { a,b; a => b [label="a simple script"];}');
            tst.assertequalJSON(lAST, fix.astSimple());
        });

        it("should produce an (almost empty) AST for empty input", function() {
            var lAST = parser.parse("msc{}");
            tst.assertequalJSON(lAST, fix.astEmpty());
        });
        it("should produce an AST even when non entity arcs are its only content", function(){
            var lAST = parser.parse('msc{--- [label="start"]; ... [label="no entities ..."]; ---[label="end"];}');
            tst.assertequalJSON(lAST, fix.astNoEntities());
        });
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

