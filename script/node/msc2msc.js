var parser = require ("./mscgenparser_node");
var pt2mscgen = require ("./parsetree2mscgen");

var lParseTree = parser.parse('msc { hscale="0.2", width="100", arcgradient="12"; a[label="A", ID="1"],b,c, "s t Ring"; a=>b; b>>a [label="OK message", linecoloUr="lime"]; ---; a--b, b--c;...;} ');



console.log (pt2mscgen.render (lParseTree));



/*
fs.readFile('input.msc', function (err, data) {
    if (err) throw err;
        console.log(data);
});
*/
