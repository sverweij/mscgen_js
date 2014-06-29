.SUFFIXES:
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
RJS=node_modules/requirejs/bin/r.js
PLATO=node_modules/plato/bin/plato
MOCHA=node_modules/mocha/bin/mocha
MOCHA_FORK=node_modules/mocha/bin/_mocha
COVER=node node_modules/istanbul/lib/cli.js
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

GENERATED_SOURCES_WEB=src/script/mscgenparser.js \
	src/script/msgennyparser.js \
	src/script/xuparser.js \
	src/style/interp.css \
	src/style/doc.css
GENERATED_SOURCES_NODE=src/script/node/mscgenparser_node.js \
	src/script/node/msgennyparser_node.js \
	src/script/node/xuparser_node.js 
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE)
SCRIPT_SOURCES_NODE=src/script/node/ast2thing.js \
	src/script/node/ast2mscgen.js \
	src/script/node/ast2xu.js \
	src/script/node/ast2msgenny.js \
	src/script/node/ast2dot.js \
	src/script/node/dotmap.js \
	src/script/node/asttransform.js \
	src/script/node/flatten.js \
	src/script/node/colorize.js \
	src/script/node/paramslikker.js
SOURCES_NODE=$(GENERATED_SOURCES_NODE) $(SCRIPT_SOURCES_NODE)
PRODDIRS=lib images samples style script
LIB_SOURCES_WEB=src/lib/codemirror/lib/codemirror.js \
	src/lib/codemirror/addon/edit/closebrackets.js \
	src/lib/codemirror/addon/edit/matchbrackets.js \
	src/lib/codemirror/addon/display/placeholder.js \
	src/lib/canvg/canvg.js \
	src/lib/canvg/StackBlur.js \
	src/lib/canvg/rgbcolor.js \
	src/script/jquery.js
SCRIPT_SOURCES_WEB=$(SCRIPT_SOURCES_NODE) \
	src/script/renderutensils.js \
	src/script/node/textutensils.js \
	src/script/renderskeleton.js \
	src/script/renderast.js \
	src/script/controller.js \
	src/script/gaga.js \
	src/script/mscgen-main.js 
SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(LIB_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) 
EMBED_SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) \
	src/script/controller-inpage.js \
	src/script/mscgen-inpage.js
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
VERSIONEMBEDDABLESOURCES=index.html embed.html

.PHONY: help dev-build install checkout-gh-pages build-gh-pages deploy-gh-pages check mostlyclean clean noconsolestatements consolecheck lint cover prerequisites build-prerequisites-node report test

help:
	@echo possible targets:	dev-build install deploy-gh-pages clean check

# file targets
favicon.ico: $(FAVICONMASTER)
	$(PNG2FAVICO) $< $@

favicon-%.png: $(FAVICONMASTER)
	$(RESIZE) $< $@ 

iosfavicon-%.png: $(FAVICONMASTER)
	$(IOSRESIZE) $< $@ 

src/script/mscgenparser.js: src/script/node/mscgenparser_node.js
	$(CJS2AMD) < $< > $@

src/script/msgennyparser.js: src/script/node/msgennyparser_node.js
	$(CJS2AMD) < $< > $@

src/script/xuparser.js: src/script/node/xuparser_node.js
	$(CJS2AMD) < $< > $@

src/script/node/mscgenparser_node.js: src/script/node/mscgenparser.pegjs 
	$(PEGJS) $< $@

src/script/node/msgennyparser_node.js: src/script/node/msgennyparser.pegjs
	$(PEGJS) $< $@

src/script/node/xuparser_node.js: src/script/node/xuparser.pegjs
	$(PEGJS) $< $@

src/style/interp.css: src/style/interp-src.css src/lib/codemirror/codemirror.css src/lib/codemirror/theme/midnight.css src/style/snippets/interpreter.css src/style/snippets/header.css src/style/snippets/generics.css src/style/snippets/popup.css
	$(RJS) -o cssIn=src/style/interp-src.css out=$@

src/style/doc.css: src/style/doc-src.css src/style/snippets/header.css src/style/snippets/documentation.css src/style/snippets/generics.css
	$(RJS) -o cssIn=src/style/doc-src.css out=$@


$(PRODDIRS):
	mkdir $@

src/index.html: src/style/interp.css

index.html: src/index.html
	$(SEDVERSION) < $< > $@

src/embed.html: src/style/doc.css

embed.html: src/embed.html
	$(SEDVERSION) < $< > $@

lib/require.js: src/lib/require.js
	cp $< $@

style/interp.css: src/style/interp.css
	cp $< $@

style/doc.css: src/style/doc.css
	cp $< $@

script/mscgen-main.js: $(SOURCES_WEB)  
	$(RJS) -o baseUrl="./src/script" \
			name="mscgen-main" \
			out=$@ \

			# paths.jquery="jquery" \
			# paths.codemirror="../lib/codemirror" \
			# paths.cm_closebrackets="../lib/codemirror/edit/closebrackets" \
			# paths.cm_matchbrackets="../lib/codemirror/edit/matchbrackets" \
			# paths.dagred3="../lib/dagre/dagred3" \
			# paths.d3="../lib/dagre/d3" \

# script/mscgen-inpage.js: $(EMBED_SOURCES_WEB) lib/require.js
	# $(RJS) -o baseUrl="./src/script" \
			# name="mscgen-inpage" \
			# out="./script/mscgen-inpage.js" \

mscgen-inpage.js: $(EMBED_SOURCES_WEB)
	$(RJS) -o baseUrl=./src/script \
			name=../lib/almond \
			include=mscgen-inpage \
			out=$@ \
			wrap=true

script/mscgen-inpage.js: mscgen-inpage.js
	cp $< $@

# "phony" targets
build-prerequisites:
	$(NPM) install pegjs requirejs jshint plato mocha istanbul csslint

runtime-prerequisites-node:
	# cd src/script/node
	$(NPM) install amdefine jsdom posix-getopt

prerequisites: build-prerequisites runtime-prerequisites-node

dev-build: $(SOURCES_WEB) $(EMBED_SOURCES_WEB) $(SOURCES_NODE)

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/*

csslint:
	$(CSSLINT) src/style/snippets/*.css

lint:
	$(LINT) $(SCRIPT_SOURCES_WEB) $(SCRIPT_SOURCES_NODE)

cover:
	$(COVER) cover $(MOCHA_FORK) src/script/node/test/

# install: noconsolestatements $(PRODDIRS) $(SOURCES_NODE) index.html script/mscgen-main.js lib/require.js style/interp.css $(FAVICONS)
install: $(PRODDIRS) $(SOURCES_NODE) index.html script/mscgen-main.js embed.html mscgen-inpage.js script/mscgen-inpage.js lib/require.js style/interp.css style/doc.css $(FAVICONS)
	cp -R src/images .
	cp -R src/samples .
	
checkout-gh-pages:
	$(GIT) checkout gh-pages
	$(GIT) merge master -m "merge for gh-pages build `cat VERSION`"

build-gh-pages: checkout-gh-pages mostlyclean install

deploy-gh-pages: build-gh-pages
	$(GIT) add .
	$(GIT) commit -m "build `cat VERSION`"
	$(GIT) push
	$(GIT) status

tag: 
	$(GIT) tag -a `cat VERSION` -m "tag release `cat VERSION`"
	$(GIT) push --tags

report:
	$(PLATO) -r -d platoreports -x "jquery|parser|test|cli|attic" src/script/

doc:
	$(DOC) $(SCRIPT_SOURCES_WEB) src/script/README.md

test:
	# $(MOCHA) -R spec src/script/node/test/
	$(MOCHA) -R dot src/script/node/test/

check: noconsolestatements lint test

ibartfast: 
	rm -rf *.png *.ico

slart: ibartfast $(FAVICONS)
	
somewhatclean:
	rm -rf $(PRODDIRS) index.html embed.html mscgen-inpage.js
	rm -rf jsdoc
	rm -rf coverage

mostlyclean: somewhatclean
	rm -rf $(GENERATED_SOURCES)

clean: mostlyclean
	rm -rf $(FAVICONS)
