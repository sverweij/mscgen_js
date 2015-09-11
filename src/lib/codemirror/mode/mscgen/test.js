// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  var mode = CodeMirror.getMode({indentUnit: 2}, "mscgen");
  function MT(name) { test.mode(name, mode, Array.prototype.slice.call(arguments, 1)); }

  MT("empty chart",
     "[keyword msc] [bracket {] [bracket }]");
msc {}
  MT("comma-and-binop",
     "[keyword function](){ [keyword var] [def x] [operator =] [number 1] [operator +] [number 2], [def y]; }");


})();
