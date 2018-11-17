
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
PNG2FAVICO=utl/png2favico.sh
RESIZE=utl/resize.sh
IOSRESIZE=utl/iosresize.sh
SEDVERSION=utl/sedversion.sh
NPM=npm
SASS=node_modules/.bin/node-sass --output-style compressed

ifeq ($(GIT_DEPLOY_FROM_BRANCH), $(GIT_CURRENT_BRANCH))
	BUILDDIR=build
else
	BUILDDIR=build
	# BUILDDIR=build/branches/$(GIT_CURRENT_BRANCH)
endif

GENERATED_STYLESHEETS=src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES=$(GENERATED_STYLESHEETS)
REMOVABLEPRODDIRS=$(BUILDDIR)/style \
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

.PHONY: help dev-build install deploy-gh-pages check fullcheck mostlyclean clean prerequisites

help:
	@echo " --------------------------------------------------------"
	@echo "| Just downloaded the mscgen_js sources?                 |"
	@echo "|  First run 'make prerequisites'                        |"
	@echo " --------------------------------------------------------"
	@echo
	@echo "Most important build targets:"
	@echo
	@echo "build"
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
	@echo "clean"
	@echo " removes everything created by either install or dev-build"
	@echo
	@echo "deploy-gh-pages"
	@echo " deploys the build to gh-pages"
	@echo "  - 'master' branch: the root of gh-pages"
	@echo "  - other branches : in branches/branche-name"
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

# dependencies
include src/dependencies.mk

# file targets prod
$(BUILDDIR)/index.html: $(PRODDIRS) \
	src/index.html \
	$(BUILDDIR)/style/interp.css \
	$(BUILDDIR)/mscgen-interpreter.min.js \
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

$(BUILDDIR)/mscgen-interpreter.min.js:
	npx webpack

$(BUILDDIR)/mscgen-inpage.js: node_modules/mscgenjs-inpage/dist/mscgen-inpage.js
	cp $< $@

$(BUILDDIR)/script/mscgen-inpage.js: $(BUILDDIR)/mscgen-inpage.js
	cp $< $@

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: $(GENERATED_SOURCES_NODE) src/index.html src/embed.html src/tutorial.html

build: $(BUILDDIR)/index.html $(BUILDDIR)/embed.html $(BUILDDIR)/tutorial.html

deploy-gh-pages: install
	@echo Deploying build `utl/getver` to $(BUILDDIR)
	$(GIT) -C $(BUILDDIR) add --all .
	$(GIT) -C $(BUILDDIR) commit -m "build `utl/getver`"
	$(GIT) -C $(BUILDDIR) push origin gh-pages
	$(GIT) -C $(BUILDDIR) status


clean-the-build:
	rm -rf $(REMOVABLEPRODDIRS) \
		$(BUILDDIR)/images \
		$(BUILDDIR)/samples \
		$(BUILDDIR)/index.html \
		$(BUILDDIR)/embed.html \
		$(BUILDDIR)/tutorial.html \
		$(BUILDDIR)/mscgen-inpage.js \
		$(BUILDDIR)/mscgen-interpreter.min.js \
	rm -rf coverage

clean-generated-sources:
	rm -rf $(GENERATED_SOURCES)

clean: clean-the-build clean-generated-sources
	rm -rf $(FAVICONS)
