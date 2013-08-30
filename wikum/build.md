# On building mscgen_js (/demo)
## Steps
- master branch only contains source/ dev version
- special dev-build.sh that executes a complete build *except* for minifying to one js
- gh-pages branch also contains built stuff  

## Pre requisites
- bash (echo, cp, mkdir, rm, sed)
- node
    - r.js
    - pegjs
- git


## Building
build.sh

development only: dev-build.sh

## Clean
sh clean.sh