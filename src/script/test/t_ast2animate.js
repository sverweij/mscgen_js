var assert = require("assert");
var animate = require("../render/text/ast2animate");
var parser = require("../parse/mscgenparser_node");
var fix = require("./astfixtures");
var utl = require("./testutensils");
var fs = require("fs");

describe('ast2animate', function() {
    var astCheatSheet0 = {
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        arcs : [
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}]
        ]
    };
    var astCheatSheet1 = {
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}]
        ]
    };
    var astCheatSheet2 = {
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }], [{
            "kind" : "=>",
            "from" : "a",
            "to" : "b",
            "label" : "a => b  (method)"
        }],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}]
        ]
    };
    var astCheatSheet3 = {
        "entities" : [{
            "name" : "a"
        }, {
            "name" : "b"
        }],
        "arcs" : [[{
            "kind" : "->",
            "from" : "a",
            "to" : "b",
            "label" : "a -> b  (signal)"
        }], [{
            "kind" : "=>",
            "from" : "a",
            "to" : "b",
            "label" : "a => b  (method)"
        }], [{
            "kind" : ">>",
            "from" : "b",
            "to" : "a",
            "label" : "b >> a  (return value)"
        }],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}],
                [{"kind": "|||"}]
        ]
    };

    describe('#getLength()', function() {
        it('should return a length of 1 for astEmpty', function() {
            animate.init(fix.astEmpty);
            assert.equal(1, animate.getLength());
        });
        it('should return a length of 2 for astSimple', function() {
            animate.init(fix.astSimple);
            assert.equal(2, animate.getLength());
        });
        it('should return a length of 15 for astCheatSheet', function() {
            animate.init(fix.astCheatSheet);
            assert.equal(15, animate.getLength());
        });
    });

    describe('#getFrame(0)', function() {
        it('should return astEmpty for astEmpty', function() {
            animate.init(fix.astEmpty);
            utl.assertequalJSON(animate.getFrame(0), fix.astEmpty);
        });
        it('should return entities for astSimple', function() {
            animate.init(fix.astSimple);
            var astSimpleEntitiesOnly = {
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b space"
                }],
                arcs : [[{"kind": "|||"}]]
            };
            utl.assertequalJSON(animate.getFrame(0), astSimpleEntitiesOnly);
        });

        it('should return entities for astCheatSheet', function() {
            animate.init(fix.astCheatSheet);
            utl.assertequalJSON(animate.getFrame(0), astCheatSheet0);
        });

        it('should return entities for astCheatSheet for length < 0', function() {
            animate.init(fix.astCheatSheet);
            utl.assertequalJSON(animate.getFrame(-481), astCheatSheet0);
        });

    });

    describe('#getFrame(getLength())', function() {
        it('should return astEmpty for astEmpty', function() {
            animate.init(fix.astEmpty);
            utl.assertequalJSON(animate.getFrame(animate.getLength()), fix.astEmpty);
        });
        it('should return astSimple for astSimple', function() {
            animate.init(fix.astSimple);
            utl.assertequalJSON(animate.getFrame(animate.getLength()), fix.astSimple);
        });
        it('should return astCheatSheet for astCheatSheet', function() {
            animate.init(fix.astCheatSheet);
            utl.assertequalJSON(animate.getFrame(animate.getLength()), fix.astCheatSheet);
        });
        it('should return astCheatSheet for astCheatSheet and length === somethingbig', function() {
            animate.init(fix.astCheatSheet);
            utl.assertequalJSON(animate.getFrame(481), fix.astCheatSheet);
        });
    });

    describe('#getFrame()', function() {

        animate.init(fix.astCheatSheet);

        it('should return entities and first arc from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(animate.getFrame(1), astCheatSheet1);
        });

        it('should return entities and first three arcs from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(animate.getFrame(3), astCheatSheet3);
        });

        it('should return entities and first two arcs from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(animate.getFrame(2), astCheatSheet2);
        });
    });

    describe('#home, #end, #inc, #dec, #getPosition, #getCurrentFrame()', function() {
        animate.init(fix.astCheatSheet);
        it('getCurrentFrame should return astCheatSheet after call to end()', function() {
            animate.end();
            assert.equal(15, animate.getPosition());
            utl.assertequalJSON(animate.getCurrentFrame(), fix.astCheatSheet);
        });
        it('getCurrentFrame should return astCheatSheet1 after end() and 12 calls to dec()', function() {
            animate.end();
            for (var i = 0; i < 14; i++ ) {
                animate.dec();
            }
            assert.equal(1, animate.getPosition());
            utl.assertequalJSON(animate.getCurrentFrame(), astCheatSheet1);
        });
        it('getCurrentFrame should return astCheatSheet2 after call to home() and two calls to inc()', function() {
            animate.home();
            animate.inc();
            animate.inc();
            assert.equal(2, animate.getPosition());
            utl.assertequalJSON(animate.getCurrentFrame(), astCheatSheet2);
        });
        it('getCurrentFrame should return entities only after call to home()', function() {
            animate.home();
            assert.equal(0, animate.getPosition());
            utl.assertequalJSON(animate.getCurrentFrame(), astCheatSheet0);
        });
    });
});
