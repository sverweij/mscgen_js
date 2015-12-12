var flatten = require("../../../render/text/flatten");
var fix     = require("../../astfixtures");
var expect  = require("chai").expect;

describe('render/text/flatten', function() {
    describe('unwind', function() {
        it('should return an "unwound" version of the simple one alt ', function() {
            expect(flatten.unwind(fix.astOneAlt)).to.deep.equal(fix.astOneAltUnwound);
        });
        it('should return an "unwound" version of an alt within a loop ', function() {
            expect(flatten.unwind(fix.astAltWithinLoop)).to.deep.equal(fix.astAltWithinLoopUnWound);
        });
        it('should keep comments within arc spanning arc bounds', function() {
            expect(flatten.unwind(fix.astOptWithComment)).to.deep.equal(fix.astOptWithCommentUnWound);
        });
        it('should distribute the arc* colors to underlying arcs (one level)', function() {
            expect(flatten.unwind(fix.astInlineWithArcColor)).to.deep.equal(fix.astInlineWithArcColorUnWound);
        });
        it('should distribute the arc* colors to underlying arcs (one level, but not more)', function() {
            expect(flatten.unwind(fix.astNestedInlinesWithArcColor)).to.deep.equal(fix.astNestedInlinesWithArcColorUnWound);
        });
    });

    describe('explodeBroadcasts', function() {
        it('leave asts without broadcasts alone', function() {
            expect(flatten.explodeBroadcasts(fix.astAltWithinLoop)).to.deep.equal(fix.astAltWithinLoop);
        });
        it('explode b->* to parallel calls to all other entities', function() {
            expect(flatten.explodeBroadcasts(fix.astSimpleBroadcast)).to.deep.equal(fix.astSimpleBroadcastExploded);
        });
        it('explode a little more complex broadcast ast to parallel calls to all other entities', function() {
            expect(flatten.explodeBroadcasts(fix.astComplexerBroadcast)).to.deep.equal(fix.astComplexerBroadcastExploded);
        });
        it('correctly explode a broadcast that has other arcs in the same arc row', function() {
            expect(flatten.explodeBroadcasts(fix.astSameArcRowBroadcast)).to.deep.equal(fix.astSameArcRowBroadcastExploded);
        });
    });

});
