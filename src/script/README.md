# Introduction
The description below is meant to make the job of maintaining the
code base more easy. It attempts to describe how the program does
what it does and it tries to explain some of the choices we've made.

The main steps mscgen_js takes to get from a textual description to
a picture are:
- [_lexical analysis and parsing_](#parsing), which results in an abstract syntax
  tree.
  We're using PEG.js, which smashes these two tasks together.
- [_rendering_](#rendering) that abstract syntax tree into a picture.
- Besides these two steps it is useful to have some of
  [_controler_](#the-controllers) program that handles interaction with the user.
  There are two of these in the package:
  - for [_embedding_](#embedding) textual descriptions in html
  - for the interactive [_interpreter_](#interactive-interpreter)


The sections below describe most (if not all) things
you need to about each of these steps.

# Parsing
:page_with_curl: code in [parse/peg](parse/peg)

## Introduction
The parsers for `mscgen`, `msgenny` and `xù` are written in
pegjs and deliver the abstract syntax tree as a javascript
object. In this section we describe
* [how to generate the parsers from pegjs](#generating-the-parsers)
* [the structure of and principles behind the abstract syntax trees](#the-abstract-syntax-tree)


## Generating the parsers
To create javascript from the .pegjs source usable in node and
commonjs:
```bash
pegjs mscgenparser.pegjs > mscgenparser_node.js
```

To create a parser that is usable in require.js, the line
`module.exports = (function(){` in the generated parser
needs to be replaced with  `define ([], function(){`.  The
`commonjs2amd.sh` script in the utl directory does just that.
Usage:
```bash
commonjs2amd.sh mscgenparser_node.js > mscgenparser.js
```

## The abstract syntax tree
All parsers generate a JSON syntax tree that adheres to the same
structure. It is conceptually modeled after the three parts that
make up mscgen programs: options, entities and arcs. We will discuss
each in detail below.

Hint: When you add the parameter debug with value true to the url
of the demo (e.g. like so: https://sverweij.github.io/mscgen_js?debug=true)
the interface gets an extra language option called "AST".
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
`options` is an object with the options that are possible in
mscgen as attributes.

- If the input program does not have an option, the parser leaves
  the associated attribute out of the syntax tree.
- If the input program does not have any options at all, the parser
  leaves the options object out of the syntax tree altogether.
- Note that in mscgen, msgenny and xù the boolean attribute
`wordwraparcs` can have
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
`entities` is an array of anonymous objects, each of which
represents an entity.  Each of these objects is guaranteed to have
a `name` attribute. To remain compatible with mscgen this name
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
`arcs` is a two dimensional array of arcs. Each array in the
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

In the sample mscgen `b` communicates to `a` that it is working on
something, while _at the same time_ instructing `c` to do something.
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
## Introduction
In this section we motivate our choice for
[scalable vector graphics](#scalable-vector-graphics), desribe how
our template or [skeleton](#the-scalable-vector-graphics-skeleton) looks and
explain how the rendering functions fill it.

Mscgen_js not only renders to graphics, but also to other languages.
We describe how this works in
[Rendering text: other script languages](#rendering-text-other-script-languages).

## Scalable vector graphics
As the default output format for the pictures we have chosen scalable
vector graphics (SVG):
- Vector graphics are an obvious choice for drawing sequence charts - it's mostly lines
- SVG works out of the box in most modern browsers
- Converting (/ downgrading) vector graphics to raster graphic
  formats (like png, jpeg etc) is doable (see below). The other way 'round is
  difficult.

## The scalable vector graphics skeleton
:page_with_curl: code in [render/graphics/renderskeleton.js](render/graphics/renderskeleton.js)

We use the following structure for the svg

- `desc` - contains the source code that was used to generate the svg.
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
  attribute. The layers from bottom to top:
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

## Rendering text: other script languages
:page_with_curl: code in [render/text/](render/text)

To be able to switch between the languages mscgen_js supports, the code contains
functions to convert abstract syntax trees back to text.

TODO:
- Explain the ast2thing thing
- Mapping
- mscgen, msgenny, xu, dot (, ...)

## Colorize
:page_with_curl: code in [render/text/colorize.js](render/text/colorize.js)

# The controllers
## embedding
:page_with_curl: code in [ui-control/controller-inpage.js](gui-control/controller-inpage.js)

The embedding controller uses the obvious approach:
- Run through all elements in the DOM tree and filter out those that have the mscgen_js class.
- For each element thus found attempt to parse and render its content as mscgen (or one of
  the three other supported languages).
- If the parsing doesn't work out, display the text of the element with the
  error the parser found highlighted.

### defer: prevent execution before DOM tree has loaded
When testing this on larger DOM trees (like the one of the [tutorial](https://sverweij.github.io/mscgen_js/tutorial.html)), we found that
sometimes the code would start executing before the browser completed loading
the DOM tree. The result of this was that the only part of the embedded
mscgen would be rendered.

Libraries like jquery have tricks up their sleeves to prevent this from happening.
However, we don't want to use more libraries than strictly necessary.
Less code == less to download == faster load times.

The solution we're using now is to use the `defer` attribute in the script
element. With this attribute in place most modern browsers (firefox, chrome, safari)
wait with loading and executing the script until the complete DOM tree is loaded
```html
<script src='https://sverweij.github.io/mscgen_js/mscgen-inpage.js' defer></script>
```

### One javascript file: requirejs and almond
As you can see mscgen_js keeps its functionality in separate amd modules
and uses r.js to smash em together in one ball of javascript, which
is loaded with require.js. The script tag would then look something like this:
```html
<script data-main='https://sverweij.github.io/mscgen_js/mscgen-inpage.js'
        src='https://sverweij.github.io/mscgen_js/lib/require.js' defer>
</script>
```

For embedding this has two drawbacks:
- The user will have to load two piece of javascript (slower).
- It's verbose.


James Burke wrote almond to circumvent exactly that. More information on the [almond github page](https://github.com/jrburke/almond).


## interactive interpreter
:page_with_curl: code in [ui-control/controller-interpreter.js](ui-control/controller-interpreter.js)

### Rendering in real time
When we built the first version of the on line interpreter we parsed and
rendered the chart at each key-up. It turned out the javascript
was more than fast enough to keep up, so we kept this approach.

In our enthousiasm we also started pre-rendering the raster graphics
versions, but that turned out to be too slow (data below), so
these are now generated when you actually click the button.

- rendering base64 encoded strings on each keystroke is too slow:
  - canvg is called twice for doing exactly the same (svg => canvas)
  - it inserts relatively big amounts of data in the DOM tree
    (typically 20k for svg, 60k for png, somewhat more for jpeg,
    not even corrected for the base64 penalty)
  - for bigger sources (e.g. test01_all_possible_arcs.mscin)
     auto rendering is unbearably slow, which stands to reason as
     the source tree has to be updated with  
     1.3 * (~250k (png) + ~250k (jpeg) + ~80k (svg)) = ~750k
     on each keystroke  
     How slow? 4-5 seconds for each keystroke for test01
     on a 2.53 GHz Intel Core 2 Duo running OS X 10.8.4 in
     FF 23/ Safari 6.0.5
  -  Only generating the svg to base64 encoding is doable in regular
     cases, but is noticeable in test01.

### Raster graphics - png and jpeg
For rendering raster graphics we use the `canvg` library, which takes
a piece of svg and renders it on a canvas. When that has happened, a
call to the canvas's `toDataURL` function suffices to return the base64
encoded version of the chart.

### The editor: code mirror
- choosing code mirror
- plugins used
- syntax highlighting for mscgen, xù and msgenny
