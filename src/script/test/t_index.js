var mscgenjs = require("..");
var tst      = require("./testutensils");
var fix      = require("./astfixtures");
var expect   = require("chai").expect;

var gExpectedMscGenOutput = 'msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  b -- c;\n\
    b => c;\n\
    c >> b;\n\
#;\n\
}';

/* 
 * NOTE: the cli/t_actions.js already excercises index.js for most scenarios. 
 *       These tests cover the rest
 */

describe('index', function() {
    function isMscGenParser(pParser){
        tst.assertSyntaxError('xu { watermark="this is only valid in xu"; a,b; a->b;}', pParser);
        expect(
            pParser.parse('msc { a,"b space"; a => "b space" [label="a simple script"];}')
        ).to.deep.equal(
            fix.astSimple
        );
    }
    
    function isMscGenTextRenderer(pRenderer){
        expect(pRenderer.render(fix.astOneAlt)).to.equal(gExpectedMscGenOutput);        
    }

    describe('#getParser()', function() {
        it("Returns the mscgen parser when not provided with arguments", function() {
            isMscGenParser(mscgenjs.getParser());
        });
        it('Returns the MscGen parser when not provided with a valid argument', function() {
            isMscGenParser(mscgenjs.getParser("c++"));
        });
    });
    
    describe('#getTextRenderer()', function(){
        it('Returns the ast2mscgen renderer when not provided with arguments', function(){
            isMscGenTextRenderer(mscgenjs.getTextRenderer());
        });
        
        it('Returns the ast2mscgen renderer when not with a valid argument', function(){
            isMscGenTextRenderer(mscgenjs.getTextRenderer("some weird xmi format"));
        });
    });
});
