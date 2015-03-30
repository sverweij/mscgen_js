var assert = require("assert");
var txt = require("../utl/maps");

describe('maps', function() {

    describe('#classifyExtension() - ', function() {

        it('empty string should classify as mscgen ', function() {
            assert.equal(txt.classifyExtension(''), "mscgen");
        });

        it('should classify as mscgen ', function() {
            assert.equal(txt.classifyExtension('raggerderag.msc'), "mscgen");
        });

        it('should classify as msgenny ', function() {
            assert.equal(txt.classifyExtension('daaris/;d"orgelm.msgenny'), "msgenny");
        });

        it('string ending with . should classify as mscgen', function() {
            assert.equal(txt.classifyExtension('aap.noot/mies.'), "mscgen");
        });

        it('should classify as ast/json ', function() {
            assert.equal(txt.classifyExtension('test01_all_arcs.json'), "json");
        });
    });

});
