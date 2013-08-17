#!/bin/sh
echo "building mscgen parser from peg (web)  ..."
pegjs --export-var var\ mscparser src/script/node/mscgenparser.pegjs src/script/mscgenparser.js
echo "building mscgen parser from peg (node)  ..."
pegjs src/script/node/mscgenparser.pegjs src/script/node/mscgenparser_node.js

echo "building msgenny parser from peg (web) ..."
pegjs --export-var var\ msgennyparser src/script/node/msgennyparser.pegjs src/script/msgennyparser.js
echo "building msgenny parser from peg (node) ..."
pegjs src/script/node/msgennyparser.pegjs src/script/node/msgennyparser_node.js

echo "creating web variants of ast2*.js ..."
sed s/module.exports/var\ tomscgen/g src/script/node/ast2mscgen.js > src/script/ast2mscgen.js
sed s/module.exports/var\ tomsgenny/g src/script/node/ast2msgenny.js > src/script/ast2msgenny.js

echo "assembling css"
r.js -o dev-build.css.js
