# Node command line scripts
This folder contains a truckload of fairly trivial command line scripts
that read from standard input and write to standard output. For example:

```sh
# converts the input program bob_and_alice.msc to an
# abstract syntax tree
node msc2ast.js < bob_and_alice.msc > bob_and_alice.json

# converts cool.msc to an abstract syntax tree and feeds
# the result to the script that transforms these into
# a picture
node msc2ast.js < cool.msc | node ast2svg.js > cool.svg
```


## ast2svg.js
Where mscgen_js usually renders SVG graphics through the browser engine,
ast2svg.js uses `jsdom` - a node only implementation of the DOM. This works
but has a few drawbacks:
- Boxes and background colors might seem out of whack. This is
  because the `getBBox` function - which is quite essential
  when you need to know how big something is in an svg -  doesn't work.
- It won't run in node versions higher than 0.10.x. This is
  because jsdom supports to node version 0.10.x and continued
  development against `iojs`.

Hence, we're looking for a replacement for jsdom.
