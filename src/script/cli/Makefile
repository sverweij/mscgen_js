.SUFFIXES: .js .html .msc .mscin .msgenny .svg .png .jpg .xu
GIT=git
NPM=npm
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to jsdependencies.mk --exclude node_modules

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test update-dependencies run-update-dependencies depend bower-package

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded mscgenjs-cli from a git repo?          |"
	@echo "|  First run 'make prerequisites' or 'npm install'       |"
	@echo "|                                                        |"
	@echo "| (not necessary when you installed it from npm)         |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "check"
	@echo " runs the linter, style checker and executes all unit tests"
	@echo
	@echo "clean"
	@echo " cleans up coverage results"
	@echo
	@echo "update-dependencies"
	@echo " updates all (node) module dependencies in package.json"
	@echo " installs them, rebuilds all generated sources and runs"
	@echo " all tests."
	@echo

# dependencies
include jsdependencies.mk
include dependencies.mk

# "phony" targets
prerequisites:
	$(NPM) install

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/*

lint:
	$(NPM) run lint

stylecheck:
	$(NPM) run jscs

cover: src/mscgen.js
	$(NPM) run cover

tag:
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

static-analysis:
	$(NPM) run plato

test:
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: noconsolestatements lint stylecheck test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies test nsp
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system cjs src/
	$(MAKEDEPEND) --append --system cjs --flat-define CLI_JS_SOURCES src/mscgen.js

clean-the-build:

clean:
	rm -rf coverage
