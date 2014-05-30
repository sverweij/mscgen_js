var assert = require("assert");
var renderer = require("../ast2dot");
var fix = require("./astfixtures");

describe('ast2dot', function() {
    describe('#renderAST() - mscgen classic compatible - simple syntax trees', function() {

        it('should, given a simple syntax tree, render a dot script', function() {
            var lProgram = renderer.render(JSON.parse(JSON.stringify(fix.astSimple)));
            var lExpectedProgram = 
'graph {\n\
  rankdir=LR\n\
  splines=true\n\
  ordering=out\n\
  fontname="Helvetica"\n\
  fontsize="9"\n\
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n\
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n\
\n\
  "a" [label="a"];\n\
  "b" [label="b"];\n\
\n\
  "a" -- "b" [label="(1) a simple script", arrowhead="normal"]\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it('should, given a syntax tree with boxes, render a dot script', function() {
            var lProgram = renderer.render(JSON.parse(JSON.stringify(fix.astBoxArcs)));
            var lExpectedProgram = 
'graph {\n\
  rankdir=LR\n\
  splines=true\n\
  ordering=out\n\
  fontname="Helvetica"\n\
  fontsize="9"\n\
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n\
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n\
\n\
  "a" [label="a"];\n\
  "b" [label="b"];\n\
  "c" [label="c"];\n\
  "d" [label="d"];\n\
\n\
  box1 [shape="note"]\n\
  box1 -- {"a","a"} [style="dotted", dir="none"]\n\
  box2 [shape="box"]\n\
  box2 -- {"b","b"} [style="dotted", dir="none"]\n\
  box3 [shape="hexagon"]\n\
  box3 -- {"c","c"} [style="dotted", dir="none"]\n\
  box4 [style="rounded", shape="box"]\n\
  box4 -- {"d","d"} [style="dotted", dir="none"]\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });

    });

    describe('#renderAST() - xu compatible', function() {
        it('alt only - render correct script', function() {
            var lProgram = renderer.render(JSON.parse(JSON.stringify(fix.astOneAlt)));
            var lExpectedProgram = 
'graph {\n\
  rankdir=LR\n\
  splines=true\n\
  ordering=out\n\
  fontname="Helvetica"\n\
  fontsize="9"\n\
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n\
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n\
\n\
  "a" [label="a"];\n\
  "b" [label="b"];\n\
  "c" [label="c"];\n\
\n\
  "a" -- "b" [label="(1)", arrowhead="normal"]\n\
  \n\
  subgraph cluster_2{\n\
   label="alt: (2)" labeljust="l" \n\
    "b" -- "c" [label="(3)", arrowhead="normal"]\n\
    "c" -- "b" [label="(4)", style="dashed"]\n\
  }\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
        it('alt within loop - render correct script', function() {
            var lProgram = renderer.render(JSON.parse(JSON.stringify(fix.astAltWithinLoop)));
            var lExpectedProgram =
'graph {\n\
  rankdir=LR\n\
  splines=true\n\
  ordering=out\n\
  fontname="Helvetica"\n\
  fontsize="9"\n\
  node [style=filled, fillcolor=white fontname="Helvetica", fontsize="9" ]\n\
  edge [fontname="Helvetica", fontsize="9", arrowhead=vee, arrowtail=vee, dir=forward]\n\
\n\
  "a" [label="a"];\n\
  "b" [label="b"];\n\
  "c" [label="c"];\n\
\n\
  "a" -- "b" [label="(1)", arrowhead="normal"]\n\
  \n\
  subgraph cluster_2{\n\
   label="loop: (2) label for loop" labeljust="l" \n\
    \n\
    subgraph cluster_3{\n\
     label="alt: (3) label for alt" labeljust="l" \n\
      "b" -- "c" [label="(4) -> within alt", arrowhead="rvee"]\n\
      "c" -- "b" [label="(5) >> within alt", style="dashed"]\n\
    }\n\
    "b" -- "a" [label="(6) >> within loop", style="dashed"]\n\
  }\n\
  "a" -- "a" [label="(7) happy-the-peppy - outside"]\n\
}';
            assert.equal(lProgram, lExpectedProgram);
        });
    });
});
