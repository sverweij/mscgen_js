# Building mscgen_js and the online interpreter

## Deployment Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

Technically, *gh-pages* is an _orphan_ branch

## Building
### Development build
The development build creates all generated sources, but keeps them in the `src` tree.
```shell
make prerequisites #  (or 'npm install')
make dev-build # should create the state the master branch is in.
```

### Production build
```shell
make prerequisites #  (or 'npm install')
make install
```

When you do this from the _master_ branch `make install` will put the result
in the `build` folder. For other branches it puts it in 
`build/branches/{{branch_name}}`.

On *master* and derivative branches _git_ will ignore the `build` folder. 

### Deployment to github-pages
#### Preparation (once only)
After creating a production build, initialize a git repo in the `build` folder
with your repo as remote and gh-pages as an _orphan_ branch. This ensures only
the files really needed for production get on github-pages.

```shell
git init
git remote add origin git@github.com:userororganisation/reponame.git
git checkout --orphan gh-pages
```

#### Deployment step
The deployment itself is now a straightforward add/ commit/ push in the `build` folder. The `deploy-gh-pages` make target takes care of this:
```shell
make deploy-gh-pages
```
mscgen_js will now be available from `{{repo_gh-pages_root}}`, e.g. `https://sverweij.github.io/mscgen_js`

#### Branches
Note that this will also deploy any branches happening to be lying around in `build`, which will be accessible
from `{{repo_gh-pages_root}}/branches/{{branch_name}}`. 
E.g  `https://sverweij.github.io/mscgen_js/branches/feature/snazz-the-firp`

## Cleaning
- ```make mostlyclean``` removes built production files
- ```make clean``` removes built production files as well as all generated files in the src tree

## Quality checks
- `npm test`
    - runs the unit/ regression tests
    - (some  checks are still run manually with a well trained pair of eyeballs ...)

- `npm run test:cover`
    - generates a report that specifies the test coverage
    - note that it runs the ```test``` target to determine the coverage

- `npm run check` combination target that runs the linter, dependency-cruiser,
    the tests and the coverage

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
    - eslint (optional: linting)
    - mocha (optional: unit testing)
    - istanbul (optional: test coverage)
- git (for gh-pages deployment target only)
- imagemagik and optipng (re-generating favicons that are already in the `src` tree)
