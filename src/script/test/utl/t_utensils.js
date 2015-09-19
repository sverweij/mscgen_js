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
});
