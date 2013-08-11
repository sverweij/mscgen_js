#!/bin/bash
# usage: build all pages & css: build.sh
#        only build workout and associated files: build.sh workout
#        build all css: build.sh css

for i in build.*$1*.js; do
    r.js -o $i
done
