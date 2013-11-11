var x = require("./flatten");
var c = require("./colorize");

var parser = require("./mscgenparser_node");

var lAST = parser.parse ('msc { \
    a [arclinecolor="red"], b [arctextcolor="red"], c [label="without arc*colors"], d, e; \
    \
    b <= a [textcolor="green", label="textcolor green, linecolor red"]; \
    b <= a [linecolor="green", label="linecolor green"]; \
    b -X a [label ="textcolor red"]; \
    c note c [label="automatically colorize to yellow/ black"]; \
    b note b [label="do not color as already has color", linecolor="red"];\
}');
var lAST = parser.parse('msc{ arcgradient=20; a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t; b note c; d box e; a rbox a; e abox d; e =>> *;}');
lAST = x.flatten(lAST);
lAST = c.colorize(lAST);


process.stdout.write(JSON.stringify(lAST, null, " "));
