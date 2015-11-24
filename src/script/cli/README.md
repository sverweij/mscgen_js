## Command line interface
Run `mscgen.js` with `-h` or `--help` as option to get all its options:

```
  Usage: mscgen [options] [infile]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -T --output-type <type>  Output file type: svg|mscgen|msgenny|xu|dot|doxygen
    -I --input-type <type>   Input file type: mscgen|xu|msgenny|ast
    -i --input-from <file>   File to read from. use - for stdin.
    -o --output-to <file>    File to write to. use - for stdout.
    -p --parser-output       Print parsed msc output
    -l --license             Display license and exit
```

> Note: rendering SVGs in nodejs is not perfect.
> See the bottom of this document for an explanation

## Samples
### Basic use: produce pictures from a script
This will generate a sequence chart called `intro02_starter.svg` in the
same directory as the `intro02_start.mscgen` script
```sh
    node mscgen.js intro02_starter.mscgen
```

If you want to have the output go somewhere else, specify it:
```sh
   node mscgen.js -o othername.svg intro02_starter.mscgen
```

`mscgen.js` will try to guess the type of script from the extension. Here
it will guess the input to be Xù. If it doesn't know, it'll assume it got
MscGen passed.
```sh
    node mscgen.js test51_with_alt.xu
```

If you want to override the guessing use -I, so to force the input to be 
parsed as MscGen:
```sh
    node mscgen.js -I mscgen test51_with_alt.xu
```


### Conversion
With `-T` you can specify the type of output. By default `mscgen.js` assumes
_svg_. Some other formats:

To convert an Xù or MsGenny script with advanced options back to
vanilla MscGen (without advanced options):
```sh
    node mscgen.js  -T mscgen -i funky.xu funky.mscgen
```

To convert an MscGen script to _graphviz dot_:
```sh
    node mscgen.js -T dot -i intro02_starter.mscgen intro02_starter.dot
```

You can also send specify standard output as a destination, so you can 
pipe the output to something else. E.g. to graphviz dot to further process
a dot program:
```sh
    node mscgen.js -T dot -i intro02_starter.mscgen -o - | dot -Tsvg > communicationsdiagram.svg
```


### Parser output and intput
To show how the parser interpreted your input into an abstract syntax tree use 
the `-p` option
```sh
    node mscgen.js -p -o parsed.json intro02_starter.mscgen
```

You can in turn render the abstract syntax tree by specifying it as input
type:
```sh
    node mscgen.js parsed.json
```

## Caveat: rendering SVGs in nodejs
Where mscgen_js usually renders SVG graphics through the browser engine,
mscgen.js uses `jsdom` - a node only implementation of the DOM. This works
but has a few drawbacks:
- Boxes and background colors might seem out of whack. This is
  because the `getBBox` function - which is quite essential
  when you need to know how big something is in an svg -  doesn't work.
- It won't run in node versions > 0.10.x and < 4.0.0 This is
  because jsdom supports to node version 0.10.x and continued
  development against `iojs` (which was merged into node 4)

Hence, we're looking for a replacement for jsdom (*phantomjs* and *slimerjs* are candidates).
