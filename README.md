# mscgen_js
*Turns text into sequence charts.*

- Fully functional on line [demo here][2]
- Uses the [mscgen][1] mini language. 
- Supports a [simplified subset of mscgen][5] for lazy bastards.
- Supports a [superset of mscgen][29] for the feature hungry.

## Sample
This sequence chart ...

![a sample sequence chart, rendered as png](wikum/readme.png)

was made with this *mscgen* source:
``` mscgen
msc {
  a [ label="Entity A", textbgcolor="red", textcolor="white" ],
  b [ label="Entity B", textbgcolor="yellow" ],
  c [ label="Entity C", textbgcolor="blue", textcolor="yellow" ];

  a->b [ label = "ab()" ] ;
  b->c [ label = "bc(TRUE)"];
  c=>>c [ label = "process(1)" ];
  b<<=c [ label = "callback()", arcskip="1"];
  |||;
  ---  [ label = "If more to run", ID="*" ];
  a->a [ label = "next()"];
  a=>c [ label = "ac1()"];
  b<<c [ label = "cb(true)", textbgcolor="lime"];
  b->b [ label = "stalled(...)"];
  a<<b [ label = "ab() = FALSE", textcolor="red", linecolor="red"], 
  c note c [ label="Just a note ...", linecolor="green", 
            textcolor="green", textbgcolor="lime" ];
}
```

## mscgen_js and the mscgen standard
mscgen_js was made to go both ways:

- Accept all valid [mscgen][1] programs and render them correctly. 
- Have all valid mscgen programs accepted by mscgen_js accepted and rendered
  correctly by mscgen.

Moreover [ms genny][5], the simplified subset, translates to mscgen with the 
flip of a switch.

If you find proof to the contrary on any of this [tell us][6].


## Building mscgen_js yourself

See [build.md][7]

## License
This software is free software [licensed under GPLv3][3]. This means (a.o.) you _can_ use
it as part of other free software, but _not_ as part of non free software.

mscgen_js is built on various libraries, each of which have their own license (incidentally all
MIT style). In order of significance: [pegjs][12], [codemirror][13], [canvg][16], [jsdom][25], 
[requirejs][19], [jQuery][14], [amdefine][20]. 
Icons courtesy of Dmitry Baranovskiy [license][18].

It uses [mocha][21], [jshint][22] and [plato][23] to maintain some modicum of verifiable code quality. 

## Thanks
- [Mike McTernan][1] for creating the wonderful mscgen standard, the accompanying c implementation and for 
  releasing both to the public domain (the last one under a [GPLv2][18] license to be precise).
- [David Majda][8] for cooking and maintaining the fantastic and lightning fast [PEG.js][9] parser generator.
- [Marijn Haverbeke][10] for the snazzy [CodeMirror][11] editor component.
- Gabe Lerner for the [canvg][17] library, which makes converting vector graphics to rasters _almost_
  like a walk in the park. 
- [Elijah Insua][24] for [jsdom][25], which makes it possible to render vector graphics in node.js.

[1]: http://www.mcternan.me.uk/mscgen
[2]: http://sverweij.github.io/mscgen_js
[3]: wikum/licenses/license.mscgen_js.md
[5]: wikum/msgenny.md
[6]: https://github.com/sverweij/mscgen_js/issues?milestone=2&state=open
[7]: wikum/build.md
[8]: http://majda.cz/en/
[9]: http://pegjs.majda.cz/
[10]: http://marijnhaverbeke.nl
[11]: http://codemirror.net
[12]: wikum/licenses/license.pegjs.md
[13]: wikum/licenses/license.codemirror.md
[14]: wikum/licenses/license.jquery.md
[15]: wikum/licenses/license.icons.md
[16]: wikum/licenses/license.canvg.md
[17]: http://code.google.com/p/canvg/
[18]: http://code.google.com/p/mscgen/source/browse/trunk/COPYING
[19]: wikum/licenses/license.requirejs.md
[20]: wikum/licenses/license.amdefine.md
[21]: wikum/licenses/license.mocha.md
[22]: wikum/licenses/license.jshint.md
[23]: wikum/licenses/license.plato.md
[24]: http://tmpvar.com/
[25]: https://github.com/tmpvar/jsdom
[25]: wikum/licenses/license.jsdom.md
[26]: http://cs.brown.edu/~dap/
[27]: https://npmjs.org/package/posix-getopt
[29]: wikum/xu.md
