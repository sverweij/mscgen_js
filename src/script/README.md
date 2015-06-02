# mscgen_js' innards
Here's some notes to ease the job of maintaining mscgen_js. It attempts to describe **how** it does
what it does and it tries to **explain** some of the **choices**.

The **main steps** mscgen_js takes to get from a textual description to
a picture:
- [_lexical analysis and parsing_](#lexical-analysis-and-parsing) to an abstract syntax tree.
- [_rendering_](#rendering-graphics) that abstract syntax tree into a picture.
- Besides these two steps it is useful to have some of
  [_controler_](#the-controllers) program that handles interaction with the user.
  We have two of them:
  - for [_embedding_](embedding-controller.md) textual descriptions in html
  - for the interactive [_interpreter_](ui-control/README.md)

## Lexical analysis and parsing
:page_with_curl: code in [parse/peg](parse/peg)

The parsers for `mscgen`, `msgenny` and `xù` are written in
PEG.js. This is a parser generator that smashes the tasks of lexical
analysis and parsing together. In the [parser folder](parse/peg/README.md) we describe
* [how to generate the parsers from pegjs](parse/peg/README.md#generating-the-parsers)
* [the structure of and principles behind the abstract syntax trees](parse/peg/README.md#the-abstract-syntax-tree)


## Rendering
### Rendering graphics
:page_with_curl: code in [render/graphics/](render/graphics)

*mscgen_js* by default renders its graphics to _scalable vector graphics_ (SVG).
In the [render folder](render/README.md) we
- motivate this choice,
- describe how our SVG is structured and
- how the rendering programs fill it.

### Rendering text
:page_with_curl: code in [render/text/](render/text)

To **translate** between the three sequence chart languages it supports and to
**generate** and **manipulate** other languages.

### Raster graphics?
:page_with_curl: code in [ui-control/controller-exporter.js](ui-control/controller-exporter.js)

You might have noticed the [interpreter](https://sverweij.github.io/mscgen_js)
also renders to jpeg and png. It's so simple we've put the few lines of
code in an exporter controller.


## The controllers

### Embedding
:page_with_curl: code in [mscgen-inpage.js](mscgen-inpage.js)

The controller for embedding is actually very simple. Details on how it works
and what design choices we made you can find [here](embedding-controller.md).

### Interactive interpreter
:page_with_curl: code in [ui-control/](ui-control)

The controller for the interpreter UI is less trivial.

## Testing
:page_with_curl: code in [test/](test)

About 250 automated tests (and counting) make sure refactoring most of
the back end code (parsing and rendering) can be done safely.

The ui controller tests are inherently harder to test automated. This
is why we did testing with a pair of eyeballs until now. We plan to
change that.
