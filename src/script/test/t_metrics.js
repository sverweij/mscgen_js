var assert = require("assert");
var stats = require("../render/text//attic/metrics");
var fix = require("./astfixtures");

describe('metrics', function() {
    describe('#getStats(fix.astBroadcastCounting()) ', function() {
        var lStats = stats.getStats(fix.astBroadcastCounting);

        it("should correctly count entities", function() {
            assert.equal(lStats.entityCount, 4);
        });

        it("should correctly calculate the minimum no of arcs on any entity", function() {
            assert.equal(lStats.minInOutCount, 2);
        });

        it("should correctly calculate the maximum no of arcs on any entity", function() {
            assert.equal(lStats.maxInOutCount, 5);
        });

        it("should correctly calculate total numbers of ins and outs", function() {
            assert.equal(lStats.totalInCount, 7);
            assert.equal(lStats.totalOutCount, 7);
            assert.equal(lStats.totalInOutCount, 14);
        });

        it("should correctly calculate total numbers of ins and outs", function() {
            assert.equal(lStats.avgInCount, 7 / 4);
            assert.equal(lStats.avgOutCount, 7 / 4);
            assert.equal(lStats.avgInOutCount, 14 / 4);
        });

        it("should have an entity 'a' with 1 in, 4 out, 5 total", function() {
            assert.equal(lStats.entityStats["a"].incount, 1);
            assert.equal(lStats.entityStats["a"].outcount, 4);
            assert.equal(lStats.entityStats["a"].inoutcount, 5);
        });

        it("should have an entity 'b' with 2 in, 3 out, 5 total", function() {
            assert.equal(lStats.entityStats["b"].incount, 2);
            assert.equal(lStats.entityStats["b"].outcount, 3);
            assert.equal(lStats.entityStats["b"].inoutcount, 5);
        });

        it("should have an entity 'c' with 2 in, 0 out, 2 total", function() {
            assert.equal(lStats.entityStats["c"].incount, 2);
            assert.equal(lStats.entityStats["c"].outcount, 0);
            assert.equal(lStats.entityStats["c"].inoutcount, 2);
        });

        it("should have an entity 'd' with 2 in, 0 out, 2 total", function() {
            assert.equal(lStats.entityStats["d"].incount, 2);
            assert.equal(lStats.entityStats["d"].outcount, 0);
            assert.equal(lStats.entityStats["d"].inoutcount, 2);
        });
    });

    describe('#getStats(fix.astCountingTest()) ', function() {
        var lStats = stats.getStats(fix.astCountingTest);

        it("should correctly count entities", function() {
            assert.equal(lStats.entityCount, 6);
        });

        it("should correctly calculate the minimum no of arcs on any entity", function() {
            assert.equal(lStats.minInOutCount, 0);
        });

        it("should correctly calculate the maximum no of arcs on any entity", function() {
            assert.equal(lStats.maxInOutCount, 4);
        });

        it("should correctly calculate total numbers of ins and outs", function() {
            assert.equal(lStats.totalInCount, 6);
            assert.equal(lStats.totalOutCount, 6);
            assert.equal(lStats.totalInOutCount, 12);
        });

        it("should have an entity 'a' with 0 in, 2 out, 2 total", function() {
            assert.equal(lStats.entityStats["a"].incount, 0);
            assert.equal(lStats.entityStats["a"].outcount, 2);
            assert.equal(lStats.entityStats["a"].inoutcount, 2);
        });

        it("should have an entity 'b' with 2 in, 0 out, 2 total", function() {
            assert.equal(lStats.entityStats["b"].incount, 2);
            assert.equal(lStats.entityStats["b"].outcount, 0);
            assert.equal(lStats.entityStats["b"].inoutcount, 2);
        });

        it("should have an entity 'c' with 2 in, 2 out, 4 total", function() {
            assert.equal(lStats.entityStats["c"].incount, 2);
            assert.equal(lStats.entityStats["c"].outcount, 2);
            assert.equal(lStats.entityStats["c"].inoutcount, 4);
        });

        it("should have an entity 'd' with 2 in, 2 out, 4 total", function() {
            assert.equal(lStats.entityStats["d"].incount, 2);
            assert.equal(lStats.entityStats["d"].outcount, 2);
            assert.equal(lStats.entityStats["d"].inoutcount, 4);
        });

        it("should have an entity 'e' with 0 in, 0 out, 0 total", function() {
            assert.equal(lStats.entityStats["e"].incount, 0);
            assert.equal(lStats.entityStats["e"].outcount, 0);
            assert.equal(lStats.entityStats["e"].inoutcount, 0);
        });

        it("should have an entity 'f' with 0 in, 0 out, 0 total", function() {
            assert.equal(lStats.entityStats["f"].incount, 0);
            assert.equal(lStats.entityStats["f"].outcount, 0);
            assert.equal(lStats.entityStats["f"].inoutcount, 0);
        });
    });
});
