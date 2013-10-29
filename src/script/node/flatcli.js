var x = require("./flattenast");
var parser = require("./mscgenparser_node");

var lAST = parser.parse ('msc { \
    a [arclinecolor="red"], b [arctextcolor="red"]; \
    \
    b <= a [textcolor="green", label="textcolor green, linecolor red"]; \
    b <= a [linecolor="green", label="linecolor green"]; \
    b -X a [label ="textcolor red"]; \
}');
x.flatten(lAST);

process.stdout.write(JSON.stringify(lAST, null, " "));
