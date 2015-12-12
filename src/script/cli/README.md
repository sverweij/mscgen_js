## Command line interface
Run `mscgen.js` with `-h` or `--help` as option to get all its options:

```
  Usage: mscgen [options] [infile]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -T --output-type <type>  one of svg|png|jpeg|mscgen|msgenny|xu|dot|doxygen
    -I --input-type <type>   one of mscgen|xu|msgenny|ast
    -i --input-from <file>   File to read from. use - for stdin.
    -o --output-to <file>    File to write to. use - for stdout.
    -p --parser-output       Print parsed msc output
    -l --license             Display license and exit
```

Writing to stdout works currently only works for non-graphical output formats
(mscgen, msgenny, xu, dot, doxygen).

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
With `-T` (or `--output-type` you can specify the type of output.
By default `mscgen.js` assumes _svg_. Some other formats:

To convert an Xù or MsGenny script with advanced options back to
vanilla MscGen (without advanced options):
```sh
    node mscgen.js  -T mscgen -i funky.xu funky.mscgen
```

To convert an MscGen script to _graphviz dot_:
```sh
    node mscgen.js -T dot -i intro02_starter.mscgen intro02_starter.dot
```

To convert to raster graphics
```sh
    node mscgen.js -T png -i dolores.mscgen -o dolores.png
```

You can also send specify standard output as a destination, so you can
pipe the output to something else. E.g. to graphviz dot to further process
a dot program:
```sh
    node mscgen.js -T dot -i intro02_starter.mscgen -o - | dot -Tsvg > communicationsdiagram.svg
```

### Parser output and input
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
