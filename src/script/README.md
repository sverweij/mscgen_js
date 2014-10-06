# Introduction
The description below is meant to make the job of maintaining the 
code base more easy. It attempts to describe what the program does
and 

The main steps to getting a textual description to a picture are 
- _lexical analysis and parsing_, which results in an abstract syntax
  tree
  We're using PEG.js, which smashes these two tasks together
- _rendering_ that abstract syntax tree into a picture.
- Besides these two steps it is useful to have some of 
  _controler_ program that handles interaction with the user. 
  There are two of these in the package:
  - for _embedding_ textual descriptions in html
  - for the interactive _interpreter_


The chapters and paragraphs below describe most (if not all) things
you need to about each of these steps

# Parsing
## Introduction
The parsers for `mscgen`, `msgenny` and `xù` are all
written in pegjs and deliver the abstract syntax tree as a javascript
object.

:page_with_curl: code in [parse/peg](parse/peg)

## Generating the parsers
To create javascript from the .pegjs source usable in node and
commonjs:
```sh
pegjs mscgenparser.pegjs > mscgenparser_node.js
```

To create a parser that is usable in require.js, the line
`module.exports = (function(){` needs to be replaced with 
`define ([], function(){`.  The `commonjs2amd.sh` script in the utl
directory does just that. Usage:
```
commonjs2amd.sh mscgenparser_node.js > mscgenparser.js
```

## The abstract syntax tree
All parsers generate a JSON syntax tree adhering to the same
structure. It is conceptually modeled after the three parts that
make up mscgen programs: options, entities and arcs. We will discuss
each in detail below.

Hint: When you add the parameter debug with value true to the url
of the demo (e.g. like so: http://sverweij.github.io/mscgen_js?debug=true)
the interface gets an extra language called option called "AST".
When - after entering a valid mscgen, msgenny or xù program - you
click it, the editor will show the abstract syntax tree the parser
generated.  If you are brave and/ or have too much time on your
hands you can even edit the syntax tree directly from there.

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
  although mscgen (, msgenny, xù) often support multiple spellings
  of attributes and options and are case insensitive the parser
  outputs only one variant of them in - lowercase (e.g. TEXTcolor,
  textColor and TeXtColOUR all translate to the
    attribute "textcolor")
  - American spelling (e.g. textcolor and textcolour both translate
  to the
    attribute "textcolor")
  - "true" and "false" as values for booleans
- _If it's not in the input, it's not in the output_ -
  The parser does not generate "default values" for objects whose
  pendant was not available in the input.
- The order of attributes within objects is not guaranteed.  - The
order of objects outside of arrays is not guaranteed.  - The order
of objects within an array represents the order in which they are
  present in the source program.
- TODO: describe escape mechanism


### options
```options``` is an object with the options that are possible in
mscgen as attributes.

- If the input program does not have an option, the parser leaves
  the associated attribute out of the syntax tree.
- If the input program does not have any options at all, the parser
  leaves the options object out of the syntax tree altogether.
- Note that in mscgen, msgenny and xù the boolean attribute
```wordwraparcs``` can have
  the values true, 1, on, "true" and "on" for true and false, 0,
  off, "false" and "off" for off. The parser flattens this to "true"
  and "false" respectively so consumers working with the syntax
  tree don't have to worry about

```json
  "options": {
    "arcgradient": "10",
    "hscale": "1.1",
    "width": "700",
    "wordwraparcs": "true"
  }
```

### entities 
```entities``` is an array of anonymous objects, each of which
represents an entity.  Each of these objects is guaranteed to have
a ```name``` attribute. To remain compatible with mscgen this name
is /not necessarily unique/, however.

The list of possible attributes is equal to what is allowed for mscgen:

"id", "url", "idurl", "linecolor", "textcolor", "textbgcolor", "arclinecolor", "arctextcolor", "arctextbgcolor"

- Note that mscgen allows its color attributes to be written in
  either British or American spelling (colour, color). The mscgen,
  msgenny and xù parsers all map them to the American variant for the
  ease of its consumers.  - Shrewd readers will have noticed the
  parser allows "arcskip" as well, while in the context of an entity
  it is meaningless. The reason for its pressence is simply that the
  mscgen and xù parsers use the same list of attributes for entities
  as for arcs.  Consumers are advised to ignore the arcskip attribute
  for entities (the demo code certainly does :-)).

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
```arcs``` is a two dimensional array of arcs. Each array in the
outer array represents an arc _row_ (so the name _arcs_ is kind of
a misnomer - ah well). The inner array consists of anonymous objects
each of which represents an arc. Each arc is guaranteed to have the
_kind_ attribute. Most arcs also have a _from_ and a _to_. 
_from_ and _to_ reference an entity by its _name_. The special value "*"
denotes _all enttities_. 

Other attributes are optional: "url", "id", "idurl", "linecolor", "textcolor", "textbgcolor", "arcskip"

Actually, "arclinecolor", "arctextcolor" and "arctextbgcolor" are
allowed too, but as they have no functional meaning in the context
of an arc consumers are advised to ignore them for arcs.

todo: add recursive structure for xù.

```json
  ...

  "arcs": [
    [
      {
        "kind": "->",
        "from": "a",
        "to": "b",
        "label": "do something"
      }
    ],

    ...
```

In the sample mscgen ```b``` communicates to ```a``` that it is working on
something, while _at the same time_ instructing ```c``` to do something. 
The part of the syntax tree representing that looks like this:

```json
    ...
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
    ...
```

### recursive arcs in xù and msgenny
xù and msgenny both support "inline expressions". An important attribute
of inline expressions is that they can contain other arcs and inline
expressions. 

In the abstract syntax tree an inline expression is an "arc", just 
as they are in xù and msgenny. 

```mscgen
msc {
  a, b;

  a loop b [label="for all things"] {
    a opt b [label="thing is worth its while"]{
      a => b [label="thingify (thing)"];
    };
  };
}
```

```json
{
  "entities": [
    {
      "name": "a"
    },
    {
      "name": "b"
    }
  ],
  "arcs": [
    [
      {
        "kind": "loop",
        "from": "a",
        "to": "b",
        "label": "for all things",
        "arcs": [
          [
            {
              "kind": "opt",
              "from": "a",
              "to": "b",
              "label": "thing is worth its while",
              "arcs": [
                [
                  {
                    "kind": "=>",
                    "from": "a",
                    "to": "b",
                    "label": "thingify (thing)"
                  }
                ]
              ]
            }
          ]
        ]
      }
    ]
  ]
} 
```

# Rendering
## Scalable vector graphics
As the default output format for the pictures we have chosen scalable
vector graphics (svg):
- Vector graphics are an obvious choice for diagramming output
  as it contains mostly lines.
- SVG works out of the box from most modern browsers
- Converting (/ downgrading) vector graphics to raster graphic
  formats (like png, jpeg etc) is always possible. 

## The scalable vector graphics skeleton
:page_with_curl: code in [render/graphics/renderskeleton.js](render/graphics/renderskeleton.js)

We use the following structure for the svg

- `desc```- contains the source code that was used to generate the svg.
   This is practical not only for debugging, but also to reconstruct the
   original program.
- `defs` - "definitions"
    - `style` - which contains the css defining default colors, fonts, 
      line widths etc.
    - a list of `marker`s - one for each of the arrow heads possible
      in sequence charts.
    - a `g`roup containing all elements to be rendered: entities, 
      arcs, inline expressions
- The body `g`roup. This consists of 5 groups, each of which
  represents a layer. The layers themselves contain nothing else than
  a reference (`use` s) to the groups defined in `defs/g`,
  unless noted differently. The body also contains the translation
  of the `hscale` and `width` options by way of a `transform`
  attribute
    - background (a white rectangle the size of the diagram. Put in
      directly, not by reference)
    - arcspan (if there are any inline expressions they get rendered here)
    - lifeline (the vertical lines)
    - sequence (contains the entities, all arcs that are not boxes and 
      accompanying text)
    - note (contains all arcs that are boxes (box, abox, rbox and _note_)
    - watermark (contra-intuitively, the easiest way to render a
      watermark in an svg is to put it on top. The watermark is put
      in this layer directly and not by reference)
    

TODO. Subjects to be covered:
- renderast/ utensiles (:page_with_curl: code in [render/graphics/renderast.js](render/graphics/renderast.js) and [render/graphics/renderutensils.js](render/graphics/renderutensils.js) )
- flattening (:page_with_curl: code in [render/text/flatten.js](render/text/flatten.js))
- text wrapping (html vs text/tspans) (:page_with_curl: code in [render/text/textutensils.js](render/text/textutensils.js))
  & BBox (in [render/graphics/renderutensils.js](render/graphics/renderutensils.js) iircc)

## Other script languages
:page_with_curl: code in [render\text\](render\text\)
Besides to render pictures from an abstract syntax tree, the code contains
programs that render the asbtract syntax tree to text. 

- Explain the ast2thing thing
- Mapping 
TODO mscgen, msgenny, xu, dot

## Colorize
:page_with_curl: code in [render\text\colorize.js](render\text\colorize.js)

# The controllers
## embedding
:page_with_curl: code in [ui-control/controller-inpage.js](gui-control/controller-inpage.js)
TODO
- building the thing (almond to get everything in one .js)
- explain how it works (rather trivial: run through all elements, 
  filter those with the mscgen_js class out and attempt to parse & 
  render what is in between the tags)
- explain the ```defer``` thing (if you don't defer loading, the js
  will start to run before the browser has completed the dom tree -
  especially visible with large html like the tutorial)

## interactive interpreter
:page_with_curl: code in [ui-control/controller-interpreter.js](ui-control/controller-interpreter.js)
- code mirror stuff
- rendering in real time: the straight on approach just works ...
- rendering raster graphics: canvas & canvg

