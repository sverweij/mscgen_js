var expect    = require("chai").expect;
var norm      = require("../src/normalizations");
var cloneDeep = require("./clone").cloneDeep;


var TESTPAIRS = [
    {
        title: "leaves a fully specified program alone",
        input: {
            options: {
                inputFrom: "input.xu",
                inputType: "msgenny",
                outputTo: "output.svg",
                outputType: "mscgen"
            }
        },
        expected: {
            options: {
                inputFrom: "input.xu",
                inputType: "msgenny",
                outputTo: "output.svg",
                outputType: "mscgen"
            }
        }
    },
    {
        title: "guesses the input type, takes a default for the output type",
        input: {
            options: {
                inputFrom: "input.xu",
                outputTo: "output.svg",
            }
        },
        expected: {
            options: {
                inputFrom: "input.xu",
                inputType: "xu",
                outputTo: "output.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "cannot guess the input type when it is stdin, so takes a default",
        input: {
            options: {
                inputFrom: "-",
                outputTo: "output.svg"
            }
        },
        expected: {
            options: {
                inputFrom: "-",
                inputType: "mscgen",
                outputTo: "output.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "treats .ast as .json",
        input: {
            options: {
                inputFrom: "achoo.ast",
            }
        },
        expected: {
            options: {
                inputFrom: "achoo.ast",
                inputType: "json",
                outputTo: "achoo.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "treats .ast as .json - even wen explicitly stated in options.inputType",
        input: {
            options: {
                inputFrom: "achoo.interestingextension",
                inputType: "ast"
            }
        },
        expected: {
            options: {
                inputFrom: "achoo.interestingextension",
                inputType: "json",
                outputTo: "achoo.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "can't guess outputTo when inputFrom is stdin",
        input: {
            options: {
                inputFrom: "-",
            }
        },
        expected: {
            options: {
                inputFrom: "-",
                inputType: "mscgen",
                outputTo: undefined,
                outputType: "svg"
            }
        }
    },
    {
        title: "can't guess outputTo when inputFrom is not there",
        input: {
            options: {
            }
        },
        expected: {
            options: {
                inputFrom: undefined,
                inputType: "mscgen",
                outputTo: undefined,
                outputType: "svg"
            }
        }
    },
    {
        title: "migrates arguments to options.inputFrom",
        input: {
            argument: "inputFrom.bladiebla",
            options: {}
        },
        expected: {
            options: {
                inputFrom: "inputFrom.bladiebla",
                inputType: "mscgen",
                outputTo: "inputFrom.svg",
                outputType: "svg"
            }
        }
    },
    {
        title: "arguments win from options.inputFrom",
        input: {
            argument: "argument.won",
            options: {
                inputFrom: "inputFrom.xxx"
            }
        },
        expected: {
            options: {
                inputFrom: "argument.won",
                inputType: "mscgen",
                outputTo: "argument.svg",
                outputType: "svg"
            }
        }
    }
];

describe('cli/normalizations', function() {
    describe('#normalize() - ', function() {
        TESTPAIRS.forEach(function(pPair){
            it(pPair.title, function(){
                var lInputcloneDeep = cloneDeep(pPair.input);
                norm.normalize(lInputcloneDeep.argument, lInputcloneDeep.options);
                expect(
                    lInputcloneDeep.options
                ).to.deep.equal(
                    pPair.expected.options
                );
            });
        });
    });
});
