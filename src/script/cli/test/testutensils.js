var assert = require("chai").assert;
var fs     = require('fs');
var crypto = require('crypto');
var chai   = require("chai");
var expect = chai.expect;
chai.use(require("chai-xml"));

module.exports = (function() {
    var gHashToUse = [ 'ripemd160', 'md5', 'sha1'].filter(function(h){
        return crypto.getHashes().indexOf(h) > -1;
    })[0];

    function hashit(pString){
        return crypto.createHash(gHashToUse).update(pString).digest('hex');
    }

    function assertequalToFileJSON(pExpectedFileName, pFound) {
        expect(
            pFound
        ).to.deep.equal(
            JSON.parse(
                fs.readFileSync(pExpectedFileName, {"encoding": "utf8"})
            )
        );
    }
    return {

        assertequalFileJSON : function(pFoundFileName, pExpectedFileName){
            assertequalToFileJSON(
                pExpectedFileName,
                JSON.parse(
                    fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
                )
            );
        },

        assertequalToFile: function assertequalToFile(pExpectedFileName, pFoundFileName){
            expect(
                fs.readFileSync(pFoundFileName, {"encoding":"utf8"})
            ).to.equal(
                fs.readFileSync(pExpectedFileName, {"encoding":"utf8"})
            );
        }
    };

})();
