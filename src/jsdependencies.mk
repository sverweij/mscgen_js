
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# amd dependencies
src/script/mscgen-inpage.js: \
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
	src/script/ui/utl/domutl.js \
	src/script/ui/utl/exporter.js \
	src/script/ui/utl/gaga.js \
	src/script/ui/utl/maps.js

src/script/ui/utl/exporter.js: \
	src/script/ui/utl/paramslikker.js

# cjs dependencies
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
