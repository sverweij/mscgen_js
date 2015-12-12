var path   = require("path");
var chai   = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var val    = require("../src/validations");

describe('cli/validations', function() {

    describe('#validOutputType() - ', function() {
        it("'notavalidOutputType' is not a valid output type", function() {
            var lFoundError = "";
            try {
                val.validOutputType("notavalidOutputType");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'notavalidOutputType' is not a valid output type.");
        });

        it("'svg' is a valid type", function() {
            assert.equal(val.validOutputType("svg"), "svg");
        });
    });

    describe('#validInputType() - ', function() {
        it("'dot' is not a valid input type", function() {
            var lFoundError = "";
            try {
                val.validInputType("dot");
            } catch (e) {
                lFoundError = e.message;
            }
            expect(lFoundError).to.contain("error: 'dot' is not a valid input type");
        });

        it("'ast' is a valid type", function() {
            assert.equal(val.validInputType("ast"), "ast");
        });
    });

    describe('#validateArguments() - ', function() {
        it("'-T svg -o kaboeki.svg fixtures/rainbow.mscin is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: path.join(__dirname, "fixtures/rainbow.mscin"),
                        outputTo: "kaboeki.svg",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T mscgen -o - -' is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "mscgen"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T dot -i - -o -' is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "dot"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T svg -i - -o -' is not allowed (no graphics streaming to stdout yet ...)", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "shouldn't be here");
            } catch (e){
                expect(e.message).to.contain("error: mscgen_js cli can't stream graphics formats to stdout yet.");
            }
        });

        it("'-T xu -o - input-doesnot-exists' complains about non existing file", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom  : "input-doesnot-exist",
                        outputTo   : "-",
                        outputType : "xu"
                    }
                );
                assert.equal("still here", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            }
        });

        it("'-T svg -o - ' complains about non existing file", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom  : "input-doesnot-exist",
                        outputTo   : "-",
                        outputType : "xu"
                    }
                );
                assert.equal("still here", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Failed to open input file 'input-doesnot-exist'\n\n");
            }
        });

        it("'-T svg -' complains about non specified input file", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            }
        });

        it("'-i -' complains about non specified output file", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-"
                    }
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            }
        });

        it("complains about non specified input file", function() {
            try {
                val.validateArguments({});
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an input file.\n\n");
            }
        });
    });
});
