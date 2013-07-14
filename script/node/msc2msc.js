var parser = require ("./mscgenparser_node");
var pt2mscgen = require ("./parsetree2mscgen");

var gInput = new String();

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(chunk) {
    gInput += chunk;
});

process.stdin.on('end', function() {
    var lParseTree = parser.parse(gInput);
    process.stdout.write(pt2mscgen.render (lParseTree));
    process.stdin.pause();
});


/*
fs.readFile('input.msc', function (err, data) {
    if (err) throw err;
        console.log(data);
});
*/
