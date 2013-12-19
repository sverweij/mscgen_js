var assert = require("assert");

module.exports = (function() {
    function _assertequalJSON(pExpected, pFound) {
        assert.equal(JSON.stringify(pFound), JSON.stringify(pExpected));
    }

    return {
        assertequalJSON : function(pExpected, pFound) {
            return _assertequalJSON(pExpected, pFound);
        }
    };
})();
