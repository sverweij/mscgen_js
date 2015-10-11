var assert = require("assert");
var txt = require("../../../ui/utl/maps");

describe('ui/utl/maps', function() {

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
    
    describe('#correctLanguage() - ', function() {

        it('returns xu in case of mscgen with extensions ', function() {
            assert.equal(txt.correctLanguage(true, "mscgen"), "xu");
        });

        it('returns mscgen in case of xu witout extensions ', function() {
            assert.equal(txt.correctLanguage(false, "xu"), "mscgen");
        });

        it('returns msgenny with or without extensions', function() {
            assert.equal(txt.correctLanguage(true, "msgenny"), "msgenny");
            assert.equal(txt.correctLanguage(false, "msgenny"), "msgenny");
        });

        it('returns whatever language when  extensions null or undefined', function() {
            assert.equal(txt.correctLanguage(undefined, 'mscgen'), "mscgen");
            assert.equal(txt.correctLanguage(null, 'xu'), "xu");
        });
    });
    
    describe('#language2Mode() - ', function() {

        it('returns xu when presented with mscgen', function() {
            assert.equal(txt.language2Mode("mscgen"), "text/x-xu");
        });

        it('returns application/json in case of json', function() {
            assert.equal(txt.language2Mode("json"), "application/json");
        });

        it('returns msgenny in case of msgenny', function() {
            assert.equal(txt.language2Mode("msgenny"), "text/x-msgenny");
        });
        
        it('returns xu in case of xu', function() {
            assert.equal(txt.language2Mode("xu"), "text/x-xu");
        });
        
        it('returns whatever in case of whatever', function() {
            assert.equal(txt.language2Mode("whatever"), "whatever");
        });
        
        it('returns text/x-mscgen in case of text/x-mscgen', function() {
            assert.equal(txt.language2Mode("text/x-mscgen"), "text/x-mscgen");
        });
    });

});
