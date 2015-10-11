var fs      = require("fs");
var actions = require("../../cli/actions");
var utl     = require("../testutensils");

var testPairs = [
    {
        title : "'-T svg -i rainbow.mscin tmp_rainbow.svg' - produces svg",
        input : {
            argument : "src/script/test/output/rainbow_mscgen_source.svg",
            options : {
                outputType : "svg",
                inputFrom  : "src/script/test/fixtures/rainbow.mscin"
            }
        },
        expected : "src/script/test/fixtures/rainbow_mscgen_source.svg"
    },
    {
        title : "'-p -i rainbow.mscin tmp_rainbow.json' - produces AST",
        input : {
            argument : "src/script/test/output/rainbow_mscgen_source.json",
            options : {
                inputFrom  : "src/script/test/fixtures/rainbow.mscin",
                parserOutput : true
                
            }
        },
        expected : "src/script/test/output/rainbow_mscgen_source.json"
    }
];

function resetOutputDir(){
    testPairs.forEach(function(pPair){
        try {
            if (!!pPair.input.argument){
                fs.unlinkSync(pPair.input.argument);
            }
            // if (!!pPair.input.options.outputTo){
            //     fs.unlinkSync(pPair.input.options.outputTo);
            // }
        } catch(e){
            // probably files didn't exist in the first place
            // so ignore the exception
        }
    });
}

describe('cli/actions', function() {
    before("set up", function(){
        resetOutputDir();
    });
    
    after("tear down", function(){
        resetOutputDir();
    });
    
    describe('#transform()', function() {
        testPairs.forEach(function(pPair){
            it(pPair.title, function(done) { 
                actions.transform(
                    pPair.input.argument,
                    pPair.input.options,
                    function(){
                        utl.assertequalFile(pPair.input.argument, pPair.expected);
                        done();
                        
                    }
                );
                
            });
        });
    });
    
});
