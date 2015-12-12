# javascript that can't get makedepended because it loads its
# dependencies conditionally
index.js: \
	parse/mscgenparser_node.js \
	parse/xuparser_node.js \
	parse/msgennyparser_node.js \
	render/text/ast2mscgen.js \
	render/text/ast2msgenny.js \
	render/text/ast2xu.js \
	render/text/ast2dot.js \
	render/text/ast2doxygen.js \
	render/graphics/renderast.js
