
# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# cjs dependencies
src/actions.js: \
	../core/index.js

src/mscgen.js: \
	src/actions.js \
	src/normalizations.js \
	src/validations.js

# cjs dependencies
CLI_JS_SOURCES=src/mscgen.js \
	../core/index.js \
	src/actions.js \
	src/normalizations.js \
	src/validations.js
