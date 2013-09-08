#!/bin/sh
# TODO: error flows
git checkout gh-pages
git merge master -m "merge for gh-pages build"
sh build.sh
git add .
<<<<<<< HEAD
git commit -m "build"
=======
git commit -a -m "build"
>>>>>>> master
git push
git checkout master
