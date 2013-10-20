SHELL=/bin/sh
.SUFFIXES:
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=node_modules/pegjs/bin/pegjs
RJS=node_modules/requirejs/bin/r.js
GIT=git
LINT=node_modules/jshint/bin/jshint --verbose --show-non-errors
CJS2AMD=utl/commonjs2amd.sh
NPM=npm

GENERATED_SOURCES_WEB=src/script/mscgenparser.js \
	src/script/msgennyparser.js \
	src/style/mscgen.css
GENERATED_SOURCES_NODE=src/script/node/mscgenparser_node.js \
	src/script/node/msgennyparser_node.js
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE)
PRODDIRS=lib images samples style script
LIB_SOURCES_WEB=src/lib/codemirror.js \
    src/lib/codemirror/addon/edit/closebrackets.js \
    src/lib/codemirror/addon/edit/matchbrackets.js \
    src/lib/codemirror/addon/display/placeholder.js \
    src/lib/canvg/canvg.js \
    src/lib/canvg/StackBlur.js \
    src/lib/canvg/rgbcolor.js \
    src/script/jquery.js
SCRIPT_SOURCES_WEB=src/script/renderutensils.js \
    src/script/node/textutensils.js \
    src/script/renderast.js \
    src/script/controller.js \
    src/script/mscgen-main.js
SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(LIB_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) 
SCRIPT_SOURCES_NODE=src/script/node/ast2mscgen.js \
	src/script/node/ast2msgenny.js
SOURCES_NODE=$(GENERATED_SOURCES_NODE) $(SCRIPT_SOURCES_NODE)

.PHONY: help dev-build install checkout-gh-pages deploy-gh-pages check mostlyclean clean noconsolestatements consolecheck lint prerequisites build-prerequisites-node

help:
	@echo possible targets:	dev-build install deploy-gh-pages clean

# file targets

src/script/mscgenparser.js: src/script/node/mscgenparser_node.js
	$(CJS2AMD) < $< > $@

src/script/msgennyparser.js: src/script/node/msgennyparser_node.js
	$(CJS2AMD) < $< > $@

src/script/node/mscgenparser_node.js: src/script/node/mscgenparser.pegjs 
	$(PEGJS) $< $@

src/script/node/msgennyparser_node.js: src/script/node/msgennyparser.pegjs
	$(PEGJS) $< $@

src/style/mscgen.css: src/style/mscgen-src.css src/lib/codemirror/codemirror.css src/lib/codemirror/theme/midnight.css
	$(RJS) -o cssIn=src/style/mscgen-src.css out=$@

$(PRODDIRS):
	mkdir $@

index.html: src/index.html
	cp $< $@

lib/require.js: src/lib/require.js
	cp $< $@

style/mscgen.css: src/style/mscgen.css
	cp $< $@

script/mscgen-main.js: $(SOURCES_WEB)  
	$(RJS) -o baseUrl="./src/script" \
			paths.jquery="jquery" \
			paths.codemirror="codemirror" \
			paths.cm_closebrackets="codemirror/addon/edit/closebrackets" \
			paths.cm_matchbrackets="codemirror/addon/edit/matchbrackets" \
			name="mscgen-main" \
			out="./script/mscgen-main.js"

# "phony" targets
build-prerequisites:
	$(NPM) install pegjs requirejs jshint

runtime-prerequisites-node:
	# cd src/script/node
	$(NPM) install amdefine

prerequisites: build-prerequisites runtime-prerequisites-node

dev-build: $(SOURCES_WEB) $(SOURCES_NODE)

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/script/*

lint:
	$(LINT) $(SCRIPT_SOURCES_WEB) $(SCRIPT_SOURCES_NODE)

install: noconsolestatements $(PRODDIRS) $(SOURCES_NODE) index.html script/mscgen-main.js lib/require.js style/mscgen.css
	cp src/images/* images/.
	cp src/samples/*.mscin samples/.
	cp src/samples/*.msgenny samples/.
    
checkout-gh-pages:
	$(GIT) checkout gh-pages
	$(GIT) merge master -m "merge for gh-pages build"

deploy-gh-pages: checkout-gh-pages install
	$(GIT) add .
	$(GIT) commit -a -m "build"
	$(GIT) push
	$(GIT) checkout master

check: noconsolestatements lint
    #TODO 
    
mostlyclean:
	rm -rf $(PRODDIRS) index.html

clean: mostlyclean
	rm -rf $(GENERATED_SOURCES)
