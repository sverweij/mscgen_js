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
    
return {
    assertequalJSONFile : function(pExpectedFileName, pFound) {
        var lJSONFromFile = fs.readFileSync(pExpectedFileName, {"encoding": "utf8"});
        expect(pFound).to.deep.equal(JSON.parse(lJSONFromFile));
    },

    assertequalToFile : function(pExpectedFileName, pFound) {
        expect(
            hashit(pFound)
        ).to.equal(
            hashit(fs.readFileSync(pExpectedFileName, {"encoding": "utf8"}))
        );
    },
    
    assertequalFile : function(pFound, pExpectedFileName) {
        assert.equal(
            hashit(fs.readFileSync(pFound, {"encoding": "utf8"})), 
            hashit(fs.readFileSync(pExpectedFileName, {"encoding": "utf8"}))
        );
    },

    assertequalProcessingXML : function(pExpectedFileName, pInputFileName, pProcessingFn){
        var lExpectedContents = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});
        var lProcessedInput   = pProcessingFn (
            fs.readFileSync(pInputFileName, {"encoding" : "utf8"})
        );
        
        expect(lProcessedInput).xml.to.be.valid();
        expect(lProcessedInput).xml.to.deep.equal(lExpectedContents);
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
            var lAST = pParser.parse(pProgram);
            var lStillRan = false;
            if (lAST) {
                lStillRan = true;
            }
            expect(lStillRan).to.equal(false);
        } catch(e) {
            expect(e.name).to.equal(pErrorType);
        }
    }
};

})();
