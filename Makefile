help:
	@echo possible targets: dev-build build deploy-gh-pages clean
	
GENERATED_SOURCES_WEB=src/script/mscgenparser.js src/script/msgennyparser.js src/script/ast2mscgen.js src/script/ast2msgenny.js src/style/mscgen.css
GENERATED_SOURCES_NODE=src/script/node/mscgenparser_node.js src/script/node/msgennyparser_node.js
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE)
PRODDIRS=lib images samples style
.PHONY: help hoja-web hoja-node dev-build build checkout-gh-pages deploy-gh-pages clean superscrub


src/script/mscgenparser.js: src/script/node/mscgenparser.pegjs 
	pegjs --export-var var\ mscparser $< $@

src/script/msgennyparser.js: src/script/node/msgennyparser.pegjs 
	pegjs --export-var var\ msgennyparser $< $@

src/script/node/mscgenparser_node.js: src/script/node/mscgenparser.pegjs 
	pegjs $< $@

src/script/node/msgennyparser_node.js: src/script/node/msgennyparser.pegjs
	pegjs $< $@

src/script/ast2mscgen.js: src/script/node/ast2mscgen.js
	sed s/module.exports/var\ tomscgen/g $< > $@

src/script/ast2msgenny.js: src/script/node/ast2msgenny.js
	sed s/module.exports/var\ tomsgenny/g $< > $@

src/style/mscgen.css: src/style/mscgen-src.css src/lib/codemirror/codemirror.css src/lib/codemirror/theme/midnight.css
	r.js -o cssIn=src/style/mscgen-src.css out=$@

hoja-web: $(GENERATED_SOURCES_WEB) 

hoja-node: $(GENERATED_SOURCES_NODE) src/script/node/ast2mscgen.js src/script/node/ast2msgenny.js
		
dev-build: hoja-web hoja-node

# TODO: explicitly add other dependicies (?) 
# r.js automatically traces this stuff. From the run on 2013-10-02 21:41:


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

script/mscgen-main.js: $(SOURCES_WEB)  
	r.js -o baseUrl="./src/script" \
			paths.jquery="jquery" \
			paths.codemirror="codemirror" \
			paths.cm_closebrackets="codemirror/addon/edit/closebrackets" \
			paths.cm_matchbrackets="codemirror/addon/edit/matchbrackets" \
			name="mscgen-main" \
			out="./script/mscgen-main.js"

$(PRODDIRS):
	mkdir $@

index.html: src/index.html
	cp $< $@

lib/require.js: src/lib/require.js
	cp $< $@

style/mscgen.css: src/style/mscgen.css
	cp $< $@

build: $(PRODDIRS) $(GENERATED_SOURCES_NODE) index.html script/mscgen-main.js lib/require.js style/mscgen.css
	cp src/images/* images/.
	cp src/samples/*.mscin samples/.
	cp src/samples/*.msgenny samples/.
    
checkout-gh-pages:
	git checkout gh-pages
	git merge master -m "merge for gh-pages build"

deploy-gh-pages: checkout-gh-pages build
	git add .
	git commit -a -m "build"
	git push
	git checkout master

clean:
	rm -rf $(PRODDIRS) index.html

superscrub: clean
	rm -rf $(GENERATED_SOURCES)
