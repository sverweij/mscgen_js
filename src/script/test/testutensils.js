var assert = require("assert");
var fs = require('fs');

module.exports = (function() {
return {
    assertequalJSON : function(pExpected, pFound) {
        assert.equal(JSON.stringify(pExpected), JSON.stringify(pFound));
    },

    assertequalJSONFile : function(pExpectedFileName, pFound) {
        var lJSONFromFile = fs.readFileSync(pExpectedFileName, {"encoding": "utf8"});
        assert.equal(JSON.stringify(pFound), JSON.stringify(JSON.parse(lJSONFromFile)));
    },

    assertequalToFile : function(pExpectedFileName, pFound) {
        assert.equal(pFound, fs.readFileSync(pExpectedFileName, {"encoding": "utf8"}));
    },
    
    assertequalProcessing : function(pExpectedFileName, pInputFileName, pProcessingFn){
        var lExpectedContents = fs.readFileSync(pExpectedFileName, {"encoding" : "utf8"});
        var lInputContents = fs.readFileSync(pInputFileName, {"encoding" : "utf8"});
        assert.equal(lExpectedContents, pProcessingFn(lInputContents));
    }
};

})();
