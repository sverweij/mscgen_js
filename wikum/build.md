# Building mscgen_js and the online interpreter

## Deployment Principles
- *master* branch only contains source/ dev version
- *gh-pages* branch contains production build

Technically, *gh-pages* is an _orphan_ branch

## Building
```shell
make prerequisites #  (or `npm install`)
make build # or `npm run build`
```

### Development vs Production build
If you're on the `master` branch the build system will create a production
build in the `dist` folder.

If you're on a different branch the build system creates a development build
in a sub folder of `dist`, named after your current branch e.g. `dist/develop`
or `dist/feature/snazz-the-firp`.


On *master* and derivative branches _git_ will ignore the `build` folder. 

### Deployment to github-pages
#### Preparation (once only)
After creating a production build, initialize a git repo in the `dist` folder
with your repo as remote and gh-pages as an _orphan_ branch. This ensures only
the files really needed for production get on github-pages.

```shell
git init
git remote add origin git@github.com:userororganisation/reponame.git
git checkout --orphan gh-pages
```

#### Deployment step
The deployment itself is now a straightforward add/ commit/ push in the `dist` folder. The `deploy-gh-pages` make target takes care of this:
```shell
make deploy-gh-pages
```
mscgen_js will now be available from `{{repo_gh-pages_root}}`, e.g. `https://sverweij.github.io/mscgen_js`

#### Branches
Note that this will also deploy any branches happening to be lying around in `build`, which will be accessible
from `{{repo_gh-pages_root}}/branches/{{branch_name}}`. 
E.g  `https://sverweij.github.io/mscgen_js/feature/snazz-the-firp`

## Cleaning
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
- nodejs
- bash (cp, mkdir, rm, sed, grep, expr)
- all javascript necessary to run mscgen_js and/ or the online interpreter in the browser is already included in the `src` tree
- for the rest: run an ```npm install```
- git
- imagemagik and optipng (re-generating favicons that are already in the `src` tree)
