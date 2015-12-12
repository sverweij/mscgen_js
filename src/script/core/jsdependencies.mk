
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
indexAMD.js: \
	lib/lodash/lodash.custom.js \
	parse/mscgenparser.js \
	parse/msgennyparser.js \
	parse/xuparser.js \
	render/graphics/renderast.js \
	render/text/ast2dot.js \
	render/text/ast2doxygen.js \
	render/text/ast2mscgen.js \
	render/text/ast2msgenny.js \
	render/text/ast2xu.js

render/graphics/entities.js: \
	render/graphics/constants.js \
	render/graphics/renderlabels.js

render/graphics/markermanager.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js

render/graphics/renderast.js: \
	render/graphics/constants.js \
	render/graphics/entities.js \
	render/graphics/idmanager.js \
	render/graphics/markermanager.js \
	render/graphics/renderlabels.js \
	render/graphics/renderskeleton.js \
	render/graphics/renderutensils.js \
	render/graphics/rowmemory.js \
	render/graphics/svgelementfactory.js \
	render/graphics/svgutensils.js \
	render/graphics/swap.js \
	render/text/arcmappings.js \
	render/text/flatten.js

render/graphics/renderlabels.js: \
	render/graphics/constants.js \
	render/graphics/svgelementfactory.js \
	render/graphics/svgutensils.js \
	render/text/arcmappings.js \
	render/text/textutensils.js

render/graphics/renderskeleton.js: \
	render/graphics/constants.js \
	render/graphics/svgelementfactory.js

render/graphics/svgelementfactory.js: \
	render/graphics/constants.js

render/graphics/svgutensils.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/constants.js \
	render/graphics/idmanager.js

render/text/ast2animate.js: \
	lib/lodash/lodash.custom.js

render/text/ast2dot.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js \
	render/text/flatten.js \
	render/text/textutensils.js

render/text/ast2doxygen.js: \
	render/text/arcmappings.js \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/ast2mscgen.js: \
	render/text/arcmappings.js \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/ast2msgenny.js: \
	render/text/ast2thing.js

render/text/ast2thing.js: \
	render/text/textutensils.js

render/text/ast2xu.js: \
	render/text/ast2thing.js \
	render/text/textutensils.js

render/text/colorize.js: \
	render/text/arcmappings.js \
	render/text/asttransform.js

render/text/flatten.js: \
	lib/lodash/lodash.custom.js \
	render/text/arcmappings.js \
	render/text/asttransform.js \
	render/text/textutensils.js

# cjs dependencies
index.js: \
	lib/lodash/lodash.custom.js \
	render/graphics/renderast.js

test/parse/t_mscgenparser_node.js: \
	parse/mscgenparser_node.js \
	test/astfixtures.js \
	test/testutensils.js

test/parse/t_msgennyparser_node.js: \
	parse/msgennyparser_node.js \
	test/astfixtures.js \
	test/testutensils.js

test/parse/t_xuparser_node.js: \
	parse/xuparser_node.js \
	test/astfixtures.js \
	test/testutensils.js

test/render/graphics/t_markermanager.js: \
	render/graphics/markermanager.js

test/render/graphics/t_renderast.js: \
	render/graphics/renderast.js \
	test/testutensils.js

test/render/text/t_ast2animate.js: \
	parse/xuparser_node.js \
	render/text/ast2animate.js \
	test/astfixtures.js \
	test/testutensils.js

test/render/text/t_ast2dot.js: \
	render/text/ast2dot.js \
	test/astfixtures.js

test/render/text/t_ast2doxygen.js: \
	render/text/ast2doxygen.js \
	test/astfixtures.js

test/render/text/t_ast2mscgen.js: \
	parse/mscgenparser_node.js \
	render/text/ast2mscgen.js \
	test/astfixtures.js

test/render/text/t_ast2msgenny.js: \
	render/text/ast2msgenny.js \
	test/astfixtures.js \
	test/testutensils.js

test/render/text/t_ast2xu.js: \
	parse/xuparser_node.js \
	render/text/ast2xu.js \
	test/astfixtures.js

test/render/text/t_colorize.js: \
	lib/lodash/lodash.custom.js \
	render/text/colorize.js \
	test/astfixtures.js

test/render/text/t_flatten.js: \
	render/text/flatten.js \
	test/astfixtures.js

test/render/text/t_textutensils.js: \
	render/text/textutensils.js

test/t_index.js: \
	index.js \
	test/astfixtures.js \
	test/testutensils.js

