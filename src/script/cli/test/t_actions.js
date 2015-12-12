var fs      = require("fs");
var path    = require("path");
var actions = require("../src/actions");
var utl     = require("./testutensils");
var chai    = require("chai");
var expect  = chai.expect;
chai.use(require("chai-xml"));

var testPairs = [
    {
        title : "'-p -i rainbow.mscin tmp_rainbow.json' - produces AST",
        input : {
            options : {
                inputFrom  : "fixtures/rainbow.mscin",
                outputTo   : "output/rainbow_mscgen_source.json",
                parserOutput : true
            }
        },
        expected : "fixtures/rainbow_mscgen_source.json"
    },
    {
        title : "'-T dot -i rainbow.mscin rainbow_mscgen_source.dot' - produces dot",
        input : {
            options : {
                outputType : "dot",
                inputFrom  : "fixtures/rainbow.mscin",
                outputTo   : "output/rainbow_mscgen_source.dot"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.dot"
    },
    {
        title : "'-T doxygen -i rainbow.mscin rainbow_mscgen_source.doxygen' - produces doxygen",
        input : {
            options : {
                outputType : "doxygen",
                inputFrom  : "fixtures/rainbow.mscin",
                outputTo   : "output/rainbow_mscgen_source.doxygen"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.doxygen"
    },
    {
        title : "'-T msgenny -i simpleXuSample.xu -o simpleXuSample.msgenny' - produces mscgen",
        input : {
            options : {
                inputFrom  : "fixtures/simpleXuSample.xu",
                inputType  : "xu",
                outputTo   : "output/simpleXuSample.msgenny",
                outputType : "msgenny"
            }
        },
        expected : "fixtures/simpleXuSample.msgenny"
    },
    {
        title : "'-T msgenny -i rainbow.json -o rainbow.msgenny' - produces mscgen",
        input : {
            options : {
                inputFrom  : "fixtures/simpleXuSample.json",
                inputType  : "json",
                outputTo   : "output/simpleXuSampleToo.msgenny",
                outputType : "msgenny"
            }
        },
        expected : "fixtures/simpleXuSample.msgenny"
    },
    {
        title : "'-T svg -i rainbow.mscin tmp_rainbow.svg' - produces svg",
        input : {
            options : {
                outputTo: "output/rainbow_mscgen_source.svg",
                outputType : "svg",
                inputFrom  : "fixtures/rainbow.mscin"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.svg"
    },
    {
        title : "'-T png -i rainbow.mscin tmp_rainbow.png' - produces png",
        input : {
            options : {
                outputTo: "output/rainbow_mscgen_source.png",
                outputType : "png",
                inputFrom  : "fixtures/rainbow.mscin"
            }
        },
        expected : "fixtures/rainbow_mscgen_source.png"
    }
].map(function(pTestPair){
    pTestPair.input.options.inputFrom = path.join(__dirname, pTestPair.input.options.inputFrom);
    pTestPair.input.options.outputTo = path.join(__dirname, pTestPair.input.options.outputTo);
    pTestPair.expected = path.join(__dirname, pTestPair.expected);
    return pTestPair;
});

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
                            var lFound = fs.readFileSync(pPair.input.options.outputTo, {"encoding" : "utf8"});
                            expect(lFound).xml.to.be.valid();
                            /* Comparing XML's against a fixture won't work -
                             * on different platforms phantomjs will produce
                             * (slightly) different output, so for now we'll
                             * have to be content with valid xml. And a visual
                             * check.
                             */
                            // utl.assertequalFileXML(pPair.input.options.outputTo, pPair.expected);
                        } else if ("png" === pPair.input.options.outputType){
                            var lFoundPng = fs.readFileSync(pPair.input.options.outputTo, {"encoding" : "utf8"});
                            expect(lFoundPng).to.contain("PNG");
                        } else if (TEXTTYPES.indexOf(pPair.input.options.outputType) > -1) {
                            utl.assertequalToFile(
                                pPair.input.options.outputTo,
                                pPair.expected
                            );
                        } else {
                            utl.assertequalFileJSON(
                                pPair.input.options.outputTo,
                                pPair.expected
                            );
                        }

                        done();
                    }
                );

            });
        });
    });

});
