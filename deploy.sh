#!/bin/sh
# TODO: error flows
git checkout gh-pages
git merge master
git push
git checkout master
