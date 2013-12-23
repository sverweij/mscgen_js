var assert = require("assert");
var flatten = require("../flatten");
var fix = require("./astfixtures");
var utl = require("./testutensils");

describe('unwind', function() {
    describe('#run', function() {
        it('should return an "unwound" version of the simple one alt ', function() {
            utl.assertequalJSON(fix.astOneAltUnwound(), flatten.unwind(fix.astOneAlt()));
        });
        it('should return an "unwound" version of an alt within a loop ', function() {
            utl.assertequalJSON(fix.astAltWithinLoopUnWound(), flatten.unwind(fix.astAltWithinLoop()));
        });
        it('when already unwound, should return the identical AST (one alt) ', function() {
            utl.assertequalJSON(fix.astOneAltUnwound(), flatten.unwind(fix.astOneAltUnwound()));
        });
        it('when already unwound, should return the identical AST (alt wihtin a loop) ', function() {
            utl.assertequalJSON(fix.astAltWithinLoopUnWound(), flatten.unwind(fix.astAltWithinLoopUnWound()));
        });
        it('should keep comments within arc spanning arc bounds', function() {
            utl.assertequalJSON(fix.astOptWithCommentUnWound(), flatten.unwind(fix.astOptWithComment()));
        });
        it ('should distribute the arc* colors to underlying arcs', function(){
            utl.assertequalJSON(fix.astInlineWithArcColorUnWound(), flatten.unwind(fix.astInlineWithArcColor()));
        });
    });

});

