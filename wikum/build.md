# On building mscgen_js (/demo)
## Steps
- master branch only contains source/ dev version
- target dev-build that executes a complete build *except* for minifying to one js
- gh-pages branch also contains built stuff  

## Pre requisites
- make
- bash (echo, cp, mkdir, rm, sed)
- node
    - r.js
    - pegjs
- git


## Building
Production: ```make deploy``` (builds, optimizes, pushes to gh-pages)

Development only: ```make dev-build``` 

## Clean
```make clean``` or, to also remove generated source files (e.g. from peg, or combined css): ```make superscrub```
