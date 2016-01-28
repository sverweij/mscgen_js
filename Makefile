
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
RJS=node_modules/requirejs/bin/r.js
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
CSSLINT=node node_modules/csslint/cli.js --format=compact --quiet --ignore=ids
PNG2FAVICO=utl/png2favico.sh
RESIZE=utl/resize.sh
IOSRESIZE=utl/iosresize.sh
SEDVERSION=utl/sedversion.sh
NPM=npm
SASS=node_modules/node-sass/bin/node-sass --output-style compressed
MAKEDEPEND=node_modules/.bin/js-makedepend --output-to src/jsdependencies.mk --exclude "node_modules"
MINIFY=node_modules/.bin/uglifyjs

ifeq ($(GIT_DEPLOY_FROM_BRANCH), $(GIT_CURRENT_BRANCH))
	BUILDDIR=build
else
	BUILDDIR=build/branches/$(GIT_CURRENT_BRANCH)
endif

GENERATED_STYLESHEETS=src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES=$(GENERATED_STYLESHEETS)
REMOVABLEPRODDIRS=$(BUILDDIR)/script/lib \
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
CODEMIRROR_ROOT=node_modules/codemirror
MSCGENJS_CORE_ROOT=node_modules/mscgenjs
MSCGENJS_INPAGE_ROOT=node_modules/mscgenjs-inpage
CODEMIRROR_LIBDIRS=src/script/lib/codemirror/addon/dialog \
	src/script/lib/codemirror/addon/display \
	src/script/lib/codemirror/addon/edit \
	src/script/lib/codemirror/addon/search \
	src/script/lib/codemirror/addon/selection \
	src/script/lib/codemirror/lib \
	src/script/lib/codemirror/mode/mscgen \
	src/script/lib/codemirror/mode/javascript \
	src/script/lib/codemirror/theme
MSCGENJS_LIBDIRS=src/script/lib/mscgenjs-core/parse \
	src/script/lib/mscgenjs-core/render/graphics \
	src/script/lib/mscgenjs-core/render/text \
	src/script/lib/mscgenjs-core/lib/lodash

LIBDIRS=$(CODEMIRROR_LIBDIRS) $(MSCGENJS_LIBDIRS)

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test update-dependencies run-update-dependencies depend

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

$(LIBDIRS):
	mkdir -p $@

src/script/lib/require.js: node_modules/requirejs/require.js
	$(MINIFY) $< -m -c > $@

src/script/lib/codemirror/lib/_%.scss: $(CODEMIRROR_ROOT)/lib/%.css $(CODEMIRROR_LIBDIRS)
	cp $< $@

src/script/lib/codemirror/addon/dialog/_%.scss: $(CODEMIRROR_ROOT)/addon/dialog/%.css $(CODEMIRROR_LIBDIRS)
	cp $< $@

src/script/lib/codemirror/theme/_%.scss: $(CODEMIRROR_ROOT)/theme/%.css $(CODEMIRROR_LIBDIRS)
	cp $< $@

src/script/lib/codemirror/%.js: $(CODEMIRROR_ROOT)/%.js $(CODEMIRROR_LIBDIRS)
	cp $< $@

src/mscgen-inpage.js: $(MSCGENJS_INPAGE_ROOT)/dist/mscgen-inpage.js
	cp $< $@

src/script/lib/mscgenjs-core/render/graphics/%.js: $(MSCGENJS_CORE_ROOT)/render/graphics/%.js $(MSCGENJS_LIBDIRS)
	cp $< $@

src/script/lib/mscgenjs-core/render/text/%.js: $(MSCGENJS_CORE_ROOT)/render/text/%.js $(MSCGENJS_LIBDIRS)
	cp $< $@

src/script/lib/mscgenjs-core/parse/%.js: $(MSCGENJS_CORE_ROOT)/parse/%.js $(MSCGENJS_LIBDIRS)
	cp $< $@

src/script/lib/mscgenjs-core/lib/lodash/%.js: $(MSCGENJS_CORE_ROOT)/lib/lodash/%.js $(MSCGENJS_LIBDIRS)
	cp $< $@

# dependencies
include src/jsdependencies.mk
include src/dependencies.mk

# file targets prod
$(BUILDDIR)/index.html: $(PRODDIRS) \
	src/index.html \
	$(BUILDDIR)/style/interp.css \
	$(BUILDDIR)/script/lib/require.js \
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

$(BUILDDIR)/script/lib/require.js: src/script/lib/require.js
	cp $< $@

$(BUILDDIR)/script/mscgen-interpreter.js: $(INTERPRETER_JS_SOURCES)
	$(RJS) -o baseUrl="./src/script" \
			name="mscgen-interpreter" \
			out=$@.tmp \
			preserveLicenseComments=true
	$(SEDVERSION) < $@.tmp > $@
	rm $@.tmp

$(BUILDDIR)/mscgen-inpage.js: src/mscgen-inpage.js
	cp $< $@

$(BUILDDIR)/script/mscgen-inpage.js: $(BUILDDIR)/mscgen-inpage.js
	cp $< $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES_NODE) src/index.html src/embed.html src/tutorial.html

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/mscgen-*.js src/script/interpreter src/script/utl | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/mscgen-*.js src/script/interpreter src/script/utl

csslint:
	$(CSSLINT) src/style/*.css

lint:
	$(NPM) run lint

stylecheck:
	$(NPM) run jscs

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

push-mirrors:
	$(GIT) push bitbucket-mirror

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

check: noconsolestatements lint stylecheck test

fullcheck: check outdated nsp

update-dependencies: run-update-dependencies clean-generated-sources dev-build test nsp
	$(GIT) diff package.json

run-update-dependencies:
	$(NPM) run npm-check-updates
	$(NPM) install

depend:
	$(MAKEDEPEND) --system amd,cjs src/script
	$(MAKEDEPEND) --append --system amd --flat-define INTERPRETER_JS_SOURCES src/script/mscgen-interpreter.js

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
	rm -rf $(LIBDIRS)
	rm -rf $(FAVICONS)
