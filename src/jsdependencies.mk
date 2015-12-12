
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/script/core/indexAMD.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/parse/msgennyparser.js \
	src/script/core/parse/xuparser.js \
	src/script/core/render/graphics/renderast.js \
	src/script/core/render/text/ast2dot.js \
	src/script/core/render/text/ast2doxygen.js \
	src/script/core/render/text/ast2mscgen.js \
	src/script/core/render/text/ast2msgenny.js \
	src/script/core/render/text/ast2xu.js

src/script/core/render/graphics/entities.js: \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/renderlabels.js

src/script/core/render/graphics/markermanager.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/text/arcmappings.js

src/script/core/render/graphics/renderast.js: \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/entities.js \
	src/script/core/render/graphics/idmanager.js \
	src/script/core/render/graphics/markermanager.js \
	src/script/core/render/graphics/renderlabels.js \
	src/script/core/render/graphics/renderskeleton.js \
	src/script/core/render/graphics/renderutensils.js \
	src/script/core/render/graphics/rowmemory.js \
	src/script/core/render/graphics/svgelementfactory.js \
	src/script/core/render/graphics/svgutensils.js \
	src/script/core/render/graphics/swap.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/flatten.js

src/script/core/render/graphics/renderlabels.js: \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/svgelementfactory.js \
	src/script/core/render/graphics/svgutensils.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/textutensils.js

src/script/core/render/graphics/renderskeleton.js: \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/svgelementfactory.js

src/script/core/render/graphics/svgelementfactory.js: \
	src/script/core/render/graphics/constants.js

src/script/core/render/graphics/svgutensils.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/idmanager.js

src/script/core/render/text/ast2animate.js: \
	src/script/core/lib/lodash/lodash.custom.js

src/script/core/render/text/ast2dot.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/flatten.js \
	src/script/core/render/text/textutensils.js

src/script/core/render/text/ast2doxygen.js: \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/ast2thing.js \
	src/script/core/render/text/textutensils.js

src/script/core/render/text/ast2mscgen.js: \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/ast2thing.js \
	src/script/core/render/text/textutensils.js

src/script/core/render/text/ast2msgenny.js: \
	src/script/core/render/text/ast2thing.js

src/script/core/render/text/ast2thing.js: \
	src/script/core/render/text/textutensils.js

src/script/core/render/text/ast2xu.js: \
	src/script/core/render/text/ast2thing.js \
	src/script/core/render/text/textutensils.js

src/script/core/render/text/colorize.js: \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/asttransform.js

src/script/core/render/text/flatten.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/asttransform.js \
	src/script/core/render/text/textutensils.js

src/script/mscgen-inpage.js: \
	src/script/core/parse/msgennyparser.js \
	src/script/core/parse/xuparser.js \
	src/script/core/render/graphics/renderast.js \
	src/script/ui/embedding/config.js \
	src/script/ui/embedding/error-rendering.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js

src/script/mscgen-interpreter.js: \
	src/script/ui/interpreter/editor-events.js \
	src/script/ui/interpreter/general-actions.js \
	src/script/ui/interpreter/input-actions.js \
	src/script/ui/interpreter/nav-actions.js \
	src/script/ui/interpreter/output-actions.js \
	src/script/ui/interpreter/param-actions.js

src/script/ui/interpreter/animator.js: \
	src/script/core/render/graphics/renderast.js \
	src/script/core/render/text/ast2animate.js \
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
	src/script/ui/utl/maps.js

src/script/ui/interpreter/general-actions.js: \
	src/script/ui/interpreter/animator.js \
	src/script/ui/utl/domutl.js

src/script/ui/interpreter/input-actions.js: \
	src/script/core/render/text/colorize.js \
	src/script/ui/interpreter/general-actions.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/store.js

src/script/ui/interpreter/nav-actions.js: \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/general-actions.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js

src/script/ui/interpreter/output-actions.js: \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/general-actions.js \
	src/script/ui/interpreter/raster-exporter.js \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js

src/script/ui/interpreter/param-actions.js: \
	src/script/ui/interpreter/uistate.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js \
	src/script/ui/utl/paramslikker.js

src/script/ui/interpreter/raster-exporter.js: \
	src/lib/canvg/StackBlur.js \
	src/lib/canvg/canvg.js \
	src/lib/canvg/rgbcolor.js

src/script/ui/interpreter/uistate.js: \
	src/script/core/parse/msgennyparser.js \
	src/script/core/parse/xuparser.js \
	src/script/core/render/graphics/renderast.js \
	src/script/core/render/text/ast2msgenny.js \
	src/script/core/render/text/ast2xu.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js

src/script/ui/utl/exporter.js: \
	src/script/core/render/text/ast2dot.js \
	src/script/core/render/text/ast2doxygen.js \
	src/script/core/render/text/ast2mscgen.js \
	src/script/ui/utl/paramslikker.js

# cjs dependencies
src/script/cli/actions.js: \
	src/script/core/index.js

src/script/cli/mscgen.js: \
	src/script/cli/actions.js \
	src/script/cli/normalizations.js \
	src/script/cli/validations.js

src/script/cli/test/t_actions.js: \
	src/script/cli/actions.js \
	src/script/cli/test/testutensils.js

src/script/cli/test/t_normalizations.js: \
	src/script/cli/normalizations.js \
	src/script/core/lib/lodash/lodash.custom.js

src/script/cli/test/t_validations.js: \
	src/script/cli/validations.js

src/script/core/index.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/graphics/renderast.js

src/script/core/test/parse/t_mscgenparser_node.js: \
	src/script/core/parse/mscgenparser_node.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/core/test/parse/t_msgennyparser_node.js: \
	src/script/core/parse/msgennyparser_node.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/core/test/parse/t_xuparser_node.js: \
	src/script/core/parse/xuparser_node.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/core/test/render/graphics/t_markermanager.js: \
	src/script/core/render/graphics/markermanager.js

src/script/core/test/render/graphics/t_renderast.js: \
	src/script/core/render/graphics/renderast.js \
	src/script/core/test/testutensils.js

src/script/core/test/render/text/t_ast2animate.js: \
	src/script/core/parse/xuparser_node.js \
	src/script/core/render/text/ast2animate.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/core/test/render/text/t_ast2dot.js: \
	src/script/core/render/text/ast2dot.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_ast2doxygen.js: \
	src/script/core/render/text/ast2doxygen.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_ast2mscgen.js: \
	src/script/core/parse/mscgenparser_node.js \
	src/script/core/render/text/ast2mscgen.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_ast2msgenny.js: \
	src/script/core/render/text/ast2msgenny.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/core/test/render/text/t_ast2xu.js: \
	src/script/core/parse/xuparser_node.js \
	src/script/core/render/text/ast2xu.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_colorize.js: \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/render/text/colorize.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_flatten.js: \
	src/script/core/render/text/flatten.js \
	src/script/core/test/astfixtures.js

src/script/core/test/render/text/t_textutensils.js: \
	src/script/core/render/text/textutensils.js

src/script/core/test/t_index.js: \
	src/script/core/index.js \
	src/script/core/test/astfixtures.js \
	src/script/core/test/testutensils.js

src/script/ui/test/embedding/t_config.js: \
	src/script/ui/embedding/config.js

src/script/ui/test/embedding/t_error-rendering.js: \
	src/script/ui/embedding/error-rendering.js

src/script/ui/test/utl/t_exporter.js: \
	src/script/ui/utl/exporter.js

src/script/ui/test/utl/t_maps.js: \
	src/script/ui/utl/maps.js

src/script/ui/test/utl/t_paramslikker.js: \
	src/script/ui/utl/paramslikker.js

src/script/ui/test/utl/t_store.js: \
	src/script/ui/utl/store.js

# amd dependencies
EMBED_JS_SOURCES=src/script/mscgen-inpage.js \
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/parse/msgennyparser.js \
	src/script/core/parse/xuparser.js \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/entities.js \
	src/script/core/render/graphics/idmanager.js \
	src/script/core/render/graphics/markermanager.js \
	src/script/core/render/graphics/renderast.js \
	src/script/core/render/graphics/renderlabels.js \
	src/script/core/render/graphics/renderskeleton.js \
	src/script/core/render/graphics/renderutensils.js \
	src/script/core/render/graphics/rowmemory.js \
	src/script/core/render/graphics/svgelementfactory.js \
	src/script/core/render/graphics/svgutensils.js \
	src/script/core/render/graphics/swap.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/ast2dot.js \
	src/script/core/render/text/ast2doxygen.js \
	src/script/core/render/text/ast2mscgen.js \
	src/script/core/render/text/ast2thing.js \
	src/script/core/render/text/asttransform.js \
	src/script/core/render/text/flatten.js \
	src/script/core/render/text/textutensils.js \
	src/script/ui/embedding/config.js \
	src/script/ui/embedding/error-rendering.js \
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/paramslikker.js
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
	src/script/core/lib/lodash/lodash.custom.js \
	src/script/core/parse/msgennyparser.js \
	src/script/core/parse/xuparser.js \
	src/script/core/render/graphics/constants.js \
	src/script/core/render/graphics/entities.js \
	src/script/core/render/graphics/idmanager.js \
	src/script/core/render/graphics/markermanager.js \
	src/script/core/render/graphics/renderast.js \
	src/script/core/render/graphics/renderlabels.js \
	src/script/core/render/graphics/renderskeleton.js \
	src/script/core/render/graphics/renderutensils.js \
	src/script/core/render/graphics/rowmemory.js \
	src/script/core/render/graphics/svgelementfactory.js \
	src/script/core/render/graphics/svgutensils.js \
	src/script/core/render/graphics/swap.js \
	src/script/core/render/text/arcmappings.js \
	src/script/core/render/text/ast2animate.js \
	src/script/core/render/text/ast2dot.js \
	src/script/core/render/text/ast2doxygen.js \
	src/script/core/render/text/ast2mscgen.js \
	src/script/core/render/text/ast2msgenny.js \
	src/script/core/render/text/ast2thing.js \
	src/script/core/render/text/ast2xu.js \
	src/script/core/render/text/asttransform.js \
	src/script/core/render/text/colorize.js \
	src/script/core/render/text/flatten.js \
	src/script/core/render/text/textutensils.js \
	src/script/ui/interpreter/animator.js \
	src/script/ui/interpreter/editor-events.js \
	src/script/ui/interpreter/general-actions.js \
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
	src/script/ui/utl/store.js
# cjs dependencies
CLI_JS_SOURCES=src/script/cli/mscgen.js \
	src/script/cli/actions.js \
	src/script/cli/normalizations.js \
	src/script/cli/validations.js \
	src/script/core/index.js
