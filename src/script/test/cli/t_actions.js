var fs      = require("fs");
var actions = require("../../cli/actions");
var utl     = require("../testutensils");

var testPairs = [
    {
        title : "'-T svg -i rainbow.mscin tmp_rainbow.svg' - produces svg",
        input : {
            options : {
                outputTo: "src/script/test/output/rainbow_mscgen_source.svg",
                outputType : "svg",
                inputFrom  : "src/script/test/fixtures/rainbow.mscin"
            }
        },
        expected : "src/script/test/fixtures/rainbow_mscgen_source.svg"
    },
    {
        title : "'-p -i rainbow.mscin tmp_rainbow.json' - produces AST",
        input : {
            options : {
                inputFrom  : "src/script/test/fixtures/rainbow.mscin",
                outputTo   : "src/script/test/output/rainbow_mscgen_source.json",
                parserOutput : true
            }
        },
        expected : "src/script/test/output/rainbow_mscgen_source.json"
    },
    {
        title : "'-T dot -i rainbow.mscin rainbow_mscgen_source.dot' - produces dot",
        input : {
            options : {
                outputType : "dot",
                inputFrom  : "src/script/test/fixtures/rainbow.mscin",
                outputTo   : "src/script/test/output/rainbow_mscgen_source.dot"
            }
        },
        expected : "src/script/test/fixtures/rainbow_mscgen_source.dot"
    },
    {
        title : "'-T doxygen -i rainbow.mscin rainbow_mscgen_source.doxygen' - produces doxygen",
        input : {
            options : {
                outputType : "doxygen",
                inputFrom  : "src/script/test/fixtures/rainbow.mscin",
                outputTo   : "src/script/test/output/rainbow_mscgen_source.doxygen"
            }
        },
        expected : "src/script/test/fixtures/rainbow_mscgen_source.doxygen"
    },
    {
        title : "'-T msgenny -i simpleXuSample.xu -o simpleXuSample.msgenny' - produces mscgen",
        input : {
            options : {
                inputFrom  : "src/script/test/fixtures/simpleXuSample.xu",
                inputType  : "xu",
                outputTo   : "src/script/test/output/simpleXuSample.msgenny",
                outputType : "msgenny"
            }
        },
        expected : "src/script/test/fixtures/simpleXuSample.msgenny"
    },
    {
        title : "'-T msgenny -i rainbow.json -o rainbow.msgenny' - produces mscgen",
        input : {
            options : {
                inputFrom  : "src/script/test/fixtures/simpleXuSample.json",
                inputType  : "json",
                outputTo   : "src/script/test/output/simpleXuSampleToo.msgenny",
                outputType : "msgenny"
            }
        },
        expected : "src/script/test/fixtures/simpleXuSample.msgenny"
    }
];

function resetOutputDir(){
    testPairs.forEach(function(pPair){
        try {
            // if (!!pPair.input.argument){
            //     fs.unlinkSync(pPair.input.argument);
            // }
            if (!!pPair.input.options.outputTo){
                fs.unlinkSync(pPair.input.options.outputTo);
            }
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
        var TEXTTYPES = [
            "dot",
            "doxygen",
            "mscgen",
            "msgenny",
            "xu"
        ];
        testPairs.forEach(function(pPair){
            it(pPair.title, function(done) {
                actions.transform(
                    pPair.input.options,
                    function(){
                        if ("svg" === pPair.input.options.outputType){
                            utl.assertequalFileXML(pPair.input.options.outputTo, pPair.expected);
                        } else if (TEXTTYPES.indexOf(pPair.input.options.outputType) > -1) {
                            utl.assertequalToFile(pPair.input.options.outputTo, pPair.expected);
                        } else {
                            utl.assertequalFileJSON(pPair.input.options.outputTo, pPair.expected);
                        }

                        done();
                    }
                );

            });
        });
    });

});
