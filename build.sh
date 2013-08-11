#!/bin/bash
# usage: build all pages & css: build.sh
#        only build scripts and associated files: build.sh scripts
#        build all css: build.sh css

# TODO: test for existence of pegjs (and npm it if not there?)

echo "building mscgen parser from peg (web)  ..."
pegjs --export-var var\ mscparser script/node/mscgenparser.pegjs script/mscgenparser.js
echo "building mscgen parser from peg (node)  ..."
pegjs script/node/mscgenparser.pegjs script/node/mscgenparser_node.js

echo "building msgenny parser from peg (web) ..."
pegjs --export-var var\ msgennyparser script/node/msgennyparser.pegjs script/msgennyparser.js
echo "building msgenny parser from peg (node) ..."
pegjs script/node/msgennyparser.pegjs script/node/msgennyparser_node.js

# TODO: test for existence of sed (and what to do if it isn't there?)
echo "creating web variants of parsetree2*.js ..."
sed s/module.exports/var\ tomscgen/g script/node/ast2mscgen.js > script/ast2mscgen.js
sed s/module.exports/var\ tomsgenny/g script/node/ast2msgenny.js > script/ast2msgenny.js

echo "optimizing css and javascript with r.js ..."
# TODO: test for existence of r.js (and npm it if not there/ or use
# cp yadda-src.js yadda.js which also works but isn't as efficient
# on page loading)
for i in build.*$1*.js; do
    r.js -o $i
done
