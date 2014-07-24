var assert = require("assert");
var flatten = require("../render/text/flatten");
var fix = require("./astfixtures");
var utl = require("./testutensils");

describe('flatten', function() {
    describe('unwind', function() {
        it('should return an "unwound" version of the simple one alt ', function() {
            utl.assertequalJSON(fix.astOneAltUnwound, flatten.unwind(fix.astOneAlt));
        });
        it('should return an "unwound" version of an alt within a loop ', function() {
            utl.assertequalJSON(fix.astAltWithinLoopUnWound, flatten.unwind(fix.astAltWithinLoop));
        });
        it('should keep comments within arc spanning arc bounds', function() {
            utl.assertequalJSON(fix.astOptWithCommentUnWound, flatten.unwind(fix.astOptWithComment));
        });
        it('should distribute the arc* colors to underlying arcs (one level)', function() {
            utl.assertequalJSON(fix.astInlineWithArcColorUnWound, flatten.unwind(fix.astInlineWithArcColor));
        });
        it('should distribute the arc* colors to underlying arcs (one level, but not more)', function() {
            utl.assertequalJSON(fix.astNestedInlinesWithArcColorUnWound, flatten.unwind(fix.astNestedInlinesWithArcColor));
        });
    });

    describe('explodeBroadcasts', function() {
        it('leave asts without broadcasts alone', function() {
            utl.assertequalJSON(fix.astAltWithinLoop, flatten.explodeBroadcasts(fix.astAltWithinLoop));
        });
        it('explode b->* to parallel calls to all other entities', function() {
            utl.assertequalJSON(fix.astSimpleBroadcastExploded, flatten.explodeBroadcasts(fix.astSimpleBroadcast));
        });
        it('explode a little more complex broadcast ast to parallel calls to all other entities', function() {
            utl.assertequalJSON(fix.astComplexerBroadcastExploded, flatten.explodeBroadcasts(fix.astComplexerBroadcast));
        });
        it('correctly explode a broadcast that has other arcs in the same arc row', function() {
            utl.assertequalJSON(fix.astSameArcRowBroadcastExploded, flatten.explodeBroadcasts(fix.astSameArcRowBroadcast));
        });
    });

});

