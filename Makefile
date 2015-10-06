
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
RJS=node_modules/requirejs/bin/r.js
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
CSSLINT=node node_modules/csslint/cli.js --format=compact --quiet --ignore=ids
CJS2AMD=utl/commonjs2amd.sh
PNG2FAVICO=utl/png2favico.sh
RESIZE=utl/resize.sh
IOSRESIZE=utl/iosresize.sh
SEDVERSION=utl/sedversion.sh
NPM=npm
SASS=node_modules/node-sass/bin/node-sass --output-style compressed
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to src/jsdependencies.mk --exclude node_modules
ifeq ($(GIT_DEPLOY_FROM_BRANCH), $(GIT_CURRENT_BRANCH))
	BUILDDIR=build
else
	BUILDDIR=build/branches/$(GIT_CURRENT_BRANCH)
endif

GENERATED_SOURCES_WEB=src/script/parse/mscgenparser.js \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js
GENERATED_STYLESHEETS=src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES_NODE=src/script/parse/mscgenparser_node.js \
	src/script/parse/msgennyparser_node.js \
	src/script/parse/xuparser_node.js 
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE) $(GENERATED_STYLESHEETS)
SOURCES_NODE=$(GENERATED_SOURCES_NODE)
REMOVABLEPRODDIRS=$(BUILDDIR)/lib \
	$(BUILDDIR)/style \
	$(BUILDDIR)/script \
	$(BUILDDIR)/fonts
PRODDIRS=$(BUILDDIR) \
		 $(REMOVABLEPRODDIRS)
FONTS=$(BUILDDIR)/fonts/controls.eot \
	$(BUILDDIR)/fonts/controls.svg \
	$(BUILDDIR)/fonts/controls.ttf \
	$(BUILDDIR)/fonts/controls.woff
FAVICONMASTER=src/images/xu.png
FAVICONS=$(BUILDDIR)/favicon.ico \
	$(BUILDDIR)/favicon-16.png \
	$(BUILDDIR)/favicon-24.png \
	$(BUILDDIR)/favicon-32.png \
	$(BUILDDIR)/favicon-48.png \
	$(BUILDDIR)/favicon-64.png \
	$(BUILDDIR)/favicon-128.png \
	$(BUILDDIR)/favicon-144.png \
	$(BUILDDIR)/favicon-152.png \
	$(BUILDDIR)/favicon-195.png \
	$(BUILDDIR)/favicon-228.png \
	$(BUILDDIR)/iosfavicon-57.png \
	$(BUILDDIR)/iosfavicon-72.png \
	$(BUILDDIR)/iosfavicon-114.png \
	$(BUILDDIR)/iosfavicon-120.png \
	$(BUILDDIR)/iosfavicon-144.png \
	$(BUILDDIR)/iosfavicon-152.png

.PHONY: help dev-build install deploy-gh-pages check fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test update-dependencies run-update-dependencies depend

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded the mscgen_js sources?                 |"
	@echo "|  First run 'make prerequisites'                        |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "install"
	@echo " -> this is probably the target you want when"
	@echo "    hosting mscgen_js"
	@echo
	@echo " creates the production version (minified js, images,"
	@echo " html)"
	@echo
	@echo "dev-build"
	@echo " (re)enerates stuff needed to develop (pegjs -> js, css"
	@echo " smashing etc)"
	@echo
	@echo "check"
	@echo " runs the linter and executes all unit tests"
	@echo
	@echo "clean"
	@echo " removes everything created by either install or dev-build"
	@echo
	@echo "deploy-gh-pages"
	@echo " deploys the build to gh-pages"
	@echo "  - 'master' branch: the root of gh-pages"
	@echo "  - other branches : in branches/branche-name"
	@echo
	@echo "update-dependencies"
	@echo " updates all (node) module dependencies in package.json"
	@echo " installs them, rebuilds all generated sources and runs"
	@echo " all tests."
	@echo
	@echo " --------------------------------------------------------"
	@echo "| More information and other targets: see wikum/build.md |"
	@echo " --------------------------------------------------------"
	@echo



# production rules
src/script/parse/%parser.js: src/script/parse/%parser_node.js
	$(CJS2AMD) < $< > $@

src/script/parse/%parser_node.js: src/script/parse/peg/%parser.pegjs 
	$(PEGJS) $< $@

$(BUILDDIR)/%.html: src/%.html tracking.id tracking.host siteverification.id
	$(SEDVERSION) < $< > $@

%.css: %.scss
	$(SASS) $< $@

$(BUILDDIR)/style/%.css: src/style/%.css
	cp $< $@

$(BUILDDIR)/fonts/%: src/fonts/%
	cp $< $@

$(BUILDDIR)/favicon.ico: $(FAVICONMASTER)
	$(PNG2FAVICO) $< $@

$(BUILDDIR)/favicon-%.png: $(FAVICONMASTER)
	$(RESIZE) $< $@ 

$(BUILDDIR)/iosfavicon-%.png: $(FAVICONMASTER)
	$(IOSRESIZE) $< $@ 

$(PRODDIRS):
	mkdir -p $@

# dependencies 
include src/jsdependencies.mk
include src/dependencies.mk

# file targets prod
$(BUILDDIR)/index.html: $(PRODDIRS) \
	src/index.html \
	$(BUILDDIR)/style/interp.css \
	$(BUILDDIR)/lib/require.js \
	$(BUILDDIR)/script/mscgen-interpreter.js \
	$(BUILDDIR)/images/ \
	$(BUILDDIR)/samples/ \
	$(FAVICONS) \
	$(FONTS)

LIVE_DOC_DEPS=$(PRODDIRS) \
	$(BUILDDIR)/style/doc.css \
	$(BUILDDIR)/mscgen-inpage.js \
	$(BUILDDIR)/images/ \
	$(FAVICONS) \
	$(FONTS)

$(BUILDDIR)/embed.html: $(LIVE_DOC_DEPS) src/embed.html

$(BUILDDIR)/tutorial.html: $(LIVE_DOC_DEPS) src/tutorial.html

siteverification.id:
	@echo yoursiteverifactionidhere > $@

tracking.id:
	@echo yourtrackingidhere > $@

tracking.host:
	@echo auto > $@

$(BUILDDIR)/images/: src/images
	cp -R $< $@

$(BUILDDIR)/samples/: src/samples
	cp -R $< $@

$(BUILDDIR)/lib/require.js: src/lib/require.js
	cp $< $@

$(BUILDDIR)/script/mscgen-interpreter.js: $(INTERPRETER_JS_SOURCES)
	$(RJS) -o baseUrl="./src/script" \
			name="mscgen-interpreter" \
			out=$@.tmp \
			preserveLicenseComments=true
	$(SEDVERSION) < $@.tmp > $@
	rm $@.tmp

$(BUILDDIR)/mscgen-inpage.js: $(EMBED_JS_SOURCES) src/lib/almond.js
	$(RJS) -o baseUrl=./src/script \
			name=../lib/almond \
			include=mscgen-inpage \
			out=$@ \
			wrap=true \
			preserveLicenseComments=true

$(BUILDDIR)/script/mscgen-inpage.js: $(BUILDDIR)/mscgen-inpage.js
	cp $< $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES_NODE) src/index.html src/embed.html src/tutorial.html

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/*

csslint:
	$(CSSLINT) src/style/*.css

lint:
	$(NPM) run lint

cover: dev-build
	$(NPM) run cover

install: $(BUILDDIR)/index.html $(BUILDDIR)/embed.html $(BUILDDIR)/tutorial.html

deploy-gh-pages: install
	@echo Deploying build `utl/getver` to $(BUILDDIR)
	$(GIT) -C $(BUILDDIR) add --all .
	$(GIT) -C $(BUILDDIR) commit -m "build `utl/getver`"
	$(GIT) -C $(BUILDDIR) push origin gh-pages
	$(GIT) -C $(BUILDDIR) status

tag: 
	$(GIT) tag -a `utl/getver` -m "tag release `utl/getver`"
	$(GIT) push --tags

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated
	
check: noconsolestatements lint test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies clean-generated-sources dev-build test nsp
	$(GIT) diff package.json
	
run-update-dependencies: 
	$(NPM) run npm-check-updates
	$(NPM) install
	
depend:
	$(MAKEDEPEND) --system amd,cjs src/script
	$(MAKEDEPEND) --append --system amd --flat-define EMBED_JS_SOURCES src/script/mscgen-inpage.js
	$(MAKEDEPEND) --append --system amd --flat-define INTERPRETER_JS_SOURCES src/script/mscgen-interpreter.js
	$(MAKEDEPEND) --append --system cjs --flat-define CLI_JS_SOURCES src/script/cli/mscgen.js

clean-the-build:
	rm -rf $(REMOVABLEPRODDIRS) \
		$(BUILDDIR)/images \
		$(BUILDDIR)/samples \
		$(BUILDDIR)/index.html \
		$(BUILDDIR)/embed.html \
		$(BUILDDIR)/tutorial.html \
		$(BUILDDIR)/mscgen-inpage.js
	rm -rf coverage

clean-generated-sources: 
	rm -rf $(GENERATED_SOURCES)

clean: clean-the-build clean-generated-sources
	rm -rf $(FAVICONS)
