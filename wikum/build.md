# Building mscgen_js and the online interpreter

## Deployment Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

## Building
### Development build
Run this:
- `make prerequisites` (or `npm install`) - this installs prerequisite node packages
-  `make dev-build` - this should create the state the *master* branch is in.
It creates all generated sources, but keeps them in the `src` tree.

### Production build
Run, this:
- `make prerequisites` (or `npm install`) - installs prerequisite node packages
-  ```make install```. As explained above the idea is only to run and commit
this target on the *gh-pages* branch. If it was run on e.g. *master*, just run a
```make clean dev-build``` before any ```git add``` or ```git commit```.

### Deployment to github-pages
This is totally optional, b.t.w.
- ```make deploy-gh-pages``` - this *make target*:
    - switches to the *gh-pages* branch,
    - merges master into *gh-pages*
    - executes a production build (with the *install* target)
    - adds and commits changes,
    - pushes the changes to *origin*
    - switches (back) to the *master* branch


## Cleaning
- ```make mostlyclean``` removes built production files
- ```make clean``` removes built production files as well as all generated files in the src tree

## Quality checks
- ```make test``` or `npm run test`
    - runs the unit/ regression tests
    - (some  checks are still run manually with a well trained pair of eyeballs ...)

- ```make cover``` or `npm run cover`
    - generates a report that specifies the test coverage
    - note that it runs the ```test``` target to determine the coverage

- ```make report``` or `npm run plato`
    - runs the static code analyzer (plato)
    - output will be in platoreports/index.html

- `npm run nsp`
    - checks dependencies for known vulnerabilities (with _node security project_)

- ```make check```
    -  checks for occurence of ```console``` statements
    -  runs jshint on non-library, non-generated source code
    -  runs a ```make test```

## Prerequisites
- make
- npm
- bash (cp, mkdir, rm, sed, grep, expr)
- all javascript necessary to run mscgen_js and/ or the online interpreter in the browser is included in the distribution
- to run in nodejs amdefine is also required - an ```npm install``` will get you that
- for the rest: run an ```npm install```
- nodejs
    - pegjs (mandatory)
    - r.js (Mandatory for creating an minified version of the javascript (which in itself is optional))
    - node-sass (mandatory for smashing togetter (s)css sources.
    - jshint (optional: linting)
    - mocha (optional: unit testing)
    - istanbul (optional: unit testing coverage)
    - plato (optional: static code analysis)
    - nsp (optional: node security project - checks node module dependencies for security flaws)
- git (for gh-pages deployment target only)
- imagemagik and optipng (generating favicons)
