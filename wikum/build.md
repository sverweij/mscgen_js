# Building mscgen_js and the online interpreter

## Deployment Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

Technically, *gh-pages* is an _orphan_ branch

## Building
### Development build
Run this:
- `make prerequisites` (or `npm install`) - this installs prerequisite node packages
-  `make dev-build` - this should create the state the *master* branch is in.
It creates all generated sources, but keeps them in the `src` tree.

### Production build
Run, this:
- `make prerequisites` (or `npm install`) - installs prerequisite node packages
-  ```make install```

The result will be in the `build` folder. On *master* and derivative branches _git_ will ignore this folder. 

### Deployment to github-pages
#### Preparation (once only)
After creating a production build, initialize a git repo in the build folder with your repo as remote and gh-pages as an _orphan_ branch. This ensures only the files really needed for production get on github-pages.

```shell
git init
git remote add origin git@github.com:userororganisation/reponame.git
git checkout --orphan gh-pages
```

#### Deployment itself
Now a straightforward add/ commit/ push in the build folder: 
```shell
git add .
git commit -m "build `cat ..\VERSION`"
git push
```

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

- ```make check``` combination target:
    -  checks for occurence of ```console``` statements
    -  runs jshint on non-library, non-generated source code (= `npm run lint`)
    -  runs a ```make test``` (=`npm run test`)

## Prerequisites
- make
- npm
- bash (cp, mkdir, rm, sed, grep, expr)
- all javascript necessary to run mscgen_js and/ or the online interpreter in the browser is already included in the `src` tree
- to run in nodejs amdefine is also required - an ```npm install``` will get you that
- for the rest: run an ```npm install```
- nodejs
    - pegjs (mandatory)
    - r.js (Mandatory for creating an minified version of the javascript (which in itself is optional))
    - node-sass (mandatory for smashing together (s)css sources)
    - jshint (optional: linting)
    - mocha (optional: unit testing)
    - istanbul (optional: test coverage)
    - plato (optional: static code analysis)
    - nsp (optional: node security project - checks node module dependencies for security flaws)
- git (for gh-pages deployment target only)
- imagemagik and optipng (re-generating favicons that are already in the `src` tree)
