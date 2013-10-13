SHELL=/bin/sh
.SUFFIXES:
.SUFFIXES: .js .pegjs .css .html .msc .mscin .msgenny .svg .png .jpg
PEGJS=pegjs
RJS=r.js
GIT=git

GENERATED_SOURCES_WEB=src/script/mscgenparser.js src/script/msgennyparser.js src/script/ast2mscgen.js src/script/ast2msgenny.js src/style/mscgen.css
GENERATED_SOURCES_NODE=src/script/node/mscgenparser_node.js src/script/node/msgennyparser_node.js
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
    src/script/renderast.js \
    src/script/controller.js \
    src/script/mscgen-main.js
SOURCES_WEB=$(GENERATED_SOURCES_WEB) $(LIB_SOURCES_WEB) $(SCRIPT_SOURCES_WEB) 
SOURCES_NODE=$(GENERATED_SOURCES_NODE) src/script/node/ast2mscgen.js src/script/node/ast2msgenny.js

.PHONY: help dev-build install checkout-gh-pages deploy-gh-pages check mostlyclean clean 

help:
	@echo possible targets:	dev-build install deploy-gh-pages clean

# file targets
src/script/mscgenparser.js: src/script/node/mscgenparser.pegjs 
	$(PEGJS) --export-var var\ mscparser $< $@

src/script/msgennyparser.js: src/script/node/msgennyparser.pegjs 
	$(PEGJS) --export-var var\ msgennyparser $< $@

src/script/node/mscgenparser_node.js: src/script/node/mscgenparser.pegjs 
	$(PEGJS) $< $@

src/script/node/msgennyparser_node.js: src/script/node/msgennyparser.pegjs
	$(PEGJS) $< $@

src/script/ast2mscgen.js: src/script/node/ast2mscgen.js
	sed s/module.exports/var\ tomscgen/g $< > $@

src/script/ast2msgenny.js: src/script/node/ast2msgenny.js
	sed s/module.exports/var\ tomsgenny/g $< > $@

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
dev-build: $(SOURCES_WEB) $(SOURCES_NODE)

noconsolestatements:
	@echo scanning for console statements ...
	grep -r console src/script/* | grep -c console | grep ^0$$
	@echo ... ok

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

check: noconsolestatements
    #TODO 
    
mostlyclean:
	rm -rf $(PRODDIRS) index.html

clean: mostlyclean
	rm -rf $(GENERATED_SOURCES)
