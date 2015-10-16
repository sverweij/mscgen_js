var assert = require("assert");
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
    assertequalJSON : function(pExpected, pFound) {
        expect(pFound).to.deep.equal(pExpected);
    },

    assertequalJSONFile : function(pExpectedFileName, pFound) {
        var lJSONFromFile = fs.readFileSync(pExpectedFileName, {"encoding": "utf8"});
        expect(pFound).to.deep.equal(JSON.parse(lJSONFromFile));
    },

    assertequalToFile : function(pExpectedFileName, pFound) {
        assert.equal(hashit(pFound), hashit(fs.readFileSync(pExpectedFileName, {"encoding": "utf8"})));
    },
    
    assertequalFile : function(pFound, pExpectedFileName) {
        assert.equal(hashit(fs.readFileSync(pFound, {"encoding": "utf8"})), hashit(fs.readFileSync(pExpectedFileName, {"encoding": "utf8"})));
    },
    assertequalProcessingXML : function(pExpectedFileName, pInputFileName, pProcessingFn){
        var lExpectedContents = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});
        var lInputContents    = fs.readFileSync(pInputFileName, {"encoding" : "utf8"});
        var lProcessedInput   = pProcessingFn(lInputContents);
        
        expect(lProcessedInput).xml.to.be.valid();
        expect(lProcessedInput).xml.to.deep.equal(lExpectedContents);
    },
    assertequalProcessing : function(pExpectedFileName, pInputFileName, pProcessingFn){
        var lExpectedContents = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});
        var lInputContents = fs.readFileSync(pInputFileName, {"encoding" : "utf8"});
        assert.equal(hashit(pProcessingFn(lInputContents)), hashit(lExpectedContents));
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
            assert.equal(lStillRan, false);
        } catch(e) {
            assert.equal(e.name, pErrorType);
        }
    }
};

})();
