.SUFFIXES:
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
RJS=node_modules/requirejs/bin/r.js
GIT=git
LINT=node_modules/jshint/bin/jshint --verbose --show-non-errors
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
	src/script/parse/xuparser.js \
	src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES_NODE=src/script/parse/mscgenparser_node.js \
	src/script/parse/msgennyparser_node.js \
	src/script/parse/xuparser_node.js 
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE)
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
PRODDIRS=lib style script fonts
LIB_SOURCES_WEB=src/lib/codemirror/lib/codemirror.js \
	src/lib/codemirror/addon/edit/closebrackets.js \
	src/lib/codemirror/addon/edit/matchbrackets.js \
	src/lib/codemirror/addon/display/placeholder.js \
	src/lib/codemirror/mode/mscgen/mscgen.js \
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
	src/script/ui-control/interpreter-param-actions.js \
	src/script/ui-control/interpreter-uistate.js \
	src/script/ui-control/interpreter-input-actions.js \
	src/script/ui-control/interpreter-output-actions.js \
	src/script/ui-control/interpreter-nav-actions.js \
	src/script/ui-control/controller-animator.js \
	src/script/ui-control/controller-exporter.js \
	src/script/utl/gaga.js \
	src/script/utl/domquery.js \
	src/script/mscgen-interpreter.js 
SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(LIB_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) 
EMBED_SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) \
	src/script/mscgen-inpage.js
FONT_SOURCES=src/fonts/controls.eot \
	src/fonts/controls.svg \
	src/fonts/controls.ttf \
	src/fonts/controls.woff
FONTS=fonts/controls.eot \
	fonts/controls.svg \
	fonts/controls.ttf \
	fonts/controls.woff
FAVICONMASTER=src/images/xu.png
FAVICONS=favicon.ico \
	favicon-16.png \
	favicon-24.png \
	favicon-32.png \
	favicon-48.png \
	favicon-64.png \
	iosfavicon-57.png \
	iosfavicon-72.png \
	favicon-96.png \
	iosfavicon-114.png \
	iosfavicon-120.png \
	favicon-144.png \
	iosfavicon-144.png \
	favicon-152.png \
	iosfavicon-152.png \
	favicon-195.png \
	favicon-228.png
VERSIONEMBEDDABLESOURCES=index.html embed.html tutorial.html

.PHONY: help dev-build install checkout-gh-pages build-gh-pages deploy-gh-pages check mostlyclean clean noconsolestatements consolecheck lint cover prerequisites report test

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

%.html: src/%.html tracking.id tracking.host VERSION siteverification.id
	$(SEDVERSION) < $< > $@

%.css: %.scss
	$(SASS) $< $@

style/%.css: src/style/%.css
	cp $< $@

fonts/%: src/fonts/%
	cp $< $@

favicon.ico: $(FAVICONMASTER)
	$(PNG2FAVICO) $< $@

favicon-%.png: $(FAVICONMASTER)
	$(RESIZE) $< $@ 

iosfavicon-%.png: $(FAVICONMASTER)
	$(IOSRESIZE) $< $@ 

$(PRODDIRS):
	mkdir $@

# file targets dev

src/style/interp.scss: src/lib/codemirror/_codemirror.scss \
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

src/style/doc.scss: src/style/snippets/_header.scss \
	src/style/snippets/_documentation.scss \
	src/style/snippets/_generics.scss \
	src/style/snippets/_popup.scss \
	src/style/snippets/_mediagenerics.scss

src/index.html: src/style/interp.css $(SOURCES_WEB) $(FONT_SOURCES)

src/embed.html: src/style/doc.css

src/tutorial.html: src/style/doc.css

# file targets prod
index.html: $(PRODDIRS) src/index.html style/interp.css lib/require.js script/mscgen-interpreter.js images/ samples/ $(FAVICONS) $(FONTS)

LIVE_DOC_DEPS=$(PRODDIRS) style/doc.css mscgen-inpage.js images/ $(FAVICONS)

embed.html: $(LIVE_DOC_DEPS) src/embed.html

tutorial.html: $(LIVE_DOC_DEPS) src/tutorial.html

siteverification.id:
	@echo yoursiteverifactionidhere > $@

tracking.id:
	@echo yourtrackingidhere > $@

tracking.host:
	@echo auto > $@

VERSION:
	@echo 0.0.0 > $@

images/: src/images
	cp -R $< .

samples/: src/samples
	cp -R $< .

lib/require.js: src/lib/require.js
	cp $< $@

script/mscgen-interpreter.js: $(SOURCES_WEB)  
	$(RJS) -o baseUrl="./src/script" \
			name="mscgen-interpreter" \
			out=$@ \
			preserveLicenseComments=true

mscgen-inpage.js: $(EMBED_SOURCES_WEB)
	$(RJS) -o baseUrl=./src/script \
			name=../lib/almond \
			include=mscgen-inpage \
			out=$@ \
			wrap=true \
			preserveLicenseComments=true

script/mscgen-inpage.js: mscgen-inpage.js
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

install: index.html embed.html tutorial.html

checkout-gh-pages:
	$(GIT) checkout gh-pages
	$(GIT) merge master -m "merge for gh-pages build `cat VERSION`"

build-gh-pages: checkout-gh-pages mostlyclean install

add-n-push-gh-pages:
	$(GIT) add --all .
	$(GIT) commit -m "build `cat VERSION`"
	$(GIT) push
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

check: noconsolestatements lint test

somewhatclean:
	rm -rf $(PRODDIRS) images samples index.html embed.html tutorial.html mscgen-inpage.js
	rm -rf jsdoc
	rm -rf coverage
	rm -rf testcoverage-report

mostlyclean: somewhatclean
	rm -rf $(GENERATED_SOURCES)

clean: mostlyclean
	rm -rf $(FAVICONS)
