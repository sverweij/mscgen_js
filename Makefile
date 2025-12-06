
.SUFFIXES: .js .css .html .msc .mscin .msgenny .svg .png .jpg
GIT=git
GIT_CURRENT_BRANCH=$(shell tools/get_current_git_branch.sh)
GIT_PRODUCTION_DEPLOYMENT_BRANCH=master
PNG2FAVICO=tools/png2favico.sh
RESIZE=tools/resize.sh
IOSRESIZE=tools/iosresize.sh
SEDVERSION=tools/sedversion.sh
NPM=npm
SASS=node_modules/.bin/sass --style compressed --no-source-map

ifeq ($(GIT_PRODUCTION_DEPLOYMENT_BRANCH), $(GIT_CURRENT_BRANCH))
	BUILDDIR=dist
	MODE=production
else
	BUILDDIR=dist/$(GIT_CURRENT_BRANCH)
	MODE=development
endif

GENERATED_STYLESHEETS=src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES=$(GENERATED_STYLESHEETS)
REMOVABLEPRODDIRS=$(BUILDDIR)/style \
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
	$(BUILDDIR)/favicon-512.png \
	$(BUILDDIR)/iosfavicon-57.png \
	$(BUILDDIR)/iosfavicon-72.png \
	$(BUILDDIR)/iosfavicon-114.png \
	$(BUILDDIR)/iosfavicon-120.png \
	$(BUILDDIR)/iosfavicon-144.png \
	$(BUILDDIR)/iosfavicon-152.png \
	$(BUILDDIR)/maskable_icon.png

.PHONY: help build deploy-gh-pages clean prerequisites

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
	@echo "clean"
	@echo " removes everything created by build
	@echo
	@echo "deploy-gh-pages"
	@echo " deploys the build to gh-pages"
	@echo "  - 'master' branch: the root of gh-pages"
	@echo "  - other branches : in ./branche-name"
	@echo
	@echo " --------------------------------------------------------"
	@echo "| More information and other targets: see wikum/build.md |"
	@echo " --------------------------------------------------------"
	@echo


# production rules
$(BUILDDIR)/%.html: src/%.html tracking.id tracking.host siteverification.id
	$(SEDVERSION) < $< > $@

$(BUILDDIR)/%.xml: src/%.xml
	cp $< $@

$(BUILDDIR)/robots.txt: src/robots.txt
	cp $< $@

$(BUILDDIR)/%.json: src/%.json
	cp $< $@

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

$(BUILDDIR)/maskable_icon.png: src/images/maskable_icon.png
	cp $< $@

$(PRODDIRS):
	mkdir -p $@

# dependencies
include src/dependencies.mk

# file targets prod
$(BUILDDIR)/index.html: $(PRODDIRS) \
	src/index.html \
	$(BUILDDIR)/style/interp.css \
	$(BUILDDIR)/mscgen-interpreter.min.js \
	$(BUILDDIR)/manifest.json \
	$(BUILDDIR)/images/ \
	$(BUILDDIR)/samples/ \
	$(BUILDDIR)/sitemap.xml \
	$(BUILDDIR)/robots.txt \
	$(FAVICONS) \
	$(FONTS)

LIVE_DOC_DEPS=$(PRODDIRS) \
	$(BUILDDIR)/style/doc.css \
	$(BUILDDIR)/mscgen-inpage.js \
	$(BUILDDIR)/mscgen-inpage.js.map \
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

# $(shell echo production)
$(BUILDDIR)/mscgen-interpreter.min.js:
	npx webpack --output-path $(BUILDDIR) --mode $(MODE)

$(BUILDDIR)/mscgen-inpage.js: node_modules/mscgenjs-inpage/dist/mscgen-inpage.js
	cp $< $@

$(BUILDDIR)/mscgen-inpage.js.map: node_modules/mscgenjs-inpage/dist/mscgen-inpage.js.map
	cp $< $@

$(BUILDDIR)/script/mscgen-inpage.js: $(BUILDDIR)/mscgen-inpage.js
	cp $< $@

$(BUILDDIR)/script/mscgen-inpage.js.map: $(BUILDDIR)/mscgen-inpage.js.map
	cp $< $@

# "phony" targets
prerequisites:
	$(NPM) install

build: $(BUILDDIR)/index.html $(BUILDDIR)/embed.html $(BUILDDIR)/tutorial.html
	BUILDDIR=$(BUILDDIR) npx sw-precache --config .sw-precache-config.js

deploy-gh-pages: build
	@echo Deploying build `tools/getver` to $(BUILDDIR)
	$(GIT) -C $(BUILDDIR) add --all .
	$(GIT) -C $(BUILDDIR) commit -m "build `tools/getver`"
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
		$(BUILDDIR)/mscgen-interpreter.min.js.map \
		$(BUILDDIR)/manifest.json \
		$(BUILDDIR)/service-worker.js \
	rm -rf coverage

clean-generated-sources:
	rm -rf $(GENERATED_SOURCES)

clean: clean-the-build clean-generated-sources
	rm -rf $(FAVICONS)
