var assert = require("assert");
var fs = require('fs');

module.exports = (function() {
    function _assertequalJSON(pExpected, pFound) {
        assert.equal(JSON.stringify(pExpected), JSON.stringify(pFound));
    }

    function _assertequalJSONFile(pExpectedFileName, pFound) {
        var lJSONFromFile = fs.readFileSync(pExpectedFileName, {"encoding": "utf8"});
        assert.equal(JSON.stringify(pFound), JSON.stringify(JSON.parse(lJSONFromFile)));
    }

    function _assertequalToFile(pExpectedFileName, pFound) {
        assert.equal(pFound, fs.readFileSync(pExpectedFileName, {"encoding": "utf8"}));
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
