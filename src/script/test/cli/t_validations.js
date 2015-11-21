var assert = require("assert");
var val    = require("../../cli/validations");

describe('cli/validations', function() {

    describe('#validOutputType() - ', function() {
        it("'notavalidOutputType' is not a valid output type", function() {
            var lFoundError = "";
            try {
                val.validOutputType("notavalidOutputType");
            } catch (e) {
                lFoundError = e.message;
            }
            assert.equal(lFoundError, "\n  error: 'notavalidOutputType' is not a valid output type. mscgen_js can only emit svg and text formats (dot, doxygen, mscgen, msgenny, xu).\n\n");
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
            assert.equal(lFoundError, "\n  error: 'dot' is not a valid intput type. mscgen_js can only read mscgen, msgenny, xu and ast).\n\n");
        });

        it("'ast' is a valid type", function() {
            assert.equal(val.validInputType("ast"), "ast");
        });
    });

    describe('#validateArguments() - ', function() {
        it("'-T svg -o - src/script/test/fixtures/rainbow.mscin is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "src/script/test/fixtures/rainbow.mscin",
                        outputTo: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T svg -o - -' is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T svg -i - -o -' is oki", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "-",
                        outputTo: "-",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T svg -o - input-doesnot-exists' complains about non existing file", function() {
            try {
                val.validateArguments(
                    {
                        inputFrom: "input-doesnot-exist",
                        outputTo : "-"
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
