var assert = require("assert");
var fs = require('fs');

module.exports = (function() {
    function _assertequalJSON(pExpected, pFound) {
        assert.equal(JSON.stringify(pFound), JSON.stringify(pExpected));
    }

    function _assertequalJSONFile(pExpectedFileName, pFound) {
        fs.readFile(pExpectedFileName, function(pErr, pJSONFromFile) {
            if (pErr) {
                throw pErr;
            }
            assert.equal(JSON.stringify(pFound), JSON.stringify(JSON.parse(pJSONFromFile)));
        });
    }

    function _assertequalToFile(pExpectedFileName, pFound) {
        fs.readFile(pExpectedFileName, function(pErr, pTextFromFile) {
            if (pErr)
                throw pErr;
            assert.equal(pFound, pTextFromFile);
        });
    }

    return {
        assertequalJSON : function(pExpected, pFound) {
            return _assertequalJSON(pExpected, pFound);
        },
        assertequalJSONFile : function(pExpectedFileName, pFound) {
            return _assertequalJSONFile(pExpectedFileName, pFound);
        },
        assertequalToFile : function(pExpectedFileName, pFound) {
            return _assertequalToFile(pExpectedFileName, pFound);
        },
    };
})();
