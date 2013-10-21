var assert = require("assert");

module.exports = (function() {
    function _assertequalJSON(pLeft, pRight) {
        assert.equal(JSON.stringify(pLeft), JSON.stringify(pRight));
    }

    return {
        assertequalJSON : function(pLeft, pRight) {
            return _assertequalJSON(pLeft, pRight);
        }
    };
})();
