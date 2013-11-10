# Building mscgen_js (/demo)

## Deployment Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

## Building
Development only: ```make dev-build``` - this should create the state the *master* branch is in. 
It creates all generated sources, but keeps them in the ```src``` tree.

Production build and deploy to github-pages: ```make deploy-gh-pages``` - this *make target*:
- switches to the *gh-pages* branch, 
- merges master into *gh-pages*
- executes a production build (with the *install* target)
- adds and commits changes, 
- pushes the changes to *origin*
- switches (back) to the *master* branch


Production: ```make install```. As explained above the idea is only to run and commit
this target on the *gh-pages* branch. If it was run on e.g. *master*, just run a 
```make mostlyclean``` before any ```git add``` or ```git commit```.

## Cleaning
- ```make mostlyclean``` removes built production files
- ```make clean``` removes built production files as well as all generated files in the src tree

## Testing 
- ```make test```
    - runs the (growing amount of) unit tests
    - (most checks are still run manually with a well trained pair of eyeballs ...)

- ```make check```
    -  checks for occurence of ```console``` statements 
    -  runs jshint on non-library, non-generated source code
    -  runs a ```make test```

## Prerequisites
- make
- bash (cp, mkdir, rm, sed, grep, expr)
- nodejs
    - pegjs (mandatory)    
    - r.js (mandatory for smashing together css sources. Optional for creating opti)
    - jshint (optional: linting)
    - mocha (optional: unit testing)
    - plato (optional: code reporting)
- git (for gh-pages deployment target only)
- imagemagik and optipng (generating favicons)
