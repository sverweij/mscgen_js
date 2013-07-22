mscgen_js
=========
*Turns text into sequence charts.*
- Uses the [mscgen][1] mini language. 
- Supports a [simplified subset of mscgen][5] for lazy bastards.
- [Demo here][2]

Sample
------
[This msc source][4] would rending something like so:

![a sample sequence chart](test/readme.png) 
mscgen_js renders a scalable vector graphics (svg) image in page. 

mscgen_js and the mscgen standard
---------------------------------
mscgen_js was made to go both ways:
- accept all valid [mscgen][1] programs and render them correctly. 
- all valid mscgen programs accepted by by mscgen_js are accepted and rendered
  correctly by mscgen.

If you find proof to the contrary [tell us][6].

License
-------
This software is free software [licensed under GPLv3][3]. This means (a.o.) you _can_ use
it as part of other free software, but _not_ as part of non free (including commercial)
software.


Thanks
------
- [Mike McTernan][7] For creating the wonderful mscgen standard + c implementation and releasing it to the public domain.
- [David Majda][8] For cooking & maintaining the fantastic [PEG.js][9] parser generator.

[1]: http://www.mcternan.me.uk/mscgen/index.html
[2]: http://home.kpn.nl/chromx/mscgen_js/index.html
[3]: license.md
[4]: test/readme.msc
[5]: spec/will/go/here/TODO
[6]: https://github.com/sverweij/mscgen_js/issues?milestone=2&state=open
[7]: http://www.mcternan.me.uk/mscgen
[8]: http://majda.cz/en/
[9]: http://pegjs.majda.cz/
