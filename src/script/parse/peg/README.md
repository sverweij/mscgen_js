# Parsing
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
# Just a sample chart. Don't think too much of it :-).
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
- The order of attributes within arrays is guaranteed to be the same
  as in the source program.
- For all other objects the order is not guaranteed.
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

### Comments
The parser strips all comments from the source, which makes processing the
abstract syntax tree a lot simpler. It turned out that it was easy to save
comments that go on top of the source, without generating undue complexity.
In the AST they show up somewhere at the top, like this:
```json
"precomment": [
  "# Just a sample chart. Don't think too much of it :-).",
  "\n"
]
```

### Meta information
The three languages mscgen_js, support different feature sets. To
indicate if the AST uses extended feature sets, it contains a `meta` section.
```json
"meta": {
  "extendedOptions": false,
  "extendedArcTypes": false,
  "extendedFeatures": false
}
```
- `extendedOptions` - indicates if the AST contains a non standard option.
  (currently only `watermark`).
- `extendedArcTypes` - indicates if the AST contains at least one
  _inline expression_.
- `extendedFeatures` - indicates the AST contains extended options,
  extended features or both.
