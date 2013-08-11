#!/bin/sh
# TODO: error flows
git checkout master
git checkout gh-pages
git merge master
git push
