var assert = require("assert");
var renderer = require("../ast2mscgen");
var fix = require("./astfixtures");

describe('ast2mscgen', function() {
    describe('#renderAST() - simple syntax tree', function() {
        it('should, given a simple syntax tree, render a mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple);
            var lExpectedProgram = 'msc {\n  a,\n  b;\n' + '\n' + '  a => b [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it('should, given a simple syntax tree, render a mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple, false);
            var lExpectedProgram = 'msc {\n  a,\n  b;\n' + '\n' + '  a => b [label="a simple script"];\n}';
            assert.equal(lProgram, lExpectedProgram);
        });

        it('should, given a simple syntax tree, render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astSimple, true);
            var lExpectedProgram = 'msc{a,b;a=>b[label="a simple script"];}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });
    
    describe('#renderAST() - option only', function() {
        it('should render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astOptions, true);
            var lExpectedProgram = 'msc{hscale="1.2",width="800",arcgradient="17",wordwraparcs="true";a;}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });
    
    describe('#renderAST() - notes and boxes in minification', function() {
        it('should render a "minified" mscgen script', function() {
            var lProgram = renderer.render(fix.astBoxes, true);
            var lExpectedProgram = 'msc{a,b;a note b;a box a,b rbox b;b abox a;}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });
    
    describe('#renderAST() - xu compatible', function() {
        it('alt only - render correct script', function() {
            var lProgram = renderer.render(fix.astOneAlt);
            var lExpectedProgram = 
'msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  b -- c;\n\
    b => c;\n\
    c >> b;\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it('alt within loop - render correct script', function() {
            var lProgram = renderer.render(fix.astAltWithinLoop);
            var lExpectedProgram =
'msc {\n\
  a,\n\
  b,\n\
  c;\n\
\n\
  a => b;\n\
  a -- c [label="label for loop"];\n\
    b -- c [label="label for alt"];\n\
      b -> c [label="-> within alt"];\n\
      c >> b [label=">> within alt"];\n\
    b >> a [label=">> within loop"];\n\
  a =>> a [label="happy-the-peppy - outside"];\n\
  ...;\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });

});
