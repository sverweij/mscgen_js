mscgen_js
=========

With mscgen_js you can create sequence diagrams using the
text-based [mscgen][1] mini language within a browser. 
It accepts all valid mscgen programs and renders them while you
type.

No server side software needed.

Demo
----
You can find a [demo here][2].

Sample output
-------------
mscgen_js renders a scalable vector graphics (svg) image in page. 
[This msc source][4] would rending something like so:

![a sample sequence chart](/samples/readme.png) 

Compatibility with mscgen 
-------------------------
mscgen_js accepts *all* programs mscgen does ([specification][1]) and 
renders all of them. If you have a particular mscgen program mscgen_js 
is not rendering (correctly), feel free to file an [issue][5].


License
-------
This software is free software [licensed under GPLv3][3]. This means (a.o.) you _can_ use
it as part of other free software, but _not_ as part of non free (including commercial)
software.

[1]: http://www.mcternan.me.uk/mscgen/index.html
[2]: http://home.kpn.nl/chromx/mscgen_js/index.html
[3]: license.md
[4]: samples/readme.msc
[5]: https://github.com/sverweij/mscgen_js/issues?milestone=2&state=open
