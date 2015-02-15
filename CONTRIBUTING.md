### Contributing

So you want to contribute to mscgen_js? Cool!

To make sure your contribution gets into the code base with the minimum of fuss,
it has to adhere to some simple rules before being considered for acceptance into
the code base:

### Reporting issues

- All issues (bug reports, questions, feature requests/ enhancement proposals etc.) are welcome.
- We try to provide a response within a week. This might or might not include an actual code fix.
- We prefer bugs to be in a _steps taken_ - _expected_ - _found_ format because
  that makes it more easy to actually provide a solution.
- If applicable, it is also nice when you provide the input you used and the environment
  (browser version/ os, or node.js version + os).

### Contributing code

- We prefer well documented [pull requests](https://help.github.com/articles/fork-a-repo)
- Make sure the base for your pull request is the most recent version of the master branch.
- Plan to do something drastic? Contact me first (twitter: @SanderSpeaks, or leave an issue on github)
- Code quality
    - Additions pass jshint.
    - Mocha tests prove your code does what it intends.
    - Your code does not introduce regressions - ```make check``` proves this.
    - Code style (you know, petty things like indentations, where brackets go, how variables &
      parameters are named) fits in with the current code base.

### Legal

- the code you add will be subject to [GPLv3](wikum/licenses/license.mscgen_js.md
), just like the rest of mscgen_js    
- the code you add is your own original work    
