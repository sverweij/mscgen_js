# Introduction
mscgen_js 


# Parsing
## Introduction
The parsers for ```mscgen```, ```msgenny``` and ```xù``` are all written in pegjs and
deliver the abstract syntax tree as a javascript object, which can be read and 
manipulated easily with javascript.

## Generating the parsers
To create javascript from the .pegjs source usable in node and commonjs:
```
pegjs mscgenparser.pegjs > mscgenparser_node.js
```

To create a parser that is usable in require.js, replace, do a trivial replace
```
commonjs2amd.sh mscgenparser_node.js > mscgenparser.js
```

## The abstract syntax tree
Consists of three parts: options, entities and arcs. Sample used in the explanation below:
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
### options
```json
  "options": {
    "arcgradient": "10",
    "hscale": "1.1",
    "width": "700",
    "wordwraparcs": "true"
  }
```

### entities 
an array of entities
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
(really: arc rows) a two dimensional array of arcs 
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