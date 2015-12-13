
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/script/interpreter/animator.js: \
	src/script/lib/mscgenjs-core/render/graphics/renderast.js \
	src/script/lib/mscgenjs-core/render/text/ast2animate.js \
	src/script/utl/domutl.js \
	src/script/utl/gaga.js

src/script/interpreter/editor-events.js: \
	src/script/interpreter/uistate.js \
	src/script/lib/codemirror/addon/dialog/dialog.js \
	src/script/lib/codemirror/addon/display/placeholder.js \
	src/script/lib/codemirror/addon/edit/closebrackets.js \
	src/script/lib/codemirror/addon/edit/matchbrackets.js \
	src/script/lib/codemirror/addon/search/search.js \
	src/script/lib/codemirror/addon/search/searchcursor.js \
	src/script/lib/codemirror/addon/selection/active-line.js \
	src/script/lib/codemirror/lib/codemirror.js \
	src/script/lib/codemirror/mode/javascript/javascript.js \
	src/script/lib/codemirror/mode/mscgen/mscgen.js \
	src/script/utl/gaga.js \
	src/script/utl/maps.js

src/script/interpreter/general-actions.js: \
	src/script/interpreter/animator.js \
	src/script/utl/domutl.js

src/script/interpreter/input-actions.js: \
	src/script/interpreter/general-actions.js \
	src/script/interpreter/uistate.js \
	src/script/lib/mscgenjs-core/render/text/colorize.js \
	src/script/utl/gaga.js \
	src/script/utl/store.js

src/script/interpreter/nav-actions.js: \
	src/script/interpreter/animator.js \
	src/script/interpreter/general-actions.js \
	src/script/interpreter/uistate.js \
	src/script/utl/domutl.js \
	src/script/utl/exporter.js \
	src/script/utl/gaga.js

src/script/interpreter/output-actions.js: \
	src/script/interpreter/animator.js \
	src/script/interpreter/general-actions.js \
	src/script/interpreter/raster-exporter.js \
	src/script/interpreter/uistate.js \
	src/script/lib/mscgenjs-core/render/graphics/svgutensils.js \
	src/script/utl/exporter.js \
	src/script/utl/gaga.js

src/script/interpreter/param-actions.js: \
	src/script/interpreter/uistate.js \
	src/script/utl/domutl.js \
	src/script/utl/gaga.js \
	src/script/utl/maps.js \
	src/script/utl/paramslikker.js

src/script/interpreter/raster-exporter.js: \
	src/script/lib/canvg/StackBlur.js \
	src/script/lib/canvg/canvg.js \
	src/script/lib/canvg/rgbcolor.js

src/script/interpreter/uistate.js: \
	src/script/lib/mscgenjs-core/parse/msgennyparser.js \
	src/script/lib/mscgenjs-core/parse/xuparser.js \
	src/script/lib/mscgenjs-core/render/graphics/renderast.js \
	src/script/lib/mscgenjs-core/render/text/ast2msgenny.js \
	src/script/lib/mscgenjs-core/render/text/ast2xu.js \
	src/script/utl/domutl.js \
	src/script/utl/exporter.js \
	src/script/utl/gaga.js \
	src/script/utl/maps.js

src/script/lib/codemirror/addon/dialog/dialog.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/display/placeholder.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/edit/closebrackets.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/edit/matchbrackets.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/search/search.js: \
	src/script/lib/codemirror/addon/dialog/dialog.js \
	src/script/lib/codemirror/addon/search/searchcursor.js \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/search/searchcursor.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/selection/active-line.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/mode/javascript/javascript.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/mode/mscgen/mscgen.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/mscgenjs-core/render/graphics/entities.js: \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/renderlabels.js

src/script/lib/mscgenjs-core/render/graphics/markermanager.js: \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js

src/script/lib/mscgenjs-core/render/graphics/renderast.js: \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/entities.js \
	src/script/lib/mscgenjs-core/render/graphics/idmanager.js \
	src/script/lib/mscgenjs-core/render/graphics/markermanager.js \
	src/script/lib/mscgenjs-core/render/graphics/renderlabels.js \
	src/script/lib/mscgenjs-core/render/graphics/renderskeleton.js \
	src/script/lib/mscgenjs-core/render/graphics/renderutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/rowmemory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/swap.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/flatten.js

src/script/lib/mscgenjs-core/render/graphics/renderlabels.js: \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgutensils.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/graphics/renderskeleton.js: \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js

src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js: \
	src/script/lib/mscgenjs-core/render/graphics/constants.js

src/script/lib/mscgenjs-core/render/graphics/svgutensils.js: \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/idmanager.js

src/script/lib/mscgenjs-core/render/text/ast2animate.js: \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js

src/script/lib/mscgenjs-core/render/text/ast2dot.js: \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/flatten.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/text/ast2doxygen.js: \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/text/ast2mscgen.js: \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/text/ast2msgenny.js: \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js

src/script/lib/mscgenjs-core/render/text/ast2thing.js: \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/text/ast2xu.js: \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/lib/mscgenjs-core/render/text/colorize.js: \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/asttransform.js

src/script/lib/mscgenjs-core/render/text/flatten.js: \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/asttransform.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js

src/script/mscgen-inpage.js: \
	src/script/embedding/config.js \
	src/script/embedding/error-rendering.js \
	src/script/lib/mscgenjs-core/parse/msgennyparser.js \
	src/script/lib/mscgenjs-core/parse/xuparser.js \
	src/script/lib/mscgenjs-core/render/graphics/renderast.js \
	src/script/utl/domutl.js \
	src/script/utl/exporter.js

src/script/mscgen-interpreter.js: \
	src/script/interpreter/editor-events.js \
	src/script/interpreter/general-actions.js \
	src/script/interpreter/input-actions.js \
	src/script/interpreter/nav-actions.js \
	src/script/interpreter/output-actions.js \
	src/script/interpreter/param-actions.js

src/script/utl/exporter.js: \
	src/script/lib/mscgenjs-core/render/text/ast2dot.js \
	src/script/lib/mscgenjs-core/render/text/ast2doxygen.js \
	src/script/lib/mscgenjs-core/render/text/ast2mscgen.js \
	src/script/utl/paramslikker.js

# cjs dependencies
src/script/lib/codemirror/addon/dialog/dialog.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/display/placeholder.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/edit/closebrackets.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/edit/matchbrackets.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/search/search.js: \
	src/script/lib/codemirror/addon/dialog/dialog.js \
	src/script/lib/codemirror/addon/search/searchcursor.js \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/search/searchcursor.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/addon/selection/active-line.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/mode/javascript/javascript.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/lib/codemirror/mode/mscgen/mscgen.js: \
	src/script/lib/codemirror/lib/codemirror.js

src/script/test/embedding/t_config.js: \
	src/script/embedding/config.js

src/script/test/embedding/t_error-rendering.js: \
	src/script/embedding/error-rendering.js

src/script/test/utl/t_exporter.js: \
	src/script/utl/exporter.js

src/script/test/utl/t_maps.js: \
	src/script/utl/maps.js

src/script/test/utl/t_paramslikker.js: \
	src/script/utl/paramslikker.js

src/script/test/utl/t_store.js: \
	src/script/utl/store.js

# amd dependencies
EMBED_JS_SOURCES=src/script/mscgen-inpage.js \
	src/script/embedding/config.js \
	src/script/embedding/error-rendering.js \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/parse/msgennyparser.js \
	src/script/lib/mscgenjs-core/parse/xuparser.js \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/entities.js \
	src/script/lib/mscgenjs-core/render/graphics/idmanager.js \
	src/script/lib/mscgenjs-core/render/graphics/markermanager.js \
	src/script/lib/mscgenjs-core/render/graphics/renderast.js \
	src/script/lib/mscgenjs-core/render/graphics/renderlabels.js \
	src/script/lib/mscgenjs-core/render/graphics/renderskeleton.js \
	src/script/lib/mscgenjs-core/render/graphics/renderutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/rowmemory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/swap.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/ast2dot.js \
	src/script/lib/mscgenjs-core/render/text/ast2doxygen.js \
	src/script/lib/mscgenjs-core/render/text/ast2mscgen.js \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js \
	src/script/lib/mscgenjs-core/render/text/asttransform.js \
	src/script/lib/mscgenjs-core/render/text/flatten.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js \
	src/script/utl/domutl.js \
	src/script/utl/exporter.js \
	src/script/utl/paramslikker.js
# amd dependencies
INTERPRETER_JS_SOURCES=src/script/mscgen-interpreter.js \
	src/script/interpreter/animator.js \
	src/script/interpreter/editor-events.js \
	src/script/interpreter/general-actions.js \
	src/script/interpreter/input-actions.js \
	src/script/interpreter/nav-actions.js \
	src/script/interpreter/output-actions.js \
	src/script/interpreter/param-actions.js \
	src/script/interpreter/raster-exporter.js \
	src/script/interpreter/uistate.js \
	src/script/lib/canvg/StackBlur.js \
	src/script/lib/canvg/canvg.js \
	src/script/lib/canvg/rgbcolor.js \
	src/script/lib/codemirror/addon/dialog/dialog.js \
	src/script/lib/codemirror/addon/display/placeholder.js \
	src/script/lib/codemirror/addon/edit/closebrackets.js \
	src/script/lib/codemirror/addon/edit/matchbrackets.js \
	src/script/lib/codemirror/addon/search/search.js \
	src/script/lib/codemirror/addon/search/searchcursor.js \
	src/script/lib/codemirror/addon/selection/active-line.js \
	src/script/lib/codemirror/lib/codemirror.js \
	src/script/lib/codemirror/mode/javascript/javascript.js \
	src/script/lib/codemirror/mode/mscgen/mscgen.js \
	src/script/lib/mscgenjs-core/lib/lodash/lodash.custom.js \
	src/script/lib/mscgenjs-core/parse/msgennyparser.js \
	src/script/lib/mscgenjs-core/parse/xuparser.js \
	src/script/lib/mscgenjs-core/render/graphics/constants.js \
	src/script/lib/mscgenjs-core/render/graphics/entities.js \
	src/script/lib/mscgenjs-core/render/graphics/idmanager.js \
	src/script/lib/mscgenjs-core/render/graphics/markermanager.js \
	src/script/lib/mscgenjs-core/render/graphics/renderast.js \
	src/script/lib/mscgenjs-core/render/graphics/renderlabels.js \
	src/script/lib/mscgenjs-core/render/graphics/renderskeleton.js \
	src/script/lib/mscgenjs-core/render/graphics/renderutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/rowmemory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgelementfactory.js \
	src/script/lib/mscgenjs-core/render/graphics/svgutensils.js \
	src/script/lib/mscgenjs-core/render/graphics/swap.js \
	src/script/lib/mscgenjs-core/render/text/arcmappings.js \
	src/script/lib/mscgenjs-core/render/text/ast2animate.js \
	src/script/lib/mscgenjs-core/render/text/ast2dot.js \
	src/script/lib/mscgenjs-core/render/text/ast2doxygen.js \
	src/script/lib/mscgenjs-core/render/text/ast2mscgen.js \
	src/script/lib/mscgenjs-core/render/text/ast2msgenny.js \
	src/script/lib/mscgenjs-core/render/text/ast2thing.js \
	src/script/lib/mscgenjs-core/render/text/ast2xu.js \
	src/script/lib/mscgenjs-core/render/text/asttransform.js \
	src/script/lib/mscgenjs-core/render/text/colorize.js \
	src/script/lib/mscgenjs-core/render/text/flatten.js \
	src/script/lib/mscgenjs-core/render/text/textutensils.js \
	src/script/utl/domutl.js \
	src/script/utl/exporter.js \
	src/script/utl/gaga.js \
	src/script/utl/maps.js \
	src/script/utl/paramslikker.js \
	src/script/utl/store.js
