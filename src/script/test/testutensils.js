var assert = require("chai").assert;
var fs     = require('fs');
var crypto = require('crypto');
var chai   = require("chai");
var expect = chai.expect;
chai.use(require("chai-xml"));

var gHashToUse = [ 'ripemd160', 'md5', 'sha1'].filter(function(h){
    return crypto.getHashes().indexOf(h) > -1;
})[0];

module.exports = (function() {

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
    assertequalToFileJSON : assertequalToFileJSON,

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
    },

    assertequalFileXML : function (pFoundFileName, pExpectedFileName){
        var lFound    = fs.readFileSync(pFoundFileName, {"encoding" : "utf8"});
        var lExpected = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});

        expect(lFound).xml.to.be.valid();
        expect(lFound).xml.to.deep.equal(lExpected);
    },

    assertequalProcessingXML : function(pExpectedFileName, pInputFileName, pProcessingFn){
        var lProcessedInput   = pProcessingFn (
            fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
        );

        expect(lProcessedInput).xml.to.be.valid();
        expect(
            lProcessedInput
        ).xml.to.deep.equal(
            fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"})
        );
    },

    assertequalProcessing : function(pExpectedFileName, pInputFileName, pProcessingFn){
        assert.equal(
            hashit(
                pProcessingFn(
                    fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
                )
            ),
            hashit(
                fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"})
            )
        );
    },

    assertSyntaxError: function(pProgram, pParser, pErrorType){
        if (!pErrorType){
            pErrorType = "SyntaxError";
        }
        try {
            var lStillRan = false;
            if (pParser.parse(pProgram)) {
                lStillRan = true;
            }
            expect(lStillRan).to.equal(false);
        } catch(e) {
            expect(e.name).to.equal(pErrorType);
        }
    }
};

})();
