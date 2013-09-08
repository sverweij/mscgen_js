#!/bin/sh
# TODO: error flows
git checkout gh-pages
git merge master -m "merge for gh-pages build"
sh build.sh
git add .
git commit -a -m "build"
git push
git checkout master
