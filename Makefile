.SUFFIXES:
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
RJS=node_modules/requirejs/bin/r.js
GIT=git
CSSLINT=node node_modules/csslint/cli.js --format=compact --quiet --ignore=ids
CJS2AMD=utl/commonjs2amd.sh
PNG2FAVICO=utl/png2favico.sh
RESIZE=utl/resize.sh
IOSRESIZE=utl/iosresize.sh
SEDVERSION=utl/sedversion.sh
NPM=npm
DOC=node node_modules/jsdoc/jsdoc.js --destination jsdoc
SASS=node_modules/node-sass/bin/node-sass --output-style compressed

GENERATED_SOURCES_WEB=src/script/parse/mscgenparser.js \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js
GENERATED_STYLESHEETS=src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES_NODE=src/script/parse/mscgenparser_node.js \
	src/script/parse/msgennyparser_node.js \
	src/script/parse/xuparser_node.js 
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE) $(GENERATED_STYLESHEETS)
SCRIPT_SOURCES_NODE=src/script/render/text/ast2thing.js \
	src/script/render/text/ast2mscgen.js \
	src/script/render/text/ast2xu.js \
	src/script/render/text/ast2msgenny.js \
	src/script/render/text/ast2dot.js \
	src/script/render/text/ast2animate.js \
	src/script/render/text/dotmap.js \
	src/script/render/text/asttransform.js \
	src/script/render/text/flatten.js \
	src/script/render/text/colorize.js \
	src/script/render/text/utensils.js \
	src/script/utl/paramslikker.js
SOURCES_NODE=$(GENERATED_SOURCES_NODE) $(SCRIPT_SOURCES_NODE)
BUILDDIR=build
REMOVABLEPRODDIRS=$(BUILDDIR)/lib \
	$(BUILDDIR)/style \
	$(BUILDDIR)/script \
	$(BUILDDIR)/fonts
PRODDIRS=$(BUILDDIR) \
		 $(REMOVABLEPRODDIRS)
LIB_SOURCES_WEB=src/lib/codemirror/lib/codemirror.js \
	src/lib/codemirror/addon/edit/closebrackets.js \
	src/lib/codemirror/addon/edit/matchbrackets.js \
	src/lib/codemirror/addon/display/placeholder.js \
	src/lib/codemirror/mode/mscgen/mscgen.js \
	src/lib/codemirror/mode/javascript/javascript.js \
	src/lib/canvg/canvg.js \
	src/lib/canvg/StackBlur.js \
	src/lib/canvg/rgbcolor.js 
SCRIPT_SOURCES_WEB=$(SCRIPT_SOURCES_NODE) \
	src/script/render/graphics/svgelementfactory.js \
	src/script/render/graphics/svgutensils.js \
	src/script/render/graphics/renderutensils.js \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/rowmemory.js \
	src/script/render/graphics/idmanager.js \
	src/script/render/text/textutensils.js \
	src/script/render/graphics/renderskeleton.js \
	src/script/render/graphics/renderast.js \
	src/script/render/graphics/entities.js \
	src/script/ui-control/interpreter-param-actions.js \
	src/script/ui-control/interpreter-editor-events.js \
	src/script/ui-control/interpreter-uistate.js \
	src/script/ui-control/interpreter-input-actions.js \
	src/script/ui-control/interpreter-output-actions.js \
	src/script/ui-control/interpreter-nav-actions.js \
	src/script/ui-control/controller-animator.js \
	src/script/ui-control/controller-exporter.js \
	src/script/ui-control/controller-raster-exporter.js \
	src/script/ui-control/store.js \
	src/script/utl/gaga.js \
	src/script/utl/domquery.js \
	src/script/mscgen-interpreter.js 
SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(LIB_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) 
EMBED_SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) \
	src/script/mscgen-inpage.js \
	src/script/ui-control/embed-config.js
FONT_SOURCES=src/fonts/controls.eot \
	src/fonts/controls.svg \
	src/fonts/controls.ttf \
	src/fonts/controls.woff
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
	$(BUILDDIR)/iosfavicon-57.png \
	$(BUILDDIR)/iosfavicon-72.png \
	$(BUILDDIR)/favicon-96.png \
	$(BUILDDIR)/iosfavicon-114.png \
	$(BUILDDIR)/iosfavicon-120.png \
	$(BUILDDIR)/favicon-144.png \
	$(BUILDDIR)/iosfavicon-144.png \
	$(BUILDDIR)/favicon-152.png \
	$(BUILDDIR)/iosfavicon-152.png \
	$(BUILDDIR)/favicon-195.png \
	$(BUILDDIR)/favicon-228.png
VERSIONEMBEDDABLESOURCES=$(BUILDDIR)/index.html $(BUILDDIR)/embed.html $(BUILDDIR)/tutorial.html

.PHONY: help dev-build install build-gh-pages deploy-gh-pages check mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test

help:
	@echo \ \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
	@echo \| Just downloaded the mscgen_js sources? \ \|
	@echo \| \ First run \'make prerequisites\'  \ \ \ \ \ \ \ \ \|
	@echo \ \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
	@echo
	@echo Most important build targets:
	@echo
	@echo dev-build
	@echo \ \(re\)enerates stuff needed to develop \(pegjs \-\> js, css smashing etc\)
	@echo
	@echo check
	@echo \ runs the linter and executes all unit tests
	@echo 
	@echo install
	@echo \ creates the production version \(minified js, images, html\)
	@echo \ \-\> this is probably the target you want when hosting mscgen_js
	@echo 
	@echo clean
	@echo \ removes everything created by either install or dev-build
	@echo
	@echo deploy-gh-pages
	@echo \ merges main to gh-pages, runs an install and pushes it to origin
	@echo
	@echo \ \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
	@echo \|\ More information and other targets: see wikum\\build.md \|
	@echo \ \-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-
	@echo



# production rules
src/script/parse/%parser.js: src/script/parse/%parser_node.js
	$(CJS2AMD) < $< > $@

src/script/parse/%parser_node.js: src/script/parse/peg/%parser.pegjs 
	$(PEGJS) $< $@

$(BUILDDIR)/%.html: src/%.html tracking.id tracking.host VERSION siteverification.id
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
	mkdir $@

# file targets dev

src/style/interp.css: src/style/interp.scss \
	src/lib/codemirror/_codemirror.scss \
	src/lib/codemirror/theme/_midnight.scss \
	src/style/snippets/_interpreter.scss \
	src/style/snippets/_anim.scss \
	src/style/snippets/_header.scss \
	src/style/snippets/_fonts.scss \
	src/style/snippets/_generics.scss \
	src/style/snippets/_popup.scss \
	src/style/snippets/_mediagenerics.scss \
	src/fonts/controls.eot \
	src/fonts/controls.svg \
	src/fonts/controls.ttf \
	src/fonts/controls.woff

src/style/doc.css: src/style/doc.scss \
	src/style/snippets/_header.scss \
	src/style/snippets/_documentation.scss \
	src/style/snippets/_generics.scss \
	src/style/snippets/_popup.scss \
	src/style/snippets/_mediagenerics.scss

src/index.html: src/style/interp.css $(SOURCES_WEB) $(FONT_SOURCES)

src/embed.html: src/style/doc.css

src/tutorial.html: src/style/doc.css

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
	$(FAVICONS)

$(BUILDDIR)/embed.html: $(LIVE_DOC_DEPS) src/embed.html

$(BUILDDIR)/tutorial.html: $(LIVE_DOC_DEPS) src/tutorial.html

siteverification.id:
	@echo yoursiteverifactionidhere > $@

tracking.id:
	@echo yourtrackingidhere > $@

tracking.host:
	@echo auto > $@

VERSION:
	@echo 0.0.0 > $@

$(BUILDDIR)/images/: src/images
	cp -R $< $@

$(BUILDDIR)/samples/: src/samples
	cp -R $< $@

$(BUILDDIR)/lib/require.js: src/lib/require.js
	cp $< $@

$(BUILDDIR)/script/mscgen-interpreter.js: $(SOURCES_WEB)  
	$(RJS) -o baseUrl="./src/script" \
			name="mscgen-interpreter" \
			out=$@.tmp \
			preserveLicenseComments=true
	$(SEDVERSION) < $@.tmp > $@
	rm $@.tmp

$(BUILDDIR)/mscgen-inpage.js: $(EMBED_SOURCES_WEB)
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

lint: $(SCRIPT_SOURCES_WEB) $(SCRIPT_SOURCES_NODE)
	$(NPM) run lint

cover: dev-build
	$(NPM) run cover

install: $(BUILDDIR)/index.html $(BUILDDIR)/embed.html $(BUILDDIR)/tutorial.html

build-gh-pages: mostlyclean install

add-n-push-gh-pages:
	cd $(BUILDDIR)
	$(GIT) add --all .
	$(GIT) commit -m "build `cat ../VERSION`"
	$(GIT) push origin gh-pages
	$(GIT) status

deploy-gh-pages: build-gh-pages add-n-push-gh-pages

tag: 
	$(GIT) tag -a `cat VERSION` -m "tag release `cat VERSION`"
	$(GIT) push --tags

report: dev-build
	$(NPM) run plato

doc:
	$(DOC) $(SCRIPT_SOURCES_WEB) src/script/README.md

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated
	
check: noconsolestatements lint test

fullcheck: check outdated nsp

somewhatclean:
	rm -rf $(REMOVABLEPRODDIRS) \
		$(BUILDDIR)/images \
		$(BUILDDIR)/samples \
		$(BUILDDIR)/index.html \
		$(BUILDDIR)/embed.html \
		$(BUILDDIR)/tutorial.html \
		$(BUILDDIR)/mscgen-inpage.js
	rm -rf jsdoc
	rm -rf coverage
	rm -rf testcoverage-report

mostlyclean: somewhatclean
	rm -rf $(GENERATED_SOURCES)

clean: mostlyclean
	rm -rf $(FAVICONS)
