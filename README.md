# mscgen_js
*Turns text into sequence charts.*

[![Build Status](https://travis-ci.org/sverweij/mscgen_js.svg?branch=master)][travis.mscgenjs]
[![Code Climate](https://codeclimate.com/github/sverweij/mscgen_js/badges/gpa.svg)][codeclimate.mscgenjs]
[![test coverage (codecov.io)](http://codecov.io/github/sverweij/mscgen_js/coverage.svg?branch=master)](http://codecov.io/github/sverweij/mscgen_js?branch=master)
[![Dependency Status](https://david-dm.org/sverweij/mscgen_js.svg)](https://david-dm.org/sverweij/mscgen_js)
[![devDependency Status](https://david-dm.org/sverweij/mscgen_js/dev-status.svg)](https://david-dm.org/sverweij/mscgen_js#info=devDependencies)
[![mscgen.js.org](https://img.shields.io/badge/js.org-mscgen-ffb400.svg?style=flat-squared)](https://mscgen.js.org)
- Implementation of the super easy [MscGen][mscgen] in javascript.
- [Embeddable][mscgenjs.embed] in your html.
- Try it in the [on line interactive interpreter][mscgenjs.interpreter].
- Or in [atom][atom] with the [atom mscgen-preview package][mscgen-preview].
- Also
  - talks a [simplified subset of MscGen][mscgenjs.wikum.msgenny] for lazy bastards.
  - speaks a [superset of MscGen][mscgenjs.wikum.xu] for the feature hungry.
  - runs in all modern browsers (and in _node.js_).
  - animates your chart.

## Sample
This sequence chart ...

![a sample sequence chart, rendered as png](wikum/readme.png)

was made with this *MscGen* source:

```mscgen
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
([Open this chart in the online interpreter](https://sverweij.github.io/mscgen_js/index.html?lang=mscgen&msc=msc%20{%0A%20%20a%20[%20label%3D%22Entity%20A%22%2C%20textbgcolor%3D%22red%22%2C%20textcolor%3D%22white%22%20]%2C%0A%20%20b%20[%20label%3D%22Entity%20B%22%2C%20textbgcolor%3D%22yellow%22%20]%2C%0A%20%20c%20[%20label%3D%22Entity%20C%22%2C%20textbgcolor%3D%22blue%22%2C%20textcolor%3D%22yellow%22%20]%3B%0A%0A%20%20a-%3Eb%20[%20label%20%3D%20%22ab%28%29%22%20]%20%3B%0A%20%20b-%3Ec%20[%20label%20%3D%20%22bc%28TRUE%29%22]%3B%0A%20%20c%3D%3E%3Ec%20[%20label%20%3D%20%22process%281%29%22%20]%3B%0A%20%20b%3C%3C%3Dc%20[%20label%20%3D%20%22callback%28%29%22%2C%20arcskip%3D%221%22]%3B%0A%20%20|||%3B%0A%20%20---%20%20[%20label%20%3D%20%22If%20more%20to%20run%22%2C%20ID%3D%22*%22%20]%3B%0A%20%20a-%3Ea%20[%20label%20%3D%20%22next%28%29%22]%3B%0A%20%20a%3D%3Ec%20[%20label%20%3D%20%22ac1%28%29%22]%3B%0A%20%20b%3C%3Cc%20[%20label%20%3D%20%22cb%28true%29%22%2C%20textbgcolor%3D%22lime%22]%3B%0A%20%20b-%3Eb%20[%20label%20%3D%20%22stalled%28...%29%22]%3B%0A%20%20a%3C%3Cb%20[%20label%20%3D%20%22ab%28%29%20%3D%20FALSE%22%2C%20textcolor%3D%22red%22%2C%20linecolor%3D%22red%22]%2C%0A%20%20c%20note%20c%20[%20label%3D%22Just%20a%20note%20...%22%2C%20linecolor%3D%22green%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20textcolor%3D%22green%22%2C%20textbgcolor%3D%22lime%22%20]%3B%0A}))

## mscgen_js and the MscGen standard
mscgen_js was made to go both ways:

- Accept all valid [MscGen][mscgen] programs and render them correctly.
- Have all valid MscGen programs accepted by mscgen_js accepted and rendered
  correctly by MscGen.

Moreover [MsGenny][mscgenjs.wikum.msgenny], the simplified subset, translates
to MscGen with the flip of a switch.

If you find proof to the contrary on any of this
[tell us][mscgenjs.issues.compliance].


## Building mscgen_js yourself
See [build.md][mscgenjs.docbuild]. If you want to understand how mscgen_js'
innards work: we try to explain that
[in the script folder][mscgenjs.docsource].

## More mscgen_js

- Embedding MscGen in HTML: [mscgenjs-inpage][mscgenjs.inpage]
  - Tight, standalone front end library that renders MscGen (and the two
   derivative languages) within any HTML. As used in the tutorial and the
   embedding guide.   
  - `npm install mscgenjs-inpage`
  - (This replaces the provisional bower package with the same
     purpose).

- Command line interface: [mscgenjs-cli][mscgenjs.cli]
  - Option syntax is similar to the original `mscgen`, so
    in theory you could use it as a drop-in replacement for that.
  - `npm install mscgenjs-cli`

- MscGen package for the atom editor
  - Has real-time rendering, W00t syntax highlighting, svg & png export
    and some other cool stuff. Check it out on [github][mscgenjs.atom.preview]
    or on [atom.io][https://atom.io/packages/mscgen-preview].
  - Installing: directly from within Atom or with the atom package manager
    (`apm install mscgen-preview`).

- [mscgenjs-core][mscgenjs.core]
  - Library package. Contains the parsing and rendering logic for all mscgenjs.
  - `npm install mscgenjs`

## License information
This software is free software [licensed under GPLv3][mscgenjs.license].
This means (a.o.) you _can_ use it as part of other free software, but
_not_ as part of non free software. We have a slight relaxation for when
you'd want to use `mscgen-inpage.js`.

### Commercial use of embedding mscgen using mscgen-inpage.js
In addition to the GNU public license, for the use of the minified version
of the embedding code (```mscgen-inpage.js```) as described on
[embedding][mscgenjs.embed] a special exception to the GPL is made:  

> As a special exception to the GPL, any HTML file which merely makes
function calls to mscgen-inpage.js, and for that purpose includes
it by reference shall be deemed a separate work for copyright law
purposes. In addition, the copyright holders of this code give you
permission to combine this code with free software libraries that
are released under the GNU LGPL. You may copy and distribute such
a system following the terms of the GNU GPL for this code and the
LGPL for the libraries. If you modify this code, you may extend
this exception to your version of the code, but you are not obligated
to do so. If you do not wish to do so, delete this exception statement
from your version.

### Dependencies and their licenses
mscgen_js is built on various libraries, each of which have their own
license (incidentally all MIT style):
- [requirejs][requirejs.license] is used for modularization.
- The bare (embedding only) mscgen_js is packaged using requirejs and
  [almond][almond] to be able to run as a stand alone, dependency-less
  package.
- Parsers are generated with [pegjs][pegjs.license].
- The on line interpreter additionally uses [codemirror][codemirror.license].
- The command line interface uses [phantomjs][phantomjs],
  [amdefine][amdefine.license] and [commander][commander.license]
- To run automated tests in node mscgen_js uses [jsdom][jsdom.license],
  [amdefine][amdefine.license], [node-localstorage][36] and
  [commander][commander.license].

Icons courtesy of Dmitry Baranovskiy [license][15].

- Icons in the animation, were created with the [IcoMoon App][icomoon].
At the time the font was created it was licensed[GPLv3][license.gpl-3.0] or
[CC BY 4.0][license.ccby4]

It uses [mocha][21], [chai][39],
[istanbul][28], [jshint][22], [plato][23] and
[nsp][35] to maintain some modicum of verifiable code quality.
You can see the build history in [Travis][travis.mscgenjs] and an indication
of the shape of the code at [Code Climate ][codeclimate.mscgenjs].

## Thanks
- [Mike McTernan][mscgen.author] for creating the wonderful MscGen language,
  the accompanying c implementation and for releasing both to the public
  domain (the last one under a [GPLv2][mscgen.license] license to be precise).
- [David Majda][pegjs.author] for cooking and maintaining the fantastic
  and lightning fast [PEG.js][pegjs] parser generator.
- [Marijn Haverbeke][codemirror.author] for the snazzy
  [CodeMirror][codemirror] editor component.
- [Elijah Insua][jsdom.author] for [jsdom][jsdom], which makes it possible
  to render vector graphics in node.js.
- [Audrey M. Roy][favicon.author] for the excelent
  ["painfully obsessive cheat sheet to favicon sizes/types."][favicon].
- [Joshua Chaitin-Pollak](https://github.com/jbcpollak), for suggesting
   to publish mscgen_js as a package.

[almond]: https://github.com/jrburke/almond
[amdefine.license]: wikum/licenses/license.amdefine.md
[atom]: https://atom.io
[codeclimate.mscgenjs]: https://codeclimate.com/github/sverweij/mscgen_js
[codemirror]: http://codemirror.net
[codemirror.author]: http://marijnhaverbeke.nl
[codemirror.license]: wikum/licenses/license.codemirror.md
[commander.license]: wikum/licenses/license.commander.md
[favicon]: https://github.com/audreyr/favicon-cheat-sheet
[favicon.author]: http://www.audreymroy.com/
[icomoon]: https://icomoon.io/app/
[jsdom]: https://github.com/tmpvar/jsdom
[jsdom.author]: http://tmpvar.com/
[jsdom.license]: wikum/licenses/license.jsdom.md
[license.gpl-3.0]: http://www.gnu.org/licenses/gpl.html
[license.ccby4]: https://creativecommons.org/licenses/by/4.0/
[mscgen]: http://www.mcternan.me.uk/mscgen
[mscgen.author]: http://www.mcternan.me.uk/mscgen
[mscgen.license]: http://code.google.com/p/mscgen/source/browse/trunk/COPYING
[mscgen-preview]: https://atom.io/packages/mscgen-preview
[mscgenjs.docbuild]: wikum/build.md
[mscgenjs.docsource]: src/script
[mscgenjs.embed]: https://sverweij.github.io/mscgen_js/embed.html
[mscgenjs.embedpackage]: https://sverweij.github.io/mscgen_js/embed.html#package
[mscgenjs.interpreter]: https://sverweij.github.io/mscgen_js
[mscgenjs.issues.compliance]: https://github.com/sverweij/mscgen_js/labels/compliance
[mscgenjs.license]: wikum/licenses/license.mscgen_js.md
[mscgenjs.wikum.msgenny]: wikum/msgenny.md
[mscgenjs.wikum.xu]: wikum/xu.md
[mscgenjs.core]: https://github.com/sverweij/mscgenjs-core
[mscgenjs.inpage]: https://github.com/sverweij/mscgenjs-inpage
[mscgenjs.cli]: https://github.com/sverweij/mscgenjs-cli
[mscgenjs.atom.preview]: https://github.com/sverweij/atom-mscgen-preview
[pegjs]: http://majda.cz/en/
[pegjs.author]: http://pegjs.majda.cz/
[pegjs.license]: wikum/licenses/license.pegjs.md
[phantomjs]: https://www.npmjs.com/package/phantomjs
[requirejs.license]: wikum/licenses/license.requirejs.md
[travis.mscgenjs]: https://travis-ci.org/sverweij/mscgen_js
[15]: wikum/licenses/license.icons.md
[21]: wikum/licenses/license.mocha.md
[22]: wikum/licenses/license.jshint.md
[23]: wikum/licenses/license.plato.md
[28]: wikum/licenses/license.istanbul.md
[35]: https://nodesecurity.io/
[36]: wikum/licenses/license.node-localstorage.md
[39]: https://github.com/chaijs/chai
