# Building mscgen_js (/demo)

## Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

## Building
Development only: ```make dev-build``` - this should create the state the *master* branch is in.

Build and deploy to github-pages: ```make deploy-gh-pages``` - this target ...
- switches to the *gh-pages* branch, 
- merges master into *gh-pages*
- executes a production build
- adds and commits changes, 
- pushes the changes to *origin*
- switches (back) to the *master* branch


Production: ```make build```. As explained above the idea is only to run and commit
this target on the *gh-pages* branch. If it was run on e.g. *master*, just run a 
```make clean```. 

## Cleaning
- ```make clean``` removes built production files
- ```make superscrub``` removes built production files as well as all generated files in the src tree

## Prerequisites
- make
- bash (cp, mkdir, rm, sed)
- nodejs
    - r.js
    - pegjs
- git (for gh-pages deployment target only)
