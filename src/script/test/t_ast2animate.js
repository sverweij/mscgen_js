var assert = require("assert");
var ast2animate = require("../render/text/ast2animate");
var parser = require("../parse/xuparser_node");
var fix = require("./astfixtures");
var utl = require("./testutensils");
var fs = require("fs");

describe('ast2ani', function() {
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

/*
*/
    describe('#getLength()', function() {
        it('should return a length of 1 for astEmpty', function() {
            var ani = new ast2animate.FrameFactory();
            ani.init(fix.astEmpty);
            assert.equal(0, ani.getPosition());
            assert.equal(1, ani.getLength());
        });
        it('should return a length of 2 for astSimple', function() {
            var ani = new ast2animate.FrameFactory();
            ani.init(fix.astSimple);
            assert.equal(2, ani.getLength());
        });
        it('should return a length of 15 for astCheatSheet', function() {
            var ani = new ast2animate.FrameFactory();
            ani.init(fix.astCheatSheet);
            assert.equal(0, ani.getPosition());
            assert.equal(15, ani.getLength());
        });
    });

    describe('#getFrame(0)', function() {
        it('should return astEmpty for astEmpty', function() {
            var ani = new ast2animate.FrameFactory(fix.astEmpty);
            utl.assertequalJSON(ani.getFrame(0), fix.astEmpty);
        });
        it('should return entities for astSimple', function() {
            var ani = new ast2animate.FrameFactory(fix.astSimple);
            var astSimpleEntitiesOnly = {
                "entities" : [{
                    "name" : "a"
                }, {
                    "name" : "b space"
                }],
                arcs : [[{"kind": "|||"}]]
            };
            utl.assertequalJSON(ani.getFrame(0), astSimpleEntitiesOnly);
        });

        it('should return entities for astCheatSheet', function() {
            var ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            utl.assertequalJSON(ani.getFrame(0), astCheatSheet0);
        });

        it('should return entities for astCheatSheet for length < 0', function() {
            var ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            utl.assertequalJSON(ani.getFrame(-481), astCheatSheet0);
        });

    });

    describe('#getFrame(getLength())', function() {
        it('should return astEmpty for astEmpty', function() {
            var ani = new ast2animate.FrameFactory(fix.astEmpty);
            utl.assertequalJSON(ani.getFrame(ani.getLength()), fix.astEmpty);
        });
        it('should return astSimple for astSimple', function() {
            var ani = new ast2animate.FrameFactory(fix.astSimple);
            utl.assertequalJSON(ani.getFrame(ani.getLength()), fix.astSimple);
        });
        it('should return astCheatSheet for astCheatSheet', function() {
            var ani = new ast2animate.FrameFactory(fix.astCheatSheet);
            utl.assertequalJSON(ani.getFrame(ani.getLength()), fix.astCheatSheet);
        });
        it('should return astCheatSheet for astCheatSheet and length === somethingbig', function() {
            var ani = new ast2animate.FrameFactory(fix.astCheatSheet, true);
            utl.assertequalJSON(ani.getFrame(481), fix.astCheatSheet);
        });
    });

    describe('#getFrame()', function() {

        var ani = new ast2animate.FrameFactory(fix.astCheatSheet, true);

        it('should return entities and first arc from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(ani.getFrame(1), astCheatSheet1);
        });

        it('should return entities and first three arcs from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(ani.getFrame(3), astCheatSheet3);
        });

        it('should return entities and first two arcs from astCheatSheet for astCheatSheet', function() {
            utl.assertequalJSON(ani.getFrame(2), astCheatSheet2);
        });
    });


    describe('#home, #end, #inc, #dec, #getPosition, #getCurrentFrame #getPercentage', function() {
        var ani = new ast2animate.FrameFactory(fix.astCheatSheet, false);
        it('getCurrentFrame should return astCheatSheet after call to end()', function() {
            ani.end();
            assert.equal(15, ani.getPosition());
            assert.equal(100, ani.getPercentage());
            utl.assertequalJSON(ani.getCurrentFrame(), fix.astCheatSheet);
        });
        it('getCurrentFrame should return astCheatSheet1 after end() and 14 calls to dec()', function() {
            ani.end();
            ani.dec(14);
            assert.equal(1, ani.getPosition());
            assert.equal(100/15, ani.getPercentage());
            utl.assertequalJSON(ani.getCurrentFrame(), astCheatSheet1);
        });
        it('getCurrentFrame should return astCheatSheet2 after call to home() and two calls to inc()', function() {
            ani.home();
            ani.inc(2);
            assert.equal(2, ani.getPosition());
            assert.equal(200/15, ani.getPercentage());
            utl.assertequalJSON(ani.getCurrentFrame(), astCheatSheet2);
        });
        it('getCurrentFrame should return entities only after call to home()', function() {
            ani.home();
            ani.inc();
            ani.dec();
            assert.equal(0, ani.getPosition());
            assert.equal(0, ani.getPercentage());
            utl.assertequalJSON(ani.getCurrentFrame(), astCheatSheet0);
        });
    });

    describe('inline expressions', function(){
        var lTextFromFile = fs.readFileSync('./src/script/test/fixtures/simpleXuSample.xu', {"encoding":"utf8"});
        var lAST = parser.parse(lTextFromFile.toString());

        var ani = new ast2animate.FrameFactory(lAST, false);

        it('getLength for inline expressions takes expression length into account', function(){
            assert.equal(10, ani.getLength());
        });

        it('getNoRows takes inline expressions length into account', function(){
            assert.equal(9, ani.getNoRows());
        });

        it('produces the right frames - 0', function(){
            utl.assertequalJSONFile('./src/script/test/fixtures/xuframe00.json', ani.getFrame(0));
        });

        it('produces the right frames - 1', function(){
            utl.assertequalJSONFile('./src/script/test/fixtures/xuframe01.json', ani.getFrame(1));
        });

        it('produces the right frames - 2', function(){
            utl.assertequalJSONFile('./src/script/test/fixtures/xuframe02.json', ani.getFrame(2));
        });

        /*
        it('produces the right frames - 3', function(){
            utl.assertequalJSONFile('./src/script/test/fixtures/xuframe03.json', ani.getFrame(3));
        });

        it('produces the right frames - last', function(){
            ani.end();
            utl.assertequalJSONFile('./src/script/test/fixtures/simpleXuSample.json', ani.getCurrentFrame());
        });
        */
    });
});
