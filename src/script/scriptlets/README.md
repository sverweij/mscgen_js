# Node command line scriptlets
This folder contained a truckload of fairly trivial command line scriptlets
that read from standard input and wrote to standard output.

The command line interface [`src/script/cli`](../cli) now replaces most of these scripts.

To convert MsGenny to MscGen via stdin and stdout via that:
```sh
   node mscgen.js -I msgenny -T mscgen -i - -o - < simplesample.msgenny > simplesample.mscgen
```

... or simpler, directly
```sh
   node mscgen.js -T mscgen -o simplesample.mscgen simplesample.msgenny 
```

### `ast2svg_nosource`
The only script remaining here. It takes an abstract syntax tree and renders 
the SVG _without_ embedding the original source in it.

```sh
    node ast2svg_nosource < funkysyntaxtree.json > vectorgraphicswitoutsource.svg
```

or in combination with the command line interface:
```sh
    node mscgen.js -p -i hello.mscin -o - | ast2svg_nosource > hello_without_source.svg
```
