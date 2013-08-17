#!/bin/bash
# usage: build all pages & css: build.sh
#        only build scripts and associated files: build.sh scripts
#        build all css: build.sh css

# TODO: test for existence of pegjs (and npm it if not there?)

echo "building mscgen parser from peg (web)  ..."
pegjs --export-var var\ mscparser src/script/node/mscgenparser.pegjs src/script/mscgenparser.js
echo "building mscgen parser from peg (node)  ..."
pegjs src/script/node/mscgenparser.pegjs src/script/node/mscgenparser_node.js

echo "building msgenny parser from peg (web) ..."
pegjs --export-var var\ msgennyparser src/script/node/msgennyparser.pegjs src/script/msgennyparser.js
echo "building msgenny parser from peg (node) ..."
pegjs src/script/node/msgennyparser.pegjs src/script/node/msgennyparser_node.js

# TODO: test for existence of sed (and what to do if it isn't there?)
echo "creating web variants of parsetree2*.js ..."
sed s/module.exports/var\ tomscgen/g src/script/node/ast2mscgen.js > src/script/ast2mscgen.js
sed s/module.exports/var\ tomsgenny/g src/script/node/ast2msgenny.js > src/script/ast2msgenny.js

echo "optimizing css and javascript with r.js ..."
# TODO: test for existence of r.js (and npm it if not there/ or use
# cp yadda-src.js yadda.js which also works but isn't as efficient
# on page loading)
for i in build.*$1*.js; do
    r.js -o $i
done

cp src/index.html index.html
mkdir images
cp src/images/* images/.
