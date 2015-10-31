var assert = require("assert");
var _ = require("../../utl/utensils");

describe('utl/utensils', function() {

    describe('#sanitizeBooleanesque() - ', function() {
        it('sanitize non booleanesque', function() {
            assert.equal(false, _.sanitizeBooleanesque("this is not a booleanesque"));
        });
        it('sanitize non booleanesque', function() {
            assert.equal(false, _.sanitizeBooleanesque(undefined));
        });
        it('sanitize booleanesque', function() {
            assert.equal(true, _.sanitizeBooleanesque("1"));
        });
        it('sanitize booleanesque', function() {
            assert.equal(false, _.sanitizeBooleanesque("0"));
        });
    });

    describe('#formatNumber() - ', function() {
        it('puts two spaces in front of a single digit on max width 3', function() {
            assert.equal(_.formatNumber(7, 3), "  7");
        });
        it('puts no spaces in front of a single digit on max width 1', function() {
            assert.equal(_.formatNumber(7, 1), "7");
        });
        it('puts no spaces in front of a single digit on max width 0', function() {
            assert.equal(_.formatNumber(7, 0), "7");
        });
        it('puts no spaces in front of a single digit on max width < 0', function() {
            assert.equal(_.formatNumber(7, -8), "7");
        });
        it('puts no spaces in front of a three digit number on max width 3', function() {
            assert.equal(_.formatNumber(481, 3), "481");
        });
    });
});
