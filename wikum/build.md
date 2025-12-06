# Building mscgen_js and the online interpreter

## Deployment Principles
- *master* branch only contains source/ dev version

## Building
```shell
make prerequisites #  (or `npm install`)
make build # or `npm run build`
```

### Development vs Production build
If you're on the `master` branch the build system will create a production
build in the `docs` folder.

If you're on a different branch the build system creates a development build
in a sub folder of `docs`, named after your current branch e.g. `docs/develop`
or `docs/feature/snazz-the-firp`.


On *master* and derivative branches _git_ will ignore the `build` folder. 

### Deployment to github-pages
Goes automatically - everyting in the `/docs` folder is exposed automatically
(that is/ given you've set github pages to look at the _master_ branch in 
the _docs_ folder )

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
- imagemagick and optipng (re-generating favicons that are already in the `src` tree)
