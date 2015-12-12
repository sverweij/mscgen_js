# Rendering text: other script languages

To be able to switch between the languages mscgen_js supports, the code contains
functions to convert abstract syntax trees back to text and some snazzy
modules to manipulate syntax trees.


## Language rendering: ast2thing
The modules that (re-)render language code from abstract syntax trees
have a _lot_ in common. So much, that most individual language can be
expressed as a configuration on one processing module. That module is [ast2thing.js](ast2thing.js). 

There are probably more elegant solutions (templating?) - however, 
this one is good enough&trade; and works.

Individual modules using ast2thing:
- [ast2mscgen](ast2mscgen)
- [ast2msgenny](ast2msgenny)
- [ast2xu](ast2xu)

## Animation
:page_with_curl: code in [ast2animate.js](ast2animate.js)

## Flattening
To ease rendering the [flatten.js](flatten.js) module massages the
syntax tree in several ways:
- makes sure each entity has a 'label' attribute
- distributes teh arc*colors from entities to the appropriate lines and arcs
- make sure arcs point from left to right
- takes care of 'unwinding' nested inline expressions
- makes individual arcs of broadcast arcs

:page_with_curl: code in [flatten.js](flatten.js)

## Coloring
:page_with_curl: code in [colorize.js](colorize.js)

## Utensils
:page_with_curl: code in [textutensils.js](textutensils.js)

## dot
Each sequence chart can be expressed as a communications diagram.
GraphViz dot is a textual language that can be used to specify
communications diagrams. ast2dot transforms an abstract syntax
tree into a dot program.

:page_with_curl: code in [ast2dot.js](ast2dot.js)
