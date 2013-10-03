help:
	@echo possible targets: dev-build build deploy clean
	
GENERATED_SOURCES_WEB=src/script/mscgenparser.js src/script/msgennyparser.js src/script/ast2mscgen.js src/script/ast2msgenny.js src/style/mscgen.css
GENERATED_SOURCES_NODE=src/script/node/mscgenparser_node.js src/script/node/msgennyparser_node.js
GENERATED_SOURCES=$(GENERATED_SOURCES_WEB) $(GENERATED_SOURCES_NODE)
PRODDIRS=lib images samples style
.PHONY: help hoja-web hoja-node dev-build optimize-js build checkout-gh-pages deploy clean superscrub


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
# src/script/jquery.js
# src/script/mscgenparser.js
# src/script/msgennyparser.js
# src/script/renderutensils.js
# src/script/renderast.js
# src/script/ast2msgenny.js
# src/script/ast2mscgen.js
# src/script/../lib/codemirror.js
# src/script/../lib/codemirror/addon/edit/closebrackets.js
# src/script/../lib/codemirror/addon/edit/matchbrackets.js
# src/script/../lib/codemirror/addon/display/placeholder.js
# src/script/../lib/canvg/canvg.js
# src/script/../lib/canvg/StackBlur.js
# src/script/../lib/canvg/rgbcolor.js
# src/script/controller.js
# src/script/mscgen-main.js
optimize-js: $(GENERATED_SOURCES_WEB) 
	r.js -o baseUrl="./src/script" \
			paths.jquery="jquery" \
			paths.codemirror="codemirror" \
			paths.cm_closebrackets="codemirror/addon/edit/closebrackets" \
			paths.cm_matchbrackets="codemirror/addon/edit/matchbrackets" \
			name="mscgen-main" \
			out="./script/mscgen-main.js"

$(PRODDIRS):
	mkdir $@

build: hoja-web hoja-node optimize-js $(PRODDIRS)
	cp src/index.html index.html
	cp src/lib/require.js lib/require.js
	cp src/images/* images/.
	cp src/samples/*.mscin samples/.
	cp src/samples/*.msgenny samples/.
	cp src/style/mscgen.css style/.
    
checkout-gh-pages:
	git checkout gh-pages
	git merge master -m "merge for gh-pages build"

deploy: checkout-gh-pages build
	git add .
	git commit -a -m "build"
	git push
	git checkout master

clean:
	rm -rf $(PRODDIRS) index.html

superscrub: clean
	rm -rf $(GENERATED_SOURCES)
