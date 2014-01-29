# Introduction
mscgen_js 


# Parsing
## Introduction
The parsers for ```mscgen```, ```msgenny``` and ```xù``` are all written in pegjs and
deliver the abstract syntax tree as a javascript object.

## Generating the parsers
To create javascript from the .pegjs source usable in node and commonjs:
```
pegjs mscgenparser.pegjs > mscgenparser_node.js
```

To create a parser that is usable in require.js, the line 
```module.exports = (function(){```needs to be replaced with ```define ([], function(){```. 
The ```commonjs2amd.sh``` script in the utl directory does just that. Usage:
```
commonjs2amd.sh mscgenparser_node.js > mscgenparser.js
```

## The abstract syntax tree
All parsers generate a JSON syntax tree adhering to the same structure. It is conceptually modeled
after the three parts that make up mscgen programs: options, entities and arcs. We will discuss each
in detail below. 

Hint: When you add the parameter debug with value true to the url of the demo (e.g. like so: http://sverweij.github.io/mscgen_js?debug=true) the interface gets an extra language
called option called "AST". When - after entering a valid mscgen, msgenny or xù program - 
you click it, the editor will show the abstract syntax tree the parser generated. 
If you are brave and/ or have too much time on your hands you can even edit 
the syntax tree directly from there.

In the explanation we will use this mscgen program as a reference.
```mscgen
msc {
  hscale="1.1",
  width="700",
  arcgradient="10",
  wordwraparcs="true";

  a [label="Entity A", textcolor="white", textbgcolor="red"],
  b [label="Entity B", textbgcolor="yellow"],
  c [label="Entity C", textcolor="yellow", textbgcolor="blue"];

  a -> b [label="do something"];
  b >> a [label="working on it"],  b => c [label="do something"]; # parallel call
  c >> b [label="done; results"];
  b >> a [label="done"];
}
```

### general conventions
- _Be liberal in what you receive and strict in what you send_ - 
  although mscgen (, msgenny, xù) often support multiple spellings of attributes
  and options and are case insensitive the parser outputs only one variant of them in
  - lowercase (e.g. TEXTcolor, textColor and TeXtColOUR all translate to the
    attribute "textcolor")
  - American spelling (e.g. textcolor and textcolour both translate to the 
    attribute "textcolor")
  - "true" and "false" as values for booleans
- _If it's not in the input, it's not in the output_ - 
  The parser does not generate "default values" for objects whose pendant
  was not available in the input.
- The order of attributes within objects is not guaranteed.
- The order of objects outside of arrays is not guaranteed.
- The order of objects within an array represents the order in which they are
  present in the source program. 
- TODO: describe escape mechanism


### options
```options``` is an object with the options that are possible in mscgen as attributes. 

- If the input program does not have an option, the parser leaves the associated
  attribute out of the syntax tree.
- If the input program does not have any options at all, the parser leaves the options 
  object out of the syntax tree altogether.
- Note that in mscgen, msgenny and xù the boolean attribute ```wordwraparcs``` can have
  the values true, 1, on, "true" and "on" for true and false, 0, off, "false" and "off" 
  for off. The parser flattens this to "true" and "false" respectively so consumers working
  with the syntax tree don't have to worry about 

```json
  "options": {
    "arcgradient": "10",
    "hscale": "1.1",
    "width": "700",
    "wordwraparcs": "true"
  }
```

### entities 
```entities``` is an array of anonymous objects, each of which represents an entity. 
Each of these objects is guaranteed to have a ```name``` attribute. To remain compatible
with mscgen this name is /not necessarily unique/, however. 

The list of possible attributes is equal to what is allowed for mscgen:

"id", "url", "idurl", "linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"

- Note that mscgen allows its color attributes to be written in either British or
American spelling (colour, color). The mscgen, msgenny and xù parsers all map them 
to the American variant for the ease of its consumers.
- Shrewd readers will have noticed the parser allows "arcskip" as well, while in the context of an entity it
  is meaningless. The reason for its pressence is simply that the mscgen and xù parsers use the 
  same list of attributes for entities as for arcs.
  Consumers are advised to ignore the arcskip attribute for entities 
  (the demo code certainly does :-)).

```json
"entities": [
    {
      "name": "a",
      "label": "Entity A",
      "textbgcolor": "red",
      "textcolor": "white"
    },
    {
      "name": "b",
      "label": "Entity B",
      "textbgcolor": "yellow"
    },
    {
      "name": "c",
      "label": "Entity C",
      "textbgcolor": "blue",
      "textcolor": "yellow"
    }
  ]
```

### arcs 
```arcs``` is a two dimensional array of arcs. Each array in the outer array represents an 
arc _row_ (so the name _arcs_ is kind of a misnomer - ah well). The inner array consists
of anonymous objects each of which represents an arc. Each arc is guaranteed to have
- kind
- from (either referencing a specific entity or all of them with the special value "*"
- to

Other attributes are optional: "url", "id", "idurl", "linecolor", "textcolor", "textbgcolor", "arcskip"

Actually, "arclinecolor", "arctextcolor" and "arctextbgcolor" are allowed too, but as they
have no functional meaning in the context of an arc consumers are advised to ignore them for 
arcs.

todo: add recursive structure for xù.

```json
  "arcs": [
    [
      {
        "kind": "->",
        "from": "a",
        "to": "b",
        "label": "do something"
      }
    ],
    [
      {
        "kind": ">>",
        "from": "b",
        "to": "a",
        "label": "working on it"
      },
      {
        "kind": "=>",
        "from": "b",
        "to": "c",
        "label": "do something"
      }
    ],
    [
      {
        "kind": ">>",
        "from": "c",
        "to": "b",
        "label": "done; results"
      }
    ],
    [
      {
        "kind": ">>",
        "from": "b",
        "to": "a",
        "label": "done"
      }
    ]
  ]
```

# Rendering
## Scalable vector graphics
TODO. Subjects to be covered:
- renderast/ utensiles
- skeleton / structure of the svg
- flattening
- text wrapping & BBox

## Other script languages
TODO mscgen, msgenny, xu, dot
