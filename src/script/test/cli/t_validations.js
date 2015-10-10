var assert = require("assert");
var val    = require("../../cli/validations");

describe('cli/validations', function() {

    describe('#validType() - ', function() {
        it("'notavalidtype' is not a valid type", function() { 
            var lFoundError = "";
            try {
                val.validType("notavalidtype");
            } catch (e) {
                lFoundError = e.message;
            }
            assert.equal(lFoundError, "\n  error: 'notavalidtype' is not a valid output type. mscgen_js can only emit svg.\n\n");
        });
        it("'svg' is a valid type", function() { 
            assert.equal(val.validType("svg"), "svg");        
        });
    });
    
    describe('#validateArguments() - ', function() {
        it("'-T svg -i src/script/test/fixtures/rainbow.mscin -' is oki", function() {
            try {
                val.validateArguments(
                    "-", 
                    {
                        inputFrom: "src/script/test/fixtures/rainbow.mscin",
                        outputType: "svg"
                    }
                );
                assert.equal("still here", "still here");
            } catch (e){
                assert.equal(e.message, "should not be an exception");
            }
        });

        it("'-T svg -i - -' is oki", function() {
            try {
                val.validateArguments(
                    "-", 
                    {
                        inputFrom: "-",
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
                    undefined,
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

        it("'-T svg -i input-doesnot-exists -' complains about non existing file", function() {
            try {
                val.validateArguments(
                    "-", 
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
                    "-",
                    {}
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an input file.\n\n");
            }
        });
        
        it("'-T svg -i -' complains about non specified output file", function() {
            try {
                val.validateArguments(
                    undefined,
                    {
                        inputFrom: "-"
                    }
                );
                assert.equal("still here?", "should not be here!");
            } catch (e){
                assert.equal(e.message, "\n  error: Please specify an output file.\n\n");
            }
        });
    });
});
