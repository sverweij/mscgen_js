(function(mod) {
    if ( typeof exports == "object" && typeof module == "object")// CommonJS
        mod(require("../../lib/codemirror"));
    else if ( typeof define == "function" && define.amd)// AMD
        define(["../../lib/codemirror"], mod);
    else// Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {

    function wordRegexp(words) {
        return new RegExp("^((" + words.join(")|(") + "))", "i");
    }

    function produceTokenFunction(pConfig) {
        return function(stream, state) {
            if (pConfig.keywords !== null && stream.match(wordRegexp(pConfig.keywords), true, true)) {
                return "keyword";
            }
            if (stream.match(wordRegexp(pConfig.brackets), true, true)) {
                return "bracket";
            }
            if (stream.match(wordRegexp(pConfig.options), true, true)) {
                return "keyword";
            }
            if (stream.match(wordRegexp(pConfig.arcs), true, true)) {
                return "keyword";
            }
            if (stream.match(wordRegexp(pConfig.attributes), true, true)) {
                return "attribute";
            }
            if (stream.match(/\"[^\"]*\"/, true, true)) {
                return "string";
            }
            if (stream.match(wordRegexp(pConfig.singlecomment), true, true)) {
                stream.skipToEnd();
                return "comment";
            }
            if (pConfig.operators !== null && stream.match(wordRegexp(pConfig.operators), true, true)) {
                return "operator";
            }
            var ch = stream.next();
            return "base";
        };
    }


    CodeMirror.defineMode("mscgen", function(config, parserConfig) {
        return {
            token : produceTokenFunction({
                "keywords" : ["msc"],
                "options" : ["hscale", "width", "arcgradient", "wordwraparcs"],
                "attributes" : ["label", "idurl", "id", "url", "linecolor", "linecolour", "textcolor", "textcolour", "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour", "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour", "arcskip"],
                "brackets" : ["\\[", "\\]", "\\{", "\\}"],
                "arcs" : ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "-x", "<-", "<<=", "<=", "<<", "<:", "-x", "note", "abox", "rbox", "box"],
                "singlecomment" : ["//", "#"],
                "operators" : ["="]
            })
        };
    });
    CodeMirror.defineMIME("text/mscgen", "text");

    CodeMirror.defineMode("xu", function(config, parserConfig) {
        return {
            token : produceTokenFunction({
                "keywords" : ["msc"],
                "options" : ["hscale", "width", "arcgradient", "wordwraparcs", "watermark"],
                "attributes" : ["label", "idurl", "id", "url", "linecolor", "linecolour", "textcolor", "textcolour", "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour", "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour", "arcskip"],
                "brackets" : ["\\[", "\\]", "\\{", "\\}"],
                "arcs" : ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "-x", "<-", "<<=", "<=", "<<", "<:", "-x", "note", "abox", "rbox", "box", "alt", "else", "opt", "break", "par", "seq", "strict", "neg", "critical", "ignore", "consider", "assert", "loop", "ref", "exc"],
                "singlecomment" : ["//", "#"],
                "operators" : ["="]
            })
        };
    });
    CodeMirror.defineMIME("text/xu", "text");

    CodeMirror.defineMode("msgenny", function(config, parserConfig) {
        return {
            startState : function() {
            },
            token : produceTokenFunction({
                "keywords" : null,
                "options" : ["hscale", "width", "arcgradient", "wordwraparcs", "watermark"],
                "attributes" : ["label", "idurl", "id", "url", "linecolor", "linecolour", "textcolor", "textcolour", "textbgcolor", "textbgcolour", "arclinecolor", "arclinecolour", "arctextcolor", "arctextcolour", "arctextbgcolor", "arctextbgcolour", "arcskip"],
                "brackets" : ["\\{", "\\}"],
                "arcs" : ["\\|\\|\\|", "\\.\\.\\.", "---", "--", "<->", "==", "<<=>>", "<=>", "\\.\\.", "<<>>", "::", "<:>", "->", "=>>", "=>", ">>", ":>", "-x", "<-", "<<=", "<=", "<<", "<:", "-x", "note", "abox", "rbox", "box", "alt", "else", "opt", "break", "par", "seq", "strict", "neg", "critical", "ignore", "consider", "assert", "loop", "ref", "exc"],
                "singlecomment" : ["//", "#"],
                "operators" : ["="]
            })
        };
    });
    CodeMirror.defineMIME("text/msgenny", "text");
});

/* DEFAULT THEME

 .cm-s-default .cm-keyword {color: #708;}
 .cm-s-default .cm-atom {color: #219;}
 .cm-s-default .cm-number {color: #164;}
 .cm-s-default .cm-def {color: #00f;}
 .cm-s-default .cm-variable {color: black;}
 .cm-s-default .cm-variable-2 {color: #05a;}
 .cm-s-default .cm-variable-3 {color: #085;}
 .cm-s-default .cm-property {color: black;}
 .cm-s-default .cm-operator {color: black;}
 .cm-s-default .cm-comment {color: #a50;}
 .cm-s-default .cm-string {color: #a11;}
 .cm-s-default .cm-string-2 {color: #f50;}
 .cm-s-default .cm-meta {color: #555;}
 .cm-s-default .cm-error {color: #f00;}
 .cm-s-default .cm-qualifier {color: #555;}
 .cm-s-default .cm-builtin {color: #30a;}
 .cm-s-default .cm-bracket {color: #997;}
 .cm-s-default .cm-tag {color: #170;}
 .cm-s-default .cm-attribute {color: #00c;}
 .cm-s-default .cm-header {color: blue;}
 .cm-s-default .cm-quote {color: #090;}
 .cm-s-default .cm-hr {color: #999;}
 .cm-s-default .cm-link {color: #00c;}

 .cm-negative {color: #d44;}
 .cm-positive {color: #292;}
 .cm-header, .cm-strong {font-weight: bold;}
 .cm-em {font-style: italic;}
 .cm-link {text-decoration: underline;}

 .cm-invalidchar {color: #f00;}

 div.CodeMirror span.CodeMirror-matchingbracket {color: #0f0;}
 div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #f22;}
 */
