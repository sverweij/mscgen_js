
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/script/mscgen-inpage.js: \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js \
	src/script/render/graphics/renderast.js \
	src/script/ui/embedding/config.js \
	src/script/ui/utl/exporter.js \
	src/script/utl/utensils.js

src/script/mscgen-interpreter.js: \
	src/script/ui/interpreter/editor-events.js \
	src/script/ui/interpreter/input-actions.js \
	src/script/ui/interpreter/nav-actions.js \
	src/script/ui/interpreter/output-actions.js \
	src/script/ui/interpreter/param-actions.js

src/script/render/graphics/entities.js: \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/renderlabels.js

src/script/render/graphics/markermanager.js: \
	src/script/render/text/arcmappings.js \
	src/script/utl/utensils.js

src/script/render/graphics/renderast.js: \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/entities.js \
	src/script/render/graphics/idmanager.js \
	src/script/render/graphics/markermanager.js \
	src/script/render/graphics/renderlabels.js \
	src/script/render/graphics/renderskeleton.js \
	src/script/render/graphics/renderutensils.js \
	src/script/render/graphics/rowmemory.js \
	src/script/render/graphics/svgelementfactory.js \
	src/script/render/graphics/svgutensils.js \
	src/script/render/text/arcmappings.js \
	src/script/render/text/flatten.js \
	src/script/utl/utensils.js

src/script/render/graphics/renderlabels.js: \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/svgelementfactory.js \
	src/script/render/graphics/svgutensils.js \
	src/script/render/text/arcmappings.js \
	src/script/render/text/textutensils.js

src/script/render/graphics/renderskeleton.js: \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/svgelementfactory.js

src/script/render/graphics/svgelementfactory.js: \
	src/script/render/graphics/constants.js

src/script/render/graphics/svgutensils.js: \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/idmanager.js \
	src/script/utl/utensils.js

src/script/render/text/ast2animate.js: \
	src/script/utl/utensils.js

src/script/render/text/ast2dot.js: \
	src/script/render/text/arcmappings.js \
	src/script/render/text/flatten.js \
	src/script/render/text/textutensils.js \
	src/script/utl/utensils.js

src/script/render/text/ast2doxygen.js: \
	src/script/render/text/arcmappings.js \
	src/script/render/text/ast2thing.js \
	src/script/render/text/textutensils.js

src/script/render/text/ast2mscgen.js: \
	src/script/render/text/arcmappings.js \
	src/script/render/text/ast2thing.js \
	src/script/render/text/textutensils.js

src/script/render/text/ast2msgenny.js: \
	src/script/render/text/ast2thing.js

src/script/render/text/ast2thing.js: \
	src/script/render/text/textutensils.js

src/script/render/text/ast2xu.js: \
	src/script/render/text/ast2thing.js \
	src/script/render/text/textutensils.js

src/script/render/text/colorize.js: \
	src/script/render/text/arcmappings.js \
	src/script/render/text/asttransform.js

src/script/render/text/flatten.js: \
	src/script/render/text/arcmappings.js \
	src/script/render/text/asttransform.js \
	src/script/render/text/textutensils.js \
	src/script/utl/utensils.js

src/script/ui/interpreter/animator.js: \
	src/script/render/graphics/renderast.js \
	src/script/render/text/ast2animate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/gaga.js

src/script/ui/interpreter/editor-events.js: \
	src/lib/codemirror/addon/dialog/dialog.js \
	src/lib/codemirror/addon/display/placeholder.js \
	src/lib/codemirror/addon/edit/closebrackets.js \
	src/lib/codemirror/addon/edit/matchbrackets.js \
	src/lib/codemirror/addon/search/search.js \
	src/lib/codemirror/addon/search/searchcursor.js \
	src/lib/codemirror/addon/selection/active-line.js \
	src/lib/codemirror/lib/codemirror.js \
	src/lib/codemirror/mode/javascript/javascript.js \
	src/lib/codemirror/mode/mscgen/mscgen.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js \
	src/script/utl/utensils.js

src/script/ui/interpreter/input-actions.js: \
	src/script/render/text/colorize.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/store.js

src/script/ui/interpreter/nav-actions.js: \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js

src/script/ui/interpreter/output-actions.js: \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/raster-exporter.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js

src/script/ui/interpreter/param-actions.js: \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/paramslikker.js \
	src/script/utl/utensils.js

src/script/ui/interpreter/raster-exporter.js: \
	src/lib/canvg/StackBlur.js \
	src/lib/canvg/canvg.js \
	src/lib/canvg/rgbcolor.js

src/script/ui/interpreter/uistate.js: \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js \
	src/script/render/graphics/renderast.js \
	src/script/render/text/ast2msgenny.js \
	src/script/render/text/ast2xu.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js

src/script/ui/utl/exporter.js: \
	src/script/render/text/ast2dot.js \
	src/script/render/text/ast2doxygen.js \
	src/script/render/text/ast2mscgen.js \
	src/script/ui/utl/paramslikker.js

# cjs dependencies
src/script/cli/actions.js: \
	src/script/parse/xuparser_node.js \
	src/script/render/graphics/renderast.js

src/script/cli/mscgen.js: \
	src/script/cli/actions.js \
	src/script/cli/validations.js

src/script/scriptlets/ast2dot.js: \
	src/script/render/text/ast2dot.js

src/script/scriptlets/ast2doxygen.js: \
	src/script/render/text/ast2doxygen.js

src/script/scriptlets/ast2genny.js: \
	src/script/render/text/ast2msgenny.js

src/script/scriptlets/ast2msc.js: \
	src/script/render/text/ast2mscgen.js

src/script/scriptlets/ast2svg.js: \
	src/script/render/graphics/renderast.js

src/script/scriptlets/ast2svg_nosource.js: \
	src/script/render/graphics/renderast.js

src/script/scriptlets/ast2xu.js: \
	src/script/render/text/ast2xu.js

src/script/scriptlets/genny2ast.js: \
	src/script/parse/msgennyparser_node.js

src/script/scriptlets/genny2dot.js: \
	src/script/parse/msgennyparser_node.js \
	src/script/render/text/ast2dot.js

src/script/scriptlets/genny2msc.js: \
	src/script/parse/msgennyparser_node.js \
	src/script/render/text/ast2mscgen.js

src/script/scriptlets/msc2ast.js: \
	src/script/parse/mscgenparser_node.js

src/script/scriptlets/msc2dot.js: \
	src/script/parse/mscgenparser_node.js \
	src/script/render/text/ast2dot.js

src/script/scriptlets/msc2genny.js: \
	src/script/parse/mscgenparser_node.js \
	src/script/render/text/ast2msgenny.js

src/script/scriptlets/msc2msc.js: \
	src/script/parse/mscgenparser_node.js \
	src/script/render/text/ast2mscgen.js

src/script/scriptlets/xu2ast.js: \
	src/script/parse/xuparser_node.js

src/script/test/parse/t_mscgenparser_node.js: \
	src/script/parse/mscgenparser_node.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/parse/t_msgennyparser_node.js: \
	src/script/parse/msgennyparser_node.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/parse/t_xuparser_node.js: \
	src/script/parse/xuparser_node.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/graphics/t_markermanager.js: \
	src/script/render/graphics/markermanager.js \
	src/script/test/testutensils.js

src/script/test/render/graphics/t_renderast.js: \
	src/script/render/graphics/renderast.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_ast2animate.js: \
	src/script/parse/xuparser_node.js \
	src/script/render/text/ast2animate.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_ast2dot.js: \
	src/script/render/text/ast2dot.js \
	src/script/test/astfixtures.js

src/script/test/render/text/t_ast2doxygen.js: \
	src/script/render/text/ast2doxygen.js \
	src/script/test/astfixtures.js

src/script/test/render/text/t_ast2mscgen.js: \
	src/script/parse/mscgenparser_node.js \
	src/script/render/text/ast2mscgen.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_ast2msgenny.js: \
	src/script/render/text/ast2msgenny.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_ast2xu.js: \
	src/script/parse/xuparser_node.js \
	src/script/render/text/ast2xu.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_colorize.js: \
	src/script/render/text/colorize.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js \
	src/script/utl/utensils.js

src/script/test/render/text/t_flatten.js: \
	src/script/render/text/flatten.js \
	src/script/test/astfixtures.js \
	src/script/test/testutensils.js

src/script/test/render/text/t_textutensils.js: \
	src/script/render/text/textutensils.js

src/script/test/ui/embedding/t_config.js: \
	src/script/test/testutensils.js \
	src/script/ui/embedding/config.js

src/script/test/ui/utl/t_exporter.js: \
	src/script/ui/utl/exporter.js

src/script/test/ui/utl/t_maps.js: \
	src/script/ui/utl/maps.js

src/script/test/ui/utl/t_paramslikker.js: \
	src/script/test/testutensils.js \
	src/script/ui/utl/paramslikker.js

src/script/test/ui/utl/t_store.js: \
	src/script/ui/utl/store.js

src/script/test/utl/t_utensils.js: \
	src/script/utl/utensils.js

# amd dependencies
EMBED_JS_SOURCES=src/script/mscgen-inpage.js \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/entities.js \
	src/script/render/graphics/idmanager.js \
	src/script/render/graphics/markermanager.js \
	src/script/render/graphics/renderast.js \
	src/script/render/graphics/renderlabels.js \
	src/script/render/graphics/renderskeleton.js \
	src/script/render/graphics/renderutensils.js \
	src/script/render/graphics/rowmemory.js \
	src/script/render/graphics/svgelementfactory.js \
	src/script/render/graphics/svgutensils.js \
	src/script/render/text/arcmappings.js \
	src/script/render/text/ast2dot.js \
	src/script/render/text/ast2doxygen.js \
	src/script/render/text/ast2mscgen.js \
	src/script/render/text/ast2thing.js \
	src/script/render/text/asttransform.js \
	src/script/render/text/flatten.js \
	src/script/render/text/textutensils.js \
	src/script/ui/embedding/config.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/paramslikker.js \
	src/script/utl/utensils.js
# amd dependencies
INTERPRETER_JS_SOURCES=src/script/mscgen-interpreter.js \
	src/lib/canvg/StackBlur.js \
	src/lib/canvg/canvg.js \
	src/lib/canvg/rgbcolor.js \
	src/lib/codemirror/addon/dialog/dialog.js \
	src/lib/codemirror/addon/display/placeholder.js \
	src/lib/codemirror/addon/edit/closebrackets.js \
	src/lib/codemirror/addon/edit/matchbrackets.js \
	src/lib/codemirror/addon/search/search.js \
	src/lib/codemirror/addon/search/searchcursor.js \
	src/lib/codemirror/addon/selection/active-line.js \
	src/lib/codemirror/lib/codemirror.js \
	src/lib/codemirror/mode/javascript/javascript.js \
	src/lib/codemirror/mode/mscgen/mscgen.js \
	src/script/parse/msgennyparser.js \
	src/script/parse/xuparser.js \
	src/script/render/graphics/constants.js \
	src/script/render/graphics/entities.js \
	src/script/render/graphics/idmanager.js \
	src/script/render/graphics/markermanager.js \
	src/script/render/graphics/renderast.js \
	src/script/render/graphics/renderlabels.js \
	src/script/render/graphics/renderskeleton.js \
	src/script/render/graphics/renderutensils.js \
	src/script/render/graphics/rowmemory.js \
	src/script/render/graphics/svgelementfactory.js \
	src/script/render/graphics/svgutensils.js \
	src/script/render/text/arcmappings.js \
	src/script/render/text/ast2animate.js \
	src/script/render/text/ast2dot.js \
	src/script/render/text/ast2doxygen.js \
	src/script/render/text/ast2mscgen.js \
	src/script/render/text/ast2msgenny.js \
	src/script/render/text/ast2thing.js \
	src/script/render/text/ast2xu.js \
	src/script/render/text/asttransform.js \
	src/script/render/text/colorize.js \
	src/script/render/text/flatten.js \
	src/script/render/text/textutensils.js \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/editor-events.js \
	src/script/ui/interpreter/input-actions.js \
	src/script/ui/interpreter/nav-actions.js \
	src/script/ui/interpreter/output-actions.js \
	src/script/ui/interpreter/param-actions.js \
	src/script/ui/interpreter/raster-exporter.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js \
	src/script/ui/utl/paramslikker.js \
	src/script/ui/utl/store.js \
	src/script/utl/utensils.js
# cjs dependencies
CLI_JS_SOURCES=src/script/cli/mscgen.js \
	src/script/cli/actions.js \
	src/script/cli/validations.js \
	src/script/parse/xuparser_node.js \
	src/script/render/graphics/renderast.js
